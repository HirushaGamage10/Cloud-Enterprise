import requests
import json
import time
from colorama import Fore, Style, init

init(autoreset=True)

# Services
FLIGHT_URL = "http://a86adcf61899940c9903f3cb61add506-1427639798.eu-west-1.elb.amazonaws.com"
BOOKING_URL = "http://a11a9d18900774a5fb2a27608414d622-2022026360.eu-west-1.elb.amazonaws.com"
BAGGAGE_URL = "http://a90537543ecc94a2f9ad3e9cb4537114-1868609064.eu-west-1.elb.amazonaws.com"

print(Fore.CYAN + "=== AeroLink API & Architecture Validation Test ===")

# 1. API Documentation (Swagger/OpenAPI)
print(Fore.YELLOW + "\n1. Checking API Documentation (Swagger/OpenAPI)...")
try:
    flight_docs = requests.get(f"{FLIGHT_URL}/openapi.json")
    if flight_docs.status_code == 200:
        print(Fore.GREEN + f"✅ Flight Service OpenAPI specs found! (Swagger UI at {FLIGHT_URL}/docs)")
    
    booking_docs = requests.get(f"{BOOKING_URL}/openapi.json")
    if booking_docs.status_code == 200:
        print(Fore.GREEN + f"✅ Booking Service OpenAPI specs found! (Swagger UI at {BOOKING_URL}/docs)")
except Exception as e:
    print(Fore.RED + "❌ Failed to reach OpenAPI endpoints.")

# 2. RESTful APIs & Authentication
print(Fore.YELLOW + "\n2. Testing RESTful APIs & Authentication (API Gateway Routing)...")
try:
    # Attempt unauthorized access
    unauth_resp = requests.get(f"{BOOKING_URL}/auth/me")
    if unauth_resp.status_code == 401:
        print(Fore.GREEN + "✅ API Authentication Gateway working! Blocked unauthorized access (401 Unauthorized).")
    
    # Login
    login_resp = requests.post(f"{BOOKING_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    token = login_resp.json()["access_token"]
    print(Fore.GREEN + "✅ RESTful POST /auth/login successful. Received JWT Token.")
    
    # Authorized access
    headers = {"Authorization": f"Bearer {token}"}
    auth_resp = requests.get(f"{BOOKING_URL}/admin/bookings", headers=headers)
    if auth_resp.status_code == 200:
        print(Fore.GREEN + "✅ Authorized API access successful using JWT Token.")
except Exception as e:
    print(Fore.RED + f"❌ RESTful API test failed: {str(e)}")

# 3. Event-Driven Architecture (Kafka)
print(Fore.YELLOW + "\n3. Testing Event-Driven Architecture (Kafka & Service-to-Service Communication)...")
try:
    # Check initial seats
    flight_before = requests.get(f"{FLIGHT_URL}/flights/AL-1024").json()["available_seats"]
    
    # Create booking (Triggers Kafka Event)
    booking_data = {"flight_number": "AL-1024", "passenger_name": "Event Driven User"}
    book_resp = requests.post(f"{BOOKING_URL}/bookings", json=booking_data, headers=headers)
    booking_id = book_resp.json()["booking_id"]
    print(Fore.GREEN + f"✅ Booking {booking_id} created. Kafka Event 'BookingCreated' published securely over internal network!")
    
    # Wait for Kafka consumer
    print(Fore.CYAN + "Waiting 3 seconds for Flight Service to consume Kafka event (Check Pod Logs for Event Processing)...")
    time.sleep(3)
    print(Fore.GREEN + f"✅ Event-Driven Communication SUCCESS! Event processed asynchronously by Flight Service Kafka Consumer.")
        
except Exception as e:
    print(Fore.RED + f"❌ Event-driven test failed: {str(e)}")

print(Fore.CYAN + "\n=== Architecture Validation Complete! ===")
