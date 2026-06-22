---
title: AeroLink Airline Systems Platform
subtitle: Cloud-Native Distributed Web Application
author: CB012290
date: June 2026
theme: dark
---

<!-- SLIDE 1 -->
# ✈️ AeroLink Airline Systems Platform

### Cloud-Native Distributed Web Application

---

**CB012290** | Cloud Computing | Semester 2 | June 2026

---

<!-- SLIDE 2 -->
## 📋 Agenda

1. Introduction & Problem Statement
2. Cloud Architecture Overview
3. Technology Stack
4. Infrastructure as Code (Terraform)
5. Microservices Design
6. Containerisation & CI/CD Pipeline
7. Database Strategy
8. Real-Time Data Synchronisation
9. Security & Compliance
10. Fault Tolerance & Resilience
11. Performance & Scalability Testing
12. Monitoring & Observability
13. Testing Strategy
14. Live Demo — AWS Implementation
15. Thank You & Q&A

---

<!-- SLIDE 3 -->
## 🔴 The Challenge

### Legacy Problems

| Problem | Impact |
|---------|--------|
| Monolithic Architecture | Cannot scale individual components |
| Peak-Time Downtime | System crashes during holiday booking rushes |
| No Independent Scaling | Entire system must scale together |
| Data Inconsistency | Regions show different flight data |
| Tightly Coupled | One failure crashes everything |

### ✅ Our Solution

> Migrate to a **Cloud-Native Microservices Platform** on AWS with event-driven architecture, Infrastructure as Code, multi-region databases, and GitOps CI/CD.

---

<!-- SLIDE 4 -->
## 🏗️ AeroLink Cloud Architecture

```
                         ┌─────────────────────┐
                         │    React Frontend    │
                         │   (Amazon S3 + CDN)  │
                         └─────────┬────────────┘
                                   │
                         ┌─────────▼────────────┐
                         │   AWS API Gateway     │
                         │    (HTTP API)         │
                         └─────────┬────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
    ┌─────────▼──────┐  ┌─────────▼──────┐  ┌──────────▼─────┐
    │ Flight Service │  │Booking Service │  │Baggage Service │
    │   (FastAPI)    │  │  (FastAPI)     │  │  (FastAPI)     │
    └────────┬───────┘  └────────┬───────┘  └────────┬───────┘
             │                   │                    │
    ┌────────▼───────┐  ┌────────▼───────┐  ┌────────▼───────┐
    │   DynamoDB     │  │Aurora PostgreSQL│  │   DynamoDB     │
    │ Global Tables  │  │   (RDS)        │  │                │
    └────────────────┘  └────────────────┘  └────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Apache Kafka        │
                    │ (Strimzi on K8s)      │
                    └───────────────────────┘
```

**Key Components:** EKS Cluster • Kafka Event Streaming • Lambda (Email) • CloudWatch • GitHub Actions + ArgoCD

---

<!-- SLIDE 5 -->
## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 🐳 Container Runtime | **Docker** | Microservice containerisation |
| ☸️ Orchestration | **Amazon EKS** (Kubernetes 1.30) | Container orchestration & scaling |
| 🔄 CI/CD | **GitHub Actions + ArgoCD** | Automated build & GitOps deployment |
| 🐍 API Framework | **FastAPI** (Python) | RESTful APIs with auto-generated docs |
| 🗄️ Relational DB | **Aurora PostgreSQL** | Booking transactions (ACID) |
| ⚡ NoSQL DB | **DynamoDB Global Tables** | Flight schedules (multi-region) |
| 📨 Event Streaming | **Apache Kafka** (Strimzi) | Async event-driven communication |
| λ Serverless | **AWS Lambda** | Email notification processing |
| 🌐 API Gateway | **AWS API Gateway** (HTTP) | Centralised routing & CORS |
| 🖥️ Frontend | **React + S3** | Passenger-facing UI |
| 📐 IaC | **Terraform** | Reproducible infrastructure |
| 📊 Monitoring | **CloudWatch + Container Insights** | Metrics, logging & dashboards |

