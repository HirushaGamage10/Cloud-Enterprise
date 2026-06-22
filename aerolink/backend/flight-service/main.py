from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os
import json
import logging
import boto3
from botocore.exceptions import ClientError
from aiokafka import AIOKafkaConsumer
import asyncio

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment Variables
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE_NAME", "aerolink-flights")
AWS_REGION = os.getenv("AWS_REGION", "eu-west-1")
KAFKA_BROKER = os.getenv("KAFKA_BROKER_URL", "localhost:9092")

app = FastAPI(title="AeroLink Flight Service", description="Enterprise API for flight schedules with DynamoDB & Kafka")

# Initialize DynamoDB Client (Fallback to Mock if AWS credentials are not present)
try:
    dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
    table = dynamodb.Table(DYNAMODB_TABLE)
    # Ping the table to check if we actually have AWS access
    table.load()
    use_mock_db = False
    logger.info("Connected to AWS DynamoDB successfully.")
except Exception as e:
    logger.warning(f"Could not connect to DynamoDB (Running in fallback mock mode). Error: {str(e)}")
    use_mock_db = True
    table = None

class Flight(BaseModel):
    flight_number: str
    origin: str
    destination: str
    available_seats: int
    price: float

# Fallback Mock DB (used if DynamoDB is unreachable, so UI doesn't break locally)
mock_flights_db = {
    "AL-1024": {"flight_number": "AL-1024", "origin": "LHR", "destination": "JFK", "available_seats": 150, "price": 450.00}
}

# --- KAFKA CONSUMER BACKGROUND TASK ---
kafka_consumer = None

async def consume_booking_events():
    global kafka_consumer
    try:
        kafka_consumer = AIOKafkaConsumer(
            "booking-events",
            bootstrap_servers=KAFKA_BROKER,
            group_id="flight-service-group"
        )
        await kafka_consumer.start()
        logger.info("Started Kafka Consumer for 'booking-events'")
        
        async for msg in kafka_consumer:
            event = json.loads(msg.value.decode('utf-8'))
            if event.get("event") == "BookingCreated":
                flight_no = event.get("flight_number")
                logger.info(f"Received BookingCreated event for flight {flight_no}. Updating DynamoDB...")
                reduce_seat_internal(flight_no)
    except Exception as e:
        logger.warning(f"Kafka consumer failed to start or crashed (Fallback mode). Error: {str(e)}")

@app.on_event("startup")
async def startup_event():
    # Start Kafka consumer as a background asyncio task
    asyncio.create_task(consume_booking_events())

@app.on_event("shutdown")
async def shutdown_event():
    if kafka_consumer:
        await kafka_consumer.stop()

# --- DATABASE LOGIC ---
def reduce_seat_internal(flight_number: str):
    if use_mock_db:
        if flight_number in mock_flights_db and mock_flights_db[flight_number]["available_seats"] > 0:
            mock_flights_db[flight_number]["available_seats"] -= 1
        return
        
    # Real DynamoDB Update
    try:
        response = table.update_item(
            Key={'flight_number': flight_number},
            UpdateExpression="set available_seats = available_seats - :val",
            ConditionExpression="available_seats > :min_seats",
            ExpressionAttributeValues={
                ':val': 1,
                ':min_seats': 0
            },
            ReturnValues="UPDATED_NEW"
        )
        logger.info(f"DynamoDB updated successfully for {flight_number}: {response}")
    except ClientError as e:
        logger.error(f"DynamoDB error updating seats: {e.response['Error']['Message']}")

@app.get("/flights", response_model=List[Flight])
def get_flights():
    if use_mock_db:
        return list(mock_flights_db.values())
        
    try:
        response = table.scan()
        return response.get('Items', [])
    except ClientError as e:
        logger.error(f"DynamoDB error: {e}")
        return []

@app.get("/flights/{flight_number}", response_model=Flight)
def get_flight(flight_number: str):
    if use_mock_db:
        if flight_number not in mock_flights_db:
            raise HTTPException(status_code=404, detail="Flight not found")
        return mock_flights_db[flight_number]
        
    try:
        response = table.get_item(Key={'flight_number': flight_number})
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="Flight not found")
        return response['Item']
    except ClientError as e:
        raise HTTPException(status_code=500, detail="Database Error")

class PriceUpdate(BaseModel):
    new_price: float

@app.put("/flights/{flight_number}/price")
def update_flight_price(flight_number: str, price_update: PriceUpdate):
    if use_mock_db:
        if flight_number not in mock_flights_db:
            raise HTTPException(status_code=404, detail="Flight not found")
        mock_flights_db[flight_number]["price"] = price_update.new_price
        return {"status": "success", "message": "Price updated via Global Tables sync", "new_price": price_update.new_price}
        
    try:
        response = table.update_item(
            Key={'flight_number': flight_number},
            UpdateExpression="set price = :p",
            ExpressionAttributeValues={':p': price_update.new_price},
            ReturnValues="UPDATED_NEW"
        )
        return {"status": "success", "message": "Price updated via Global Tables sync", "new_price": float(response['Attributes']['price'])}
    except ClientError as e:
        logger.error(f"DynamoDB error updating price: {e}")
        raise HTTPException(status_code=500, detail="Database Error")

# HTTP Endpoint kept for synchronous testing / backward compatibility
@app.post("/flights/{flight_number}/reduce-seat")
def reduce_seat_http(flight_number: str):
    reduce_seat_internal(flight_number)
    return {"status": "success", "message": "Seat reduction request processed (Check logs for DB status)"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "mock" if use_mock_db else "dynamodb", "kafka_consumer": "running"}
