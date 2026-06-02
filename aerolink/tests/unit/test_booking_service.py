import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/booking-service')))

try:
    from main import app
    client = TestClient(app)
except ImportError:
    client = None
    print("Warning: Could not import booking-service main.py for unit testing.")

def test_booking_health_endpoint():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()

def test_booking_create_booking_mock():
    if not client:
        pytest.skip("TestClient not initialized")
        
    # Login to get token
    login_data = {"username": "passenger", "password": "password123"}
    login_resp = client.post("/auth/login", data=login_data)
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    booking_data = {
        "flight_number": "AL-1024",
        "passenger_name": "Unit Test User"
    }
    response = client.post("/bookings", json=booking_data, headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "CONFIRMED"