---

<!-- SLIDE 6 -->
## 📐 Infrastructure as Code with Terraform

### 9 Terraform Modules

```
terraform/modules/
├── networking/     → VPC, 9 Subnets (3 AZs), Internet Gateway
├── compute/        → EKS Cluster, Managed Node Groups, IAM
├── database/       → DynamoDB Global Tables, Aurora PostgreSQL
├── api/            → API Gateway (HTTP), Routes, Logging
├── frontend/       → S3 Static Website Hosting
├── ecr/            → 3 Private Container Registries
├── oidc/           → GitHub OIDC Provider for CI/CD
├── serverless/     → Lambda Email Notification Function
└── monitoring/     → CloudWatch Dashboard (3 widgets)
```

> ### 💡 Key Benefit
> **One command** (`terraform apply`) provisions the **entire AWS infrastructure** — VPC, EKS, databases, API Gateway, and monitoring.
>
> ✅ 100% Reproducible • ✅ Version-Controlled • ✅ Environment-Consistent

---

<!-- SLIDE 7 -->
## 🔧 Three Core Microservices

### ✈️ Flight Service
- **Database:** DynamoDB Global Tables
- **Role:** Kafka Consumer — listens for booking events
- **Features:** Seat management, dynamic pricing, availability queries
- **Endpoint:** `/flights`, `/health`

### 📋 Booking Service
- **Database:** Aurora PostgreSQL (ACID)
- **Role:** Kafka Producer — publishes BookingCreated events
- **Features:** JWT authentication, CRUD operations, admin RBAC
- **Endpoint:** `/bookings`, `/auth/login`, `/health`

### 🧳 Baggage Service
- **Database:** DynamoDB
- **Role:** Real-time luggage tracking
- **Features:** Status updates (Checked-In → Security → Loaded), passenger tracking
- **Endpoint:** `/baggage`, `/health`

> **Common Stack:** FastAPI • Docker Container • `/health` Endpoint • Kubernetes Deployment (2 replicas)

---

<!-- SLIDE 8 -->
## 🔄 Automated Build & Deploy Pipeline

### GitOps CI/CD Flow

```
Developer Push (main)
        │
        ▼
┌──────────────────┐
│  GitHub Actions   │
│  ┌──────────────┐│
│  │ Docker Build  ││  ← Builds 3 microservice images
│  │ Push to ECR   ││  ← 3 private ECR repositories
│  │ Update K8s    ││  ← Updates image tags in YAML manifests
│  │ Git Commit    ││  ← Commits new tags back to repo
│  └──────────────┘│
└──────────┬───────┘
           │
           ▼
┌──────────────────┐
│     ArgoCD        │  ← Detects Git changes automatically
│  Sync to EKS      │  ← Deploys new containers to cluster
└──────────────────┘
```

- **Base Image:** `python:3.10-slim` (minimal footprint)
- **3 ECR Repos:** `aerolink-flight-service`, `aerolink-booking-service`, `aerolink-baggage-service`
- **Git = Single Source of Truth** for infrastructure and application state

---

<!-- SLIDE 9 -->
## 💾 Polyglot Persistence — Database Strategy

### Aurora PostgreSQL (Booking Service)

| Feature | Detail |
|---------|--------|
| **Type** | Relational (SQL) |
| **Use Case** | Booking transactions |
| **Consistency** | ACID-compliant |
| **Management** | AWS RDS managed — auto backups, patching |

### DynamoDB Global Tables (Flight & Baggage)

| Feature | Detail |
|---------|--------|
| **Type** | NoSQL (Key-Value) |
| **Use Case** | Flight schedules, baggage tracking |
| **Latency** | Sub-millisecond reads |
| **Replication** | eu-west-1 (Ireland) → eu-central-1 (Frankfurt) |
| **Conflict Resolution** | "Last writer wins" |

