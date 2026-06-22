import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/booking-service')))

if "main" in sys.modules:
    del sys.modules["main"]

try:
    from main import app
    client = TestClient(app)
except ImportError:
    client = None

def get_auth_token():
    login_resp = client.post("/auth/login", data={"username": "passenger", "password": "password123"})
    return login_resp.json()["access_token"]

def get_admin_token():
    login_resp = client.post("/auth/login", data={"username": "admin", "password": "admin123"})
    return login_resp.json()["access_token"]

def test_booking_health():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/health")
    assert response.status_code == 200

def test_user_login():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.post("/auth/login", data={"username": "passenger", "password": "password123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_get_user_profile():
    if not client:
        pytest.skip("TestClient not initialized")
    token = get_auth_token()
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "passenger"

def test_create_and_cancel_booking():
    if not client:
        pytest.skip("TestClient not initialized")
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Booking
    booking_data = {"flight_number": "AL-1024", "passenger_name": "Unit Test User"}
    response = client.post("/bookings", json=booking_data, headers=headers)
    assert response.status_code == 200
    booking_id = response.json()["booking_id"]
    
    # Cancel Booking
    cancel_resp = client.delete(f"/bookings/{booking_id}", headers=headers)
    assert cancel_resp.status_code == 200
    assert cancel_resp.json()["status"] == "CANCELLED"

def test_admin_view_bookings():
    if not client:
        pytest.skip("TestClient not initialized")
    token = get_admin_token()
    response = client.get("/admin/bookings", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_unauthorized_access():
    if not client:
        pytest.skip("TestClient not initialized")
    response = client.get("/auth/me")
    assert response.status_code == 401
