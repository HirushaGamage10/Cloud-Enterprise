from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="AeroLink Baggage Service", description="API for baggage tracking")

class BaggageUpdate(BaseModel):
    booking_id: str
    status: str
    location: str

# In-memory DB simulating DynamoDB
baggage_db = {}

@app.post("/baggage/update")
def update_baggage(update: BaggageUpdate):
    # In a real app, this might be triggered by an event stream (EventBridge/Kafka)
    baggage_id = f"BAG-{update.booking_id[:6]}"
    baggage_db[baggage_id] = {
        "booking_id": update.booking_id,
        "status": update.status,
        "location": update.location
    }
    return {"baggage_id": baggage_id, "status": "updated successfully"}

@app.get("/baggage/{baggage_id}")
def get_baggage_status(baggage_id: str):
    if baggage_id not in baggage_db:
        raise HTTPException(status_code=404, detail="Baggage not found")
    return baggage_db[baggage_id]

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
