from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
import uuid

# JWT Configuration
SECRET_KEY = "aerolink-enterprise-secret-key-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(title="AeroLink Booking Service", description="API for flight bookings with JWT Auth", version="1.0.0")
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

# Mock Database
bookings_db = {}
# Hardcoded user for assignment purposes
users_db = {
    "passenger": {
        "username": "passenger",
        "password": "password123", # Plain text for demo
        "email": "passenger@aerolink.com"
    }
}

# --- AUTHENTICATION ENDPOINTS ---

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
async def read_users_me(current_user: str = Depends(verify_token)):
    user = users_db.get(current_user)
    return {"username": user["username"], "email": user["email"]}


# --- BOOKING ENDPOINTS (PROTECTED) ---

@app.post("/bookings", response_model=BookingResponse)
def create_booking(booking: BookingRequest, current_user: str = Depends(verify_token)):
    if not booking.passenger_name or not booking.flight_number:
        raise HTTPException(status_code=400, detail="Invalid booking data")
    
    booking_id = str(uuid.uuid4())
    bookings_db[booking_id] = {
        "passenger_name": booking.passenger_name,
        "flight_number": booking.flight_number,
        "status": "CONFIRMED",
        "booked_by": current_user
    }
    
    return BookingResponse(
        booking_id=booking_id,
        status="CONFIRMED",
        message="Booking created successfully"
    )

@app.get("/bookings/{booking_id}")
def get_booking(booking_id: str, current_user: str = Depends(verify_token)):
    if booking_id not in bookings_db:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking = bookings_db[booking_id]
    if booking["booked_by"] != current_user:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
        
    return booking

@app.get("/health")
def health_check():
    return {"status": "healthy"}
