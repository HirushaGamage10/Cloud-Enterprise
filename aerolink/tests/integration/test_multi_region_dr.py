import time
import requests
from colorama import Fore, Style, init

init(autoreset=True)

# Simulated Regions (For assignment demonstration)
PRIMARY_REGION_URL = "http://a11a9d18900774a5fb2a27608414d622-2022026360.eu-west-1.elb.amazonaws.com/health"
SECONDARY_REGION_URL = "http://a11a9d18900774a5fb2a27608414d622-2022026360.eu-west-1.elb.amazonaws.com/health" # Using same for mock

print(Fore.CYAN + "=== AeroLink Multi-Region Disaster Recovery (DR) Test ===")
print(Fore.YELLOW + "Simulating AWS Route 53 Active-Passive Failover Routing...\n")

def check_region_health(region_name, url):
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            print(Fore.GREEN + f"[{region_name}] Health Check PASSED: Service is Healthy.")
            return True
        else:
            print(Fore.RED + f"[{region_name}] Health Check FAILED: Status {response.status_code}.")
            return False
    except requests.exceptions.RequestException:
        print(Fore.RED + f"[{region_name}] Health Check FAILED: Connection Timeout/Refused.")
        return False

# Phase 1: Normal Operation
print(Fore.WHITE + "Phase 1: Normal Operations (Traffic routed to Primary Region - eu-west-1)")
primary_health = check_region_health("Primary Region (eu-west-1)", PRIMARY_REGION_URL)
if primary_health:
    print(Fore.GREEN + "Traffic successfully handled by Primary Region.\n")

time.sleep(2)

# Phase 2: Simulating Disaster
print(Fore.WHITE + "Phase 2: Simulating Regional Outage in Primary Region...")
print(Fore.RED + "WARNING: Primary Region EKS Cluster Offline (Simulated)!")

# Mocking failure by using a dead URL
dead_url = "http://offline-primary-cluster.eu-west-1.elb.amazonaws.com/health"
primary_health = check_region_health("Primary Region (eu-west-1)", dead_url)

time.sleep(2)

# Phase 3: Route 53 Failover
if not primary_health:
    print(Fore.YELLOW + "\nAWS Route 53 detected Primary failure. Initiating DNS Failover...")
    time.sleep(2)
    print(Fore.WHITE + "Phase 3: Traffic rerouted to Secondary Region (us-east-1)")
    
    secondary_health = check_region_health("Secondary Region (us-east-1)", SECONDARY_REGION_URL)
    
    if secondary_health:
        print(Fore.GREEN + "\nSUCCESS: Disaster Recovery complete! Traffic successfully failing over to Secondary Region.")
        print(Fore.CYAN + "Zero-Downtime Architecture validated.")
