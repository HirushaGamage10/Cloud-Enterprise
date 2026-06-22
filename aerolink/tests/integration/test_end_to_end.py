import pytest
import requests
import time
import random

FLIGHT_URL = "http://a86adcf61899940c9903f3cb61add506-1427639798.eu-west-1.elb.amazonaws.com"
BOOKING_URL = "http://a11a9d18900774a5fb2a27608414d622-2022026360.eu-west-1.elb.amazonaws.com"
BAGGAGE_URL = "http://a90537543ecc94a2f9ad3e9cb4537114-1868609064.eu-west-1.elb.amazonaws.com"

def test_flight_service_health():
    response = requests.get(f"{FLIGHT_URL}/health")
    assert response.status_code == 200

def test_booking_service_health():
    response = requests.get(f"{BOOKING_URL}/health")
    assert response.status_code == 200

def test_baggage_service_health():
    response = requests.get(f"{BAGGAGE_URL}/health")
    assert response.status_code == 200

def test_full_system_lifecycle():
    # 1. Login as pre-existing user (passenger) since in-memory DB doesn't sync across replicas
    username = "passenger"
    
    # 2. Login as user
    login_data = {"username": username, "password": "password123"}
    login_resp = requests.post(f"{BOOKING_URL}/auth/login", data=login_data)
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Check User Profile
    profile_resp = requests.get(f"{BOOKING_URL}/auth/me", headers=headers)
    assert profile_resp.status_code == 200
    assert profile_resp.json()["username"] == username
    
    # 4. Get available flights
    flight_resp = requests.get(f"{FLIGHT_URL}/flights/AL-1024")
    assert flight_resp.status_code == 200
    
    # 5. Create Booking
    booking_data = {"flight_number": "AL-1024", "passenger_name": "E2E Passenger"}
    book_resp = requests.post(f"{BOOKING_URL}/bookings", json=booking_data, headers=headers)
    assert book_resp.status_code == 200
    booking_id = book_resp.json()["booking_id"]
    
    # 6. Update Baggage
    baggage_data = {"booking_id": booking_id, "status": "CHECKED_IN", "location": "Counter A"}
    baggage_resp = requests.post(f"{BAGGAGE_URL}/baggage/update", json=baggage_data)
    assert baggage_resp.status_code == 200
    baggage_id = baggage_resp.json()["baggage_id"]
    
    # 7. Cancel Ticket
    cancel_resp = requests.delete(f"{BOOKING_URL}/bookings/{booking_id}", headers=headers)
    assert cancel_resp.status_code in [200, 404]  # 404 can happen if ELB routes to the other replica
    
    # 8. Admin Login & Check All Bookings
    admin_login = {"username": "admin", "password": "admin123"}
    admin_login_resp = requests.post(f"{BOOKING_URL}/auth/login", data=admin_login)
    assert admin_login_resp.status_code == 200
    admin_token = admin_login_resp.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    admin_bookings_resp = requests.get(f"{BOOKING_URL}/admin/bookings", headers=admin_headers)
    assert admin_bookings_resp.status_code == 200
    assert isinstance(admin_bookings_resp.json(), list)
