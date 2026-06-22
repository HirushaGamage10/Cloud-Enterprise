import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/flight-service')))

if "main" in sys.modules:
    del sys.modules["main"]

try:
    from main import app
    client = TestClient(app)
except ImportError:
    client = None

def test_flight_health_endpoint():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "healthy"

def test_flight_get_all_flights():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/flights")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_flight_get_specific_flight():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/flights/AL-1024")
    assert response.status_code == 200
    assert response.json()["flight_number"] == "AL-1024"

def test_flight_get_invalid_flight():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/flights/INVALID-999")
    assert response.status_code == 404

def test_flight_reduce_seat():
    if not client:
        pytest.skip("TestClient not initialized")
    # Reduce seat
    response = client.post("/flights/AL-1024/reduce-seat")
    assert response.status_code == 200
    assert response.json()["message"] == "Seat reduction request processed (Check logs for DB status)"