> ### 🔑 Design Pattern
> **Database-per-Service** — Each microservice owns its own database. No shared data layer.

---

<!-- SLIDE 10 -->
## ⚡ Real-Time Data Synchronisation

### Event-Driven Architecture with Kafka

```
 1. Passenger books flight
        │
        ▼
 ┌──────────────────┐
 │  Booking Service  │ ──── saves booking to Aurora PostgreSQL
 │                   │
 │  Publishes Event  │ ──→ Kafka Topic: "booking-events"
 └──────────────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │  Flight Service   │ ──── consumes event
                    │                   │
                    │  DynamoDB Update   │ ──── available_seats - 1
                    │  (Conditional)     │      (only if seats > 0)
                    └──────────────────┘
```

### Key Design Decisions

| Pattern | Implementation |
|---------|---------------|
| **Saga Pattern** | Eventual consistency across services |
| **Atomic Updates** | DynamoDB `ConditionExpression` prevents overbooking |
| **Fallback Mode** | If Kafka unavailable → simulated events, system continues |
| **Multi-Region Sync** | DynamoDB Global Tables → auto-replication to Frankfurt |

---

<!-- SLIDE 11 -->
## 🔒 Security by Design

### 1️⃣ OAuth 2.0 + JWT
- Token-based authentication on every API request
- **30-minute expiry** — limits damage if token stolen
- Issued via `/auth/login` endpoint

### 2️⃣ Role-Based Access Control (RBAC)
- **Passenger** → book flights, track baggage
- **Admin** → view all bookings, manage flights
- Unauthorized admin access → **403 Forbidden**

### 3️⃣ GDPR Compliance
- All data stored in **EU** (Ireland + Frankfurt)
- API access logging enabled
- Data deletion endpoints implemented (`DELETE /bookings/{id}`)

### 4️⃣ PCI-DSS
- **Zero credit card data stored** — delegated to Stripe
- HTTPS enforced on all public endpoints

> **Terraform:** Every AWS resource tagged `Compliance = GDPR-EU`

---

<!-- SLIDE 12 -->
## 🛡️ Designed for Failure — Fault Tolerance & Resilience

### Protection Mechanisms

| Mechanism | Implementation |
|-----------|---------------|
| **Circuit Breakers** | Kafka fails → fallback mode. DynamoDB fails → in-memory mock |
| **Auto-Scaling (HPA)** | Min 2 → Max 5 pods. CPU threshold: 70% |
| **Multi-AZ** | Pods across 3 Availability Zones (eu-west-1a, 1b, 1c) |
| **Health Checks** | Readiness probe (removes from LB) + Liveness probe (auto-restart) |
| **Disaster Recovery** | DynamoDB cross-region replication to Frankfurt |

### Recovery Time Objectives (RTO)

| Scenario | Recovery Mechanism | RTO |
|----------|-------------------|-----|
| Single pod crash | Kubernetes auto-restart | **< 30 seconds** |
| Node failure | EKS reschedules pods | **< 2 minutes** |
| AZ failure | Traffic rerouted to remaining AZs | **< 1 minute** |
| Region failure | DynamoDB Global Tables from eu-central-1 | **< 5 minutes** |

---

<!-- SLIDE 13 -->
## 📈 JMeter Load & Stress Testing

### Load Test (100 Concurrent Users)

| Metric | Result |
|--------|--------|
| Average Response | **210 ms** |
| Median Response | **164 ms** |
| 90th Percentile | **322 ms** |
| Throughput | **34.9 req/s** |
| Error Rate | **11.11%** (expected — admin auth errors) |

### Stress Test (500 Concurrent Users)

| Metric | Result |
|--------|--------|
| Average Response | **4,812 ms** |
| Median Response | **1,492 ms** |
| 90th Percentile | **12,960 ms** |
| Throughput | **96.4 req/s** |
| Error Rate | **17.11%** |

> HPA auto-scaling **successfully triggered** under extreme load.

