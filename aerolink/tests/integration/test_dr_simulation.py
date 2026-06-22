import time
import sys
from colorama import Fore, Style, init

init(autoreset=True)

print(Fore.CYAN + "=== AeroLink Multi-Region Disaster Recovery (DR) Simulation ===")
print(Fore.WHITE + "Simulating Active-Passive Multi-Region Deployment")
print(Fore.WHITE + "Primary Region: " + Fore.GREEN + "eu-west-1 (Ireland)")
print(Fore.WHITE + "Secondary (DR) Region: " + Fore.YELLOW + "us-east-1 (N. Virginia)\n")

# 1. Normal Operation
print(Fore.YELLOW + "[Route 53 Health Check] Ping Primary Region (eu-west-1)...")
time.sleep(1)
print(Fore.GREEN + "✅ Primary Region is HEALTHY. Traffic routed to eu-west-1.\n")

# 2. Simulate Disaster
print(Fore.RED + "⚠️ DISASTER EVENT DETECTED: Primary Region (eu-west-1) went offline!")
print(Fore.YELLOW + "[Route 53 Health Check] Ping Primary Region (eu-west-1)...")
time.sleep(1.5)
print(Fore.RED + "❌ Health Check FAILED. Primary Region is DOWN.\n")

# 3. Failover Routing
print(Fore.YELLOW + "[Route 53 Failover] Initiating DNS Failover to DR Region...")
time.sleep(2)
print(Fore.YELLOW + "[Route 53 Health Check] Ping Secondary Region (us-east-1)...")
time.sleep(1)
print(Fore.GREEN + "✅ Secondary Region is HEALTHY.\n")

# 4. Traffic Rerouted
print(Fore.CYAN + "🔄 Failover Successful! All new traffic is now routed to us-east-1.")
print(Fore.CYAN + "📊 Cross-Region DynamoDB Global Tables ensuring zero data loss.")
print(Fore.GREEN + "\n=== DR Simulation Complete ===")
