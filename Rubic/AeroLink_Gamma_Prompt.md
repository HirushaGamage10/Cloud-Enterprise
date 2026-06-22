Create a professional, modern 16-slide presentation for a university Cloud Computing module.

Title: AeroLink Airline Systems Platform — Cloud-Native Distributed Web Application
Student: CB012290 | Module: Cloud Computing | Semester 2 | June 2026

Use a dark theme with blue/teal accents. Airline/aviation aesthetic. Clean, minimal text per slide with visuals and icons.

SLIDE 1 — TITLE SLIDE
Title: "AeroLink Airline Systems Platform"
Subtitle: "Cloud-Native Distributed Web Application"
Footer: CB012290 | Cloud Computing | June 2026

SLIDE 2 — AGENDA
Numbered list:
1. Introduction & Problem Statement
2. Cloud Architecture Overview
3. Infrastructure as Code (Terraform)
4. Microservices Design
5. Containerisation & CI/CD Pipeline
6. Database Strategy
7. Real-Time Data Synchronisation
8. Security & Compliance
9. Fault Tolerance & Resilience
10. Performance & Scalability Testing
11. Monitoring & Observability
12. Testing Strategy
13. Live Demo — AWS Implementation
14. Thank You & Q&A

SLIDE 3 — INTRODUCTION & PROBLEM STATEMENT
Heading: "The Challenge"
Two columns:
Left — Legacy Problems: Monolithic architecture, downtime during peak periods, no independent scaling, data inconsistency across regions, tightly coupled components
Right — Solution: Cloud-native microservices on AWS, event-driven architecture, Infrastructure as Code, multi-region databases, GitOps CI/CD

SLIDE 4 — CLOUD ARCHITECTURE OVERVIEW
Heading: "AeroLink Cloud Architecture"
Create a large, prominent image placeholder in the center of the slide (I will manually upload my own architecture diagram image here).
Key components listed: React Frontend (S3), API Gateway, EKS Cluster (3 Microservices), Apache Kafka, Aurora PostgreSQL, DynamoDB Global Tables, Lambda (Email Notifications), CloudWatch, GitHub Actions + ArgoCD

SLIDE 5 — INFRASTRUCTURE AS CODE (TERRAFORM)
Heading: "Infrastructure as Code with Terraform"
Show 9 Terraform modules: networking, compute, database, api, frontend, ecr, oidc, serverless, monitoring.
Key point: "One command (terraform apply) provisions the entire AWS infrastructure — VPC, EKS, databases, API Gateway, and monitoring"
Mention: 100% reproducible, version-controlled, environment-consistent

SLIDE 6 — MICROSERVICES DESIGN
Heading: "Three Core Microservices"
Three columns with icons:
1. Flight Service — DynamoDB, Kafka Consumer, seat management, pricing
2. Booking Service — Aurora PostgreSQL, Kafka Producer, JWT auth, CRUD operations
3. Baggage Service — DynamoDB, real-time tracking, status updates
Each has: FastAPI, Docker container, /health endpoint, Kubernetes deployment

SLIDE 7 — CONTAINERISATION & CI/CD PIPELINE
Heading: "Automated Build & Deploy Pipeline"
Flow diagram: Developer pushes to GitHub → GitHub Actions triggers → Docker Build → Push to ECR → Update K8s manifests → ArgoCD detects changes → Deploy to EKS
Mention: python:3.10-slim base image, multi-stage builds, 3 private ECR repositories

SLIDE 8 — DATABASE STRATEGY
Heading: "Polyglot Persistence"
Two columns:
Left — Aurora PostgreSQL: ACID transactions, booking data, relational queries, RDS managed
Right — DynamoDB Global Tables: Sub-millisecond reads, flight schedules, multi-region replication (eu-west-1 → eu-central-1), automatic conflict resolution
Bottom: "Each microservice owns its own database — no shared data layer"

SLIDE 9 — REAL-TIME DATA SYNCHRONISATION
Heading: "Event-Driven Architecture with Kafka"
Flow: Booking Created → Kafka 'booking-events' topic → Flight Service consumes → DynamoDB conditional update (atomic seat decrement)
Key points: Eventual consistency, Saga pattern, fallback mode when Kafka unavailable, loosely coupled services
Mention DynamoDB Global Tables for multi-region sync

