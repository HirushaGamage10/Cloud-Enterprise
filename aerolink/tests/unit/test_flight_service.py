import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path so we can import the FastAPI apps
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/flight-service')))

try:
    from main import app
    client = TestClient(app)
except ImportError:
    client = None
    print("Warning: Could not import flight-service main.py for unit testing. Make sure dependencies are installed.")

def test_flight_health_endpoint():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()

def test_flight_get_flights_mock():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/flights")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
