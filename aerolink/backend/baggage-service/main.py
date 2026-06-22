from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import logging
import boto3
from botocore.exceptions import ClientError

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment Variables
AWS_REGION = os.getenv("AWS_REGION", "eu-west-1")
DYNAMODB_TABLE = os.getenv("BAGGAGE_DYNAMODB_TABLE", "aerolink-baggage")

app = FastAPI(title="AeroLink Baggage Service", description="API for baggage tracking with DynamoDB")

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

class BaggageUpdate(BaseModel):
    booking_id: str
    status: str
    location: str

# Fallback Mock DB
baggage_db = {}

@app.post("/baggage/update")
def update_baggage(update: BaggageUpdate):
    # In a real app, this might be triggered by an event stream (EventBridge/Kafka)
    baggage_id = f"BAG-{update.booking_id[:6]}"
    
    if use_mock_db:
        baggage_db[baggage_id] = {
            "booking_id": update.booking_id,
            "status": update.status,
            "location": update.location
        }
        return {"baggage_id": baggage_id, "status": "updated successfully (mock)"}
    
    # Real DynamoDB Update
    try:
        table.put_item(
            Item={
                'baggage_id': baggage_id,
                'booking_id': update.booking_id,
                'status': update.status,
                'location': update.location
            }
        )
        return {"baggage_id": baggage_id, "status": "updated successfully"}
    except ClientError as e:
        logger.error(f"DynamoDB error updating baggage: {e.response['Error']['Message']}")
        raise HTTPException(status_code=500, detail="Database Error")

@app.get("/baggage/{baggage_id}")
def get_baggage_status(baggage_id: str):
    if use_mock_db:
        if baggage_id not in baggage_db:
            raise HTTPException(status_code=404, detail="Baggage not found")
        return baggage_db[baggage_id]
        
    try:
        response = table.get_item(Key={'baggage_id': baggage_id})
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="Baggage not found")
        return response['Item']
    except ClientError as e:
        logger.error(f"DynamoDB error: {e}")
        raise HTTPException(status_code=500, detail="Database Error")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "mock" if use_mock_db else "dynamodb"}