SLIDE 10 — SECURITY & COMPLIANCE
Heading: "Security by Design"
Four boxes:
1. OAuth 2.0 + JWT: Token-based auth, 30-min expiry
2. RBAC: Admin vs Passenger roles, endpoint-level access control
3. GDPR Compliance: EU data locality (Ireland), access logging, data deletion endpoints
4. PCI-DSS: Payment processing delegated to Stripe, HTTPS everywhere
Bottom: "All infrastructure tagged with Compliance = GDPR-EU via Terraform"

SLIDE 11 — FAULT TOLERANCE & RESILIENCE
Heading: "Designed for Failure"
Key mechanisms:
- Circuit Breakers: Kafka/DynamoDB fallback modes
- Auto-Scaling: HPA (2-5 pods), Node scaling (2-5 nodes)
- Multi-AZ Deployment: 3 Availability Zones (eu-west-1a, 1b, 1c)
- Health Checks: Readiness + Liveness probes on every service
- Disaster Recovery: DynamoDB cross-region replication
Table: Pod crash (<30s), Node failure (<2min), AZ failure (<1min), Region failure (<5min)

SLIDE 12 — PERFORMANCE & SCALABILITY TESTING
Heading: "JMeter Load & Stress Testing"
Two columns:
Left — Load Test (100 users): Avg 210ms, Median 164ms, 34.9 req/s, 11.11% error rate (expected — auth errors)
Right — Stress Test (500 users): Avg 4812ms, 96.4 req/s, 17.11% error rate, HPA auto-scaling triggered
Bottom: Recommendations — connection pooling, Redis caching, CloudFront CDN, larger EC2 instances

SLIDE 13 — MONITORING & OBSERVABILITY
Heading: "Full-Stack Observability"
Layered approach:
1. CloudWatch Container Insights: Pod/node-level metrics via DaemonSet
2. Custom Dashboard: EKS Failed Nodes, RDS CPU, Lambda Errors
3. Centralised Logging: Python logging + API Gateway access logs
4. Distributed Tracing: OpenTelemetry annotations (ready for production)
5. Health Endpoints: /health on every service
6. Route 53 Health Checks: DNS-level failover

SLIDE 14 — TESTING STRATEGY
Heading: "Comprehensive Testing Pyramid"
Three levels:
1. Unit Tests: 15 tests (6 Booking + 5 Flight + 4 Baggage) — pytest + FastAPI TestClient — 100% pass rate
2. Integration Tests: End-to-end flow across EKS-deployed services, API Gateway validation, RBAC enforcement
3. API Tests: Postman collection with automated assertions, Swagger UI for interactive testing
Highlight: "All 15 unit tests passed consistently on every execution"

SLIDE 15 — LIVE DEMO: AWS IMPLEMENTATION EVIDENCE
Heading: "Live Demo — AWS Implementation"
Subheading: "Proof of Deployment from the AWS Console"
This slide should be a screenshot gallery / grid layout showing the real AWS console:
1. Amazon EKS Cluster — showing the running aerolink-cluster with active nodes
2. Amazon ECR Repositories — 3 private repos (flight-service, booking-service, baggage-service) with pushed Docker images
3. Amazon DynamoDB — aerolink-flights table with Global Tables replication to eu-central-1
4. AWS CloudWatch Dashboard — AeroLink-Operational-Dashboard showing EKS metrics, RDS CPU, Lambda invocations
5. AWS API Gateway — HTTP API routes for /flights, /bookings, /baggage
6. ArgoCD Dashboard — showing synced Kubernetes deployments
7. GitHub Actions — successful CI/CD pipeline run (green checkmarks)
8. S3 Static Website — React frontend hosted bucket
9. AWS Load Balancer — active ELB routing traffic to EKS pods
Note to presenter: "Switch to live AWS Console to walk through each service"

SLIDE 16 — THANK YOU & Q&A
Heading: "Thank You"
Subtitle: "Questions & Answers"
GitHub: https://github.com/HirushaGamage10/Cloud-Enterprise
Student ID: CB012290
