from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid

app = FastAPI(title="AeroLink Booking Service", description="API for flight bookings", version="1.0.0")

class BookingRequest(BaseModel):
    passenger_name: str
    flight_number: str

class BookingResponse(BaseModel):
    booking_id: str
    status: str
    message: str

# In-memory storage for demonstration
bookings_db = {}

@app.post("/bookings", response_model=BookingResponse)
def create_booking(booking: BookingRequest):
    # Simulate booking logic
    if not booking.passenger_name or not booking.flight_number:
        raise HTTPException(status_code=400, detail="Invalid booking data")
    
    booking_id = str(uuid.uuid4())
    bookings_db[booking_id] = {
        "passenger_name": booking.passenger_name,
        "flight_number": booking.flight_number,
        "status": "CONFIRMED"
    }
    
    return BookingResponse(
        booking_id=booking_id,
        status="CONFIRMED",
        message="Booking created successfully"
    )

@app.get("/bookings/{booking_id}")
def get_booking(booking_id: str):
    if booking_id not in bookings_db:
        raise HTTPException(status_code=404, detail="Booking not found")
    return bookings_db[booking_id]

@app.get("/health")
def health_check():
    return {"status": "healthy"}
