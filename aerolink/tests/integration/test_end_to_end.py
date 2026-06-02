import pytest
import requests
import time

FLIGHT_URL = "http://a86adcf61899940c9903f3cb61add506-1427639798.eu-west-1.elb.amazonaws.com"
BOOKING_URL = "http://a11a9d18900774a5fb2a27608414d622-2022026360.eu-west-1.elb.amazonaws.com"
BAGGAGE_URL = "http://a90537543ecc94a2f9ad3e9cb4537114-1868609064.eu-west-1.elb.amazonaws.com"

def test_flight_service_health():
    response = requests.get(f"{FLIGHT_URL}/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_all_flights():
    response = requests.get(f"{FLIGHT_URL}/flights")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_booking_service_health():
    response = requests.get(f"{BOOKING_URL}/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    
def test_baggage_service_health():
    response = requests.get(f"{BAGGAGE_URL}/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_end_to_end_project_flow():
    # 1. Login to get token
    login_data = {"username": "passenger", "password": "password123"}
    login_resp = requests.post(f"{BOOKING_URL}/auth/login", data=login_data)
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get current available seats for AL-1024
    flight_resp = requests.get(f"{FLIGHT_URL}/flights/AL-1024")
    assert flight_resp.status_code == 200
    initial_seats = flight_resp.json()["available_seats"]

    # 3. Create a booking
    booking_data = {
        "flight_number": "AL-1024",
        "passenger_name": "Test User E2E"
    }
    book_resp = requests.post(f"{BOOKING_URL}/bookings", json=booking_data, headers=headers)
    assert book_resp.status_code == 200
    booking_id = book_resp.json()["booking_id"]
    
    # 4. Update Baggage using the generated booking_id
    baggage_data = {
        "booking_id": booking_id,
        "status": "CHECKED_IN",
        "location": "Airport Counter 4"
    }
    baggage_update_resp = requests.post(f"{BAGGAGE_URL}/baggage/update", json=baggage_data)
    assert baggage_update_resp.status_code == 200
    baggage_id = baggage_update_resp.json()["baggage_id"]
    
    # 5. Check Baggage Status
    baggage_status_resp = requests.get(f"{BAGGAGE_URL}/baggage/{baggage_id}")
    assert baggage_status_resp.status_code == 200
    assert baggage_status_resp.json()["status"] == "CHECKED_IN"
    
    # 6. Wait a few seconds for Kafka to process the event
    time.sleep(3)

    # 7. Check if the seats were reduced
    flight_resp_after = requests.get(f"{FLIGHT_URL}/flights/AL-1024")
    assert flight_resp_after.status_code == 200
    final_seats = flight_resp_after.json()["available_seats"]

    # If Kafka and DynamoDB are working, the seat count should have reduced
    assert final_seats < initial_seats
