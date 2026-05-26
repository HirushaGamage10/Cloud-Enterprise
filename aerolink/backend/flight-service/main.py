from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(title="AeroLink Flight Service", description="API for flights and seat availability")

class Flight(BaseModel):
    flight_number: str
    origin: str
    destination: str
    available_seats: int
    price: float

# In-memory DB simulating DynamoDB
flights_db = {
    "AL-1024": {"flight_number": "AL-1024", "origin": "LHR", "destination": "JFK", "available_seats": 150, "price": 450.00}
}

@app.get("/flights", response_model=List[Flight])
def get_flights():
    return list(flights_db.values())

@app.get("/flights/{flight_number}", response_model=Flight)
def get_flight(flight_number: str):
    if flight_number not in flights_db:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flights_db[flight_number]

# Simulates Event-Driven update from BookingService
@app.post("/flights/{flight_number}/reduce-seat")
def reduce_seat(flight_number: str):
    if flight_number not in flights_db:
        raise HTTPException(status_code=404, detail="Flight not found")
    
    if flights_db[flight_number]["available_seats"] <= 0:
        raise HTTPException(status_code=400, detail="No seats available")
        
    flights_db[flight_number]["available_seats"] -= 1
    return {"status": "success", "available_seats": flights_db[flight_number]["available_seats"]}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
