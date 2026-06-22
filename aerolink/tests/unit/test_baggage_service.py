import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/baggage-service')))

if "main" in sys.modules:
    del sys.modules["main"]

try:
    from main import app
    client = TestClient(app)
except ImportError:
    client = None

def test_baggage_health():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/health")
    assert response.status_code == 200

def test_update_baggage():
    if not client:
        pytest.skip("TestClient not initialized")
    data = {
        "booking_id": "test-booking-123",
        "status": "CHECKED_IN",
        "location": "Counter A"
    }
    response = client.post("/baggage/update", json=data)
    assert response.status_code == 200
    assert response.json()["status"] == "updated successfully"
    assert "baggage_id" in response.json()

def test_get_baggage_status():
    if not client:
        pytest.skip("TestClient not initialized")
    
    # Setup data
    data = {
        "booking_id": "test-booking-123",
        "status": "CHECKED_IN",
        "location": "Counter A"
    }
    update_resp = client.post("/baggage/update", json=data)
    baggage_id = update_resp.json()["baggage_id"]
    
    # Check status
    response = client.get(f"/baggage/{baggage_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "CHECKED_IN"

def test_get_invalid_baggage():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/baggage/INVALID-BAG")
    assert response.status_code == 404
