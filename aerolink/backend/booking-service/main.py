from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
import uuid
import os
import json
import logging
from sqlalchemy import create_engine, Column, String, MetaData, Table
from aiokafka import AIOKafkaProducer
import asyncio

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment Variables for Cloud Services
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aerolink_bookings.db") # Fallback to sqlite locally, Aurora in Prod
KAFKA_BROKER = os.getenv("KAFKA_BROKER_URL", "localhost:9092")

# Database Setup (Aurora PostgreSQL via SQLAlchemy)
engine = create_engine(DATABASE_URL)
metadata = MetaData()
bookings_table = Table(
    "bookings",
    metadata,
    Column("booking_id", String, primary_key=True),
    Column("passenger_name", String),
    Column("flight_number", String),
    Column("status", String),
    Column("booked_by", String),
)
metadata.create_all(engine)

# JWT Configuration
SECRET_KEY = "aerolink-enterprise-secret-key-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(title="AeroLink Booking Service", description="Enterprise API for flight bookings with Aurora & Kafka", version="2.0.0")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Models
class BookingRequest(BaseModel):
    passenger_name: str
    flight_number: str

class BookingResponse(BaseModel):
    booking_id: str
    status: str
    message: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    username: str
    email: str

# Hardcoded user for assignment purposes
users_db = {
    "passenger": {
        "username": "passenger",
        "password": "password123",
        "email": "passenger@aerolink.com"
    }
}

# --- KAFKA PRODUCER SETUP ---
kafka_producer = None

@app.on_event("startup")
async def startup_event():
    global kafka_producer
    try:
        kafka_producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BROKER)
        await kafka_producer.start()
        logger.info("Connected to Kafka cluster successfully.")
    except Exception as e:
        logger.warning(f"Kafka connection failed (Running in fallback mode). Error: {str(e)}")
        kafka_producer = None

@app.on_event("shutdown")
async def shutdown_event():
    if kafka_producer:
        await kafka_producer.stop()

async def publish_booking_event(booking_id: str, flight_number: str):
    if kafka_producer:
        event_data = {
            "event": "BookingCreated",
            "booking_id": booking_id,
            "flight_number": flight_number,
            "timestamp": datetime.utcnow().isoformat()
        }
        try:
            await kafka_producer.send_and_wait("booking-events", json.dumps(event_data).encode("utf-8"))
            logger.info(f"Published BookingCreated event to Kafka for flight {flight_number}")
        except Exception as e:
            logger.error(f"Failed to publish to Kafka: {str(e)}")
    else:
        logger.info(f"[SIMULATED KAFKA] Published BookingCreated event for flight {flight_number}")

# --- AUTHENTICATION ENDPOINTS ---
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"})

@app.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
async def read_users_me(current_user: str = Depends(verify_token)):
    user = users_db.get(current_user)
    return {"username": user["username"], "email": user["email"]}

# --- BOOKING ENDPOINTS (PROTECTED & TRANSACTIONAL) ---
@app.post("/bookings", response_model=BookingResponse)
async def create_booking(booking: BookingRequest, background_tasks: BackgroundTasks, current_user: str = Depends(verify_token)):
    if not booking.passenger_name or not booking.flight_number:
        raise HTTPException(status_code=400, detail="Invalid booking data")
    
    booking_id = str(uuid.uuid4())
    
    # Database Transaction (Aurora DB)
    try:
        with engine.connect() as conn:
            ins = bookings_table.insert().values(
                booking_id=booking_id,
                passenger_name=booking.passenger_name,
                flight_number=booking.flight_number,
                status="CONFIRMED",
                booked_by=current_user
            )
            conn.execute(ins)
            conn.commit()
            logger.info(f"Booking {booking_id} saved to database.")
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Database Error")
    
    # Event-Driven Architecture: Publish to Kafka via background task
    background_tasks.add_task(publish_booking_event, booking_id, booking.flight_number)
    
    return BookingResponse(booking_id=booking_id, status="CONFIRMED", message="Booking created successfully")

@app.get("/bookings/{booking_id}")
def get_booking(booking_id: str, current_user: str = Depends(verify_token)):
    try:
        with engine.connect() as conn:
            query = bookings_table.select().where(bookings_table.c.booking_id == booking_id)
            result = conn.execute(query).fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Booking not found")
            
            # result is a tuple-like object in SQLAlchemy 2.0
            booking = {
                "booking_id": result[0],
                "passenger_name": result[1],
                "flight_number": result[2],
                "status": result[3],
                "booked_by": result[4]
            }
            
            if booking["booked_by"] != current_user:
                raise HTTPException(status_code=403, detail="Not authorized to view this booking")
            return booking
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Database Error")

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected", "kafka": "ready" if kafka_producer else "fallback"}