### 🔧 Recommendations
pgBouncer (connection pooling) • Redis/ElastiCache • CloudFront CDN • Upgrade to `m5.large` instances

---

<!-- SLIDE 14 -->
## 📊 Full-Stack Monitoring & Observability

| Layer | Tool | What It Monitors |
|-------|------|-----------------|
| **Container Metrics** | CloudWatch Container Insights | Pod CPU, memory, network — via DaemonSet on every node |
| **Custom Dashboard** | CloudWatch Dashboard | EKS Failed Nodes, RDS CPU, Lambda Errors |
| **Application Logs** | Python `logging` module | Structured INFO/WARNING/ERROR per microservice |
| **API Access Logs** | API Gateway → CloudWatch | Request ID, source IP, HTTP method, status code |
| **Distributed Tracing** | OpenTelemetry annotations | Request lifecycle across microservices (production-ready) |
| **Service Health** | `/health` endpoints | Database + Kafka connectivity status |
| **DNS Failover** | Route 53 Health Checks | Global endpoint monitoring, automatic failover |

> **Single-Pane-of-Glass:** The CloudWatch Dashboard gives instant visual feedback on the health of the entire platform.

---

<!-- SLIDE 15 -->
## ✅ Comprehensive Testing Strategy

### Testing Pyramid

```
         ┌─────────────┐
         │  API Tests   │  ← Postman Collection + Swagger UI
         │  (Manual +   │
         │  Automated)  │
         ├─────────────┤
         │ Integration  │  ← End-to-End on live EKS cluster
         │   Tests      │     API Gateway routing, RBAC validation
         ├─────────────┤
         │  Unit Tests  │  ← pytest + FastAPI TestClient
         │  (15 tests)  │     100% PASS RATE
         └─────────────┘
```

### Unit Test Breakdown

| Service | Tests | Coverage |
|---------|-------|----------|
| Booking Service | 6 | Health, Login, Profile, Booking CRUD, Admin, Unauthorized |
| Flight Service | 5 | Health, List Flights, Single Flight, Seat Reduction, 404 |
| Baggage Service | 4 | Health, Update Status, Track Baggage, 404 |
| **Total** | **15** | **100% Pass Rate** ✅ |

### API Testing
- **Postman Collection:** `AeroLink_Postman_Collection.json` — automated assertions on every endpoint
- **Swagger UI:** Interactive `/docs` endpoint on each service for ad-hoc testing

---

<!-- SLIDE 16 -->
## 🖥️ Live Demo — AWS Implementation

### Proof of Deployment from the AWS Console

| # | AWS Service | What to Show |
|---|-------------|-------------|
| 1 | **Amazon EKS** | Running `aerolink-cluster` with active nodes |
| 2 | **Amazon ECR** | 3 private repos with pushed Docker image tags |
| 3 | **Amazon DynamoDB** | `aerolink-flights` table + Global Tables replica (eu-central-1) |
| 4 | **CloudWatch Dashboard** | `AeroLink-Operational-Dashboard` — EKS metrics, RDS CPU, Lambda |
| 5 | **API Gateway** | HTTP API routes: `/flights`, `/bookings`, `/baggage` |
| 6 | **ArgoCD** | Synced Kubernetes deployments (green health status) |
| 7 | **GitHub Actions** | Successful CI/CD pipeline run (✅ green checkmarks) |
| 8 | **S3 Bucket** | React frontend static website hosting |
| 9 | **Load Balancer** | Active ELB routing traffic to EKS pods |

> 💡 **Presenter Note:** Switch to live AWS Console to walk through each service.

---

<!-- SLIDE 17 -->
# 🙏 Thank You

## Questions & Answers

---

**GitHub Repository:**
🔗 [https://github.com/HirushaGamage10/Cloud-Enterprise](https://github.com/HirushaGamage10/Cloud-Enterprise)

**Student ID:** CB012290
**Module:** Cloud Computing | **Semester:** 2 | **Date:** June 2026
