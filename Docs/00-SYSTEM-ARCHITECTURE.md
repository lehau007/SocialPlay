# SocialPlay - Complete System Architecture

## Table of Contents
1. [Overview](#overview)
2. [High-Level Architecture](#high-level-architecture)
3. [System Components](#system-components)
4. [Technology Stack](#technology-stack)
5. [Security & Performance](#security--performance)
6. [Deployment Architecture](#deployment-architecture)

---

## Overview

**SocialPlay** is a modern social media platform with AI-powered features, designed for scalability, security, and high performance.

### Key Features
- User authentication & authorization
- Social interactions (posts, comments, likes, shares)
- Real-time messaging and notifications
- AI-powered content recommendations
- AI-based content moderation
- User analytics and insights
- Media upload and processing

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS/CLIENTS                            │
│                    (Web, Mobile, Desktop)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CDN (Static Assets)                         │
│              (Cloudflare Free Tier / BunnyCDN)                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LOAD BALANCER (Layer 7)                      │
│          (Railway/Render Built-in / Nginx / Caddy)               │
│                  • SSL Termination                               │
│                  • Health Checks                                 │
│                  • Session Persistence                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY                                │
│                  (Kong / Express Gateway)                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Rate Limiting (100 req/min per user)                  │  │
│  │  • JWT Validation & Authentication                       │  │
│  │  • Request/Response Transformation                       │  │
│  │  • API Versioning (v1, v2)                              │  │
│  │  • Request Logging & Monitoring                          │  │
│  │  • CORS Management                                       │  │
│  │  • IP Whitelisting/Blacklisting                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────┬──────────────────────────────┬────────────────────────┘
          │                              │
          ▼                              ▼
┌────────────────────────┐    ┌─────────────────────────────┐
│   MAIN SERVICE         │    │    AI SERVICE               │
│   (Port: 3000)         │    │    (Port: 5000)             │
│                        │    │                             │
│  ├─ User Service       │    │  ├─ Content Recommendation  │
│  ├─ Auth Service       │    │  ├─ Content Moderation      │
│  ├─ Post Service       │    │  ├─ Sentiment Analysis      │
│  ├─ Comment Service    │    │  ├─ Image Recognition       │
│  ├─ Like Service       │    │  ├─ Text Generation         │
│  ├─ Follow Service     │    │  ├─ User Behavior Analysis  │
│  ├─ Message Service    │    │  └─ Trend Detection         │
│  ├─ Notification Svc   │    │                             │
│  ├─ Media Service      │    │  Tech: Python/FastAPI       │
│  └─ Analytics Service  │    │  Framework: Pytorch      │
│                        │    │  ML Models: Custom trained  │
│  Tech: Node.js/Express │    └─────────────────────────────┘
│  OR Python/FastAPI     │              │
└────────────────────────┘              │
          │                             │
          ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ PostgreSQL   │  │   Redis      │  │   MongoDB          │    │
│  │ (Main DB)    │  │   (Cache)    │  │   (Logs/Analytics) │    │
│  │              │  │              │  │                    │    │
│  │ • Users      │  │ • Sessions   │  │ • Activity Logs    │    │
│  │ • Posts      │  │ • Rate Limit │  │ • AI Training Data │    │
│  │ • Comments   │  │ • Real-time  │  │ • User Behavior    │    │
│  │ • Relations  │  │   Data       │  │                    │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ S3/MinIO     │  │ Elasticsearch│  │   Message Queue    │    │
│  │ (Storage)    │  │ (Search)     │  │   (RabbitMQ/Kafka) │    │
│  │              │  │              │  │                    │    │
│  │ • Images     │  │ • Posts      │  │ • Email Queue      │    │
│  │ • Videos     │  │ • Users      │  │ • Notification Q   │    │
│  │ • Documents  │  │ • Comments   │  │ • AI Processing Q  │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
          │                             │
          ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                               │
│                                                                   │
│  • Email Service (Resend/Brevo free tier)                       │
│  • SMS Service (Twilio)                                         │
│  • Payment Gateway (Stripe/PayPal)                              │
│  • Analytics (Google Analytics, Mixpanel)                       │
│  • Monitoring (Prometheus, Grafana, ELK Stack)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## System Components

### 1. **Frontend Layer**
- **Web Application**: React.js/Next.js with TypeScript
- **Mobile Application**: React Native or Flutter
- **Responsibilities**:
  - User interface rendering
  - Client-side validation
  - State management (Redux/Zustand)
  - API consumption
  - Real-time updates (WebSocket)

### 2. **CDN (Content Delivery Network)**
- **Purpose**: Serve static assets globally with low latency
- **Content**: JavaScript bundles, CSS, images, fonts
- **Providers**: Cloudflare Free Tier, BunnyCDN ($0.01/GB)

### 3. **Load Balancer**
- **Type**: Layer 7 (Application Layer)
- **Algorithm**: Round Robin with health checks
- **Features**:
  - SSL/TLS termination
  - HTTP/2 support
  - WebSocket support
  - Auto-scaling integration
  - Health monitoring
- **Implementation**: Railway/Render built-in, Nginx, or Caddy

### 4. **API Gateway**
- **Purpose**: Single entry point for all API requests
- **Implementation**: Kong or custom Express middleware
- **Responsibilities**:
  - **Authentication & Authorization**: JWT validation
  - **Rate Limiting**: 100 requests/minute per user (configurable)
  - **Request Routing**: Direct to Main or AI service
  - **API Versioning**: /api/v1, /api/v2
  - **Security**: CORS, API key validation
  - **Logging**: Request/response logging
  - **Transformation**: Request/response modification
  - **Caching**: Response caching for public endpoints

### 5. **Main Service (Backend)**
- **Framework**: Node.js with Express OR Python with FastAPI
- **Port**: 3000 (internal), exposed via API Gateway
- **Architecture**: Microservices-oriented modular monolith
- **Modules**:
  - **Auth Service**: Login, register, JWT management
  - **User Service**: Profile, settings, preferences
  - **Post Service**: CRUD operations for posts
  - **Comment Service**: Comments management
  - **Like Service**: Likes and reactions
  - **Follow Service**: User relationships
  - **Message Service**: Direct messaging
  - **Notification Service**: Real-time notifications
  - **Media Service**: Upload, processing, CDN integration
  - **Analytics Service**: User activity tracking

### 6. **AI Service**
- **Framework**: Python with FastAPI
- **Port**: 5000 (internal), exposed via API Gateway
- **ML Stack**: PyTorch, scikit-learn
- **Features**:
  - **Content Recommendation**: Personalized feed algorithm
  - **Content Moderation**: Detect inappropriate content
  - **Sentiment Analysis**: Analyze post/comment sentiment
  - **Image Recognition**: Tag detection, face recognition
  - **Text Generation**: Auto-complete, suggestions
  - **User Behavior Analysis**: Predict user interests
  - **Trend Detection**: Identify trending topics

### 7. **Data Layer**

#### Primary Database - PostgreSQL
- **Purpose**: Main relational data storage
- **Tables**: Users, Posts, Comments, Likes, Follows, Messages
- **Features**: ACID compliance, complex queries, transactions

#### Cache - Redis
- **Purpose**: High-speed data access
- **Use Cases**:
  - Session storage
  - Rate limiting counters
  - Real-time data (online users)
  - Temporary data caching
  - Pub/Sub for notifications

#### Document Store - MongoDB
- **Purpose**: Flexible schema data
- **Use Cases**:
  - Activity logs
  - AI training data
  - User behavior analytics
  - Unstructured data

#### Object Storage - S3/MinIO
- **Purpose**: Media file storage
- **Content**: Images, videos, documents
- **Features**: CDN integration, versioning, lifecycle policies

#### Search Engine - Elasticsearch
- **Purpose**: Full-text search
- **Indexed Data**: Posts, users, comments, hashtags
- **Features**: Fuzzy search, autocomplete, filters

#### Message Queue - RabbitMQ/Kafka
- **Purpose**: Asynchronous processing
- **Queues**:
  - Email notifications
  - Push notifications
  - AI processing tasks
  - Media processing
  - Analytics events

---

## Technology Stack

### Frontend
```yaml
Framework: React 18+ / Next.js 14+
Language: TypeScript
State Management: Redux Toolkit / Zustand
Styling: Tailwind CSS / Styled Components
HTTP Client: Axios / React Query
Real-time: Socket.io-client
Form Handling: React Hook Form
Validation: Zod / Yup
Testing: Jest, React Testing Library
Build Tool: Vite / Webpack
```

### Backend - Main Service
```yaml
Runtime: Node.js 20+ / Python 3.11+
Framework: Express.js / FastAPI
Language: TypeScript / Python
ORM: Prisma (Node) / SQLAlchemy (Python)
Validation: Joi / Pydantic
Authentication: JWT (jsonwebtoken / python-jose)
Password: bcrypt
File Upload: Multer / FastAPI UploadFile
WebSocket: Socket.io / FastAPI WebSocket
Testing: Jest/Mocha / Pytest
Documentation: Swagger/OpenAPI
```

### Backend - AI Service
```yaml
Runtime: Python 3.11+
Framework: FastAPI
ML Libraries: PyTorch, scikit-learn, transformers
NLP: NLTK, spaCy, transformers (Hugging Face)
Computer Vision: OpenCV, Pillow
Data Processing: NumPy, Pandas
API: RESTful + gRPC for inter-service
Validation: Pydantic
Testing: Pytest
```

### Databases
```yaml
Primary DB: PostgreSQL 15+
Cache: Redis 7+
Document Store: MongoDB 6+
Search: Elasticsearch 8+
Object Storage: Cloudflare R2 (free 10GB) / Backblaze B2 / MinIO
Message Queue: RabbitMQ / Apache Kafka
```

### Infrastructure
```yaml
API Gateway: Kong / Express Gateway
Load Balancer: Railway/Render built-in / Nginx / Caddy
Containerization: Docker
Orchestration: Kubernetes / Docker Compose
CI/CD: GitHub Actions / GitLab CI
Monitoring: Prometheus, Grafana, ELK Stack
Logging: Winston / Python logging
APM: New Relic / DataDog
```

---

## Security & Performance

### Authentication & Authorization
```yaml
Strategy: JWT (JSON Web Tokens)
Token Storage: HttpOnly cookies (web), Secure storage (mobile)
Token Expiry: 
  - Access Token: 15 minutes
  - Refresh Token: 7 days
Password Policy:
  - Minimum 8 characters
  - At least 1 uppercase, 1 lowercase, 1 number, 1 special char
  - Hashed with bcrypt (cost factor: 12)
OAuth2.0: Google, Facebook, GitHub integration
2FA: Optional TOTP (Time-based One-Time Password)
```

### Rate Limiting
```yaml
API Gateway Level:
  - Anonymous: 20 requests/minute
  - Authenticated: 100 requests/minute
  - Premium: 500 requests/minute
  
Service Level:
  - Login attempts: 5 per 15 minutes per IP
  - Registration: 3 per hour per IP
  - Post creation: 10 per hour per user
  - Comment creation: 30 per hour per user
  - File upload: 5 per hour per user (max 10MB each)

Implementation:
  - Redis-based sliding window counter
  - Response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
```

### API Security
```yaml
Private APIs (Internal Communication):
  - Service-to-service authentication using API keys
  - Internal network only (not exposed to internet)
  - Mutual TLS (mTLS) for service mesh
  - IP whitelisting
  
Public APIs:
  - HTTPS only (TLS 1.3)
  - CORS with whitelist origins
  - Input validation and sanitization
  - SQL injection prevention (ORM/parameterized queries)
  - XSS prevention (output encoding)
  - CSRF tokens for state-changing operations
  - Content Security Policy (CSP) headers
  
API Gateway Protection:
  - WAF (Web Application Firewall) integration
  - DDoS protection
  - Request size limits (10MB)
  - Request timeout (30 seconds)
```

### Data Protection
```yaml
Encryption at Rest:
  - Database: AES-256 encryption
  - S3 Objects: Server-side encryption
  - Backups: Encrypted snapshots

Encryption in Transit:
  - TLS 1.3 for all external communication
  - Service-to-service: mTLS

Sensitive Data:
  - PII: Encrypted in database
  - Passwords: Bcrypt hashing
  - API Keys: Hashed and salted
  - Payment Info: Tokenized (never stored)

GDPR Compliance:
  - Data export API
  - Data deletion API
  - Consent management
  - Audit logging
```

### Performance Optimization
```yaml
Caching Strategy:
  - CDN: Static assets (1 year)
  - Redis: 
    - User sessions (15 minutes)
    - Feed data (5 minutes)
    - User profiles (1 hour)
  - Database query caching
  
Database Optimization:
  - Indexing on frequently queried columns
  - Connection pooling (max 20 connections)
  - Read replicas for heavy read operations
  - Partitioning for large tables
  
API Optimization:
  - Response compression (gzip/brotli)
  - Pagination (max 50 items per page)
  - Field selection (GraphQL-style)
  - HTTP/2 multiplexing
  
Frontend Optimization:
  - Code splitting
  - Lazy loading
  - Image optimization (WebP, responsive images)
  - Service worker caching
```

### Monitoring & Logging
```yaml
Metrics:
  - Request rate, response time, error rate
  - Database connection pool status
  - Cache hit/miss ratio
  - Queue depth
  - CPU, Memory, Disk usage

Logging:
  - Structured logging (JSON format)
  - Log levels: ERROR, WARN, INFO, DEBUG
  - Centralized logging (ELK/Loki)
  - Request tracing (correlation IDs)
  - PII masking in logs

Alerting:
  - Error rate > 1%
  - Response time > 2 seconds (p95)
  - Database connections > 80%
  - Disk usage > 85%
  - Queue depth > 1000
```

---

## Deployment Architecture

### Development Environment
```yaml
Setup: Docker Compose
Services: All services run locally
Database: Local PostgreSQL, Redis, MongoDB
Storage: Local filesystem (MinIO)
Hot Reload: Enabled
Debug Mode: Enabled
```

### Staging Environment
```yaml
Infrastructure: Kubernetes cluster (EKS/GKE)
Replicas: 
  - Main Service: 2
  - AI Service: 1
  - API Gateway: 2
Database: Managed services (RDS, ElastiCache)
Domain: staging.socialplay.com
CI/CD: Auto-deploy on merge to develop branch
```

### Production Environment
```yaml
Infrastructure: Kubernetes cluster with auto-scaling
Replicas (minimum): 
  - Main Service: 3 pods
  - AI Service: 2 pods
  - API Gateway: 3 pods
Load Balancer: Railway/Render auto-scaling with health checks
Database: 
  - PostgreSQL: Multi-AZ with read replicas
  - Redis: Cluster mode with 3 nodes
  - MongoDB: Replica set with 3 nodes
Object Storage: Cloudflare R2 (free CDN included) / Backblaze B2
Auto-scaling:
  - CPU > 70%: Scale up
  - CPU < 30%: Scale down
  - Min pods: 3, Max pods: 20
High Availability:
  - Multi-AZ deployment
  - Database failover
  - Backup strategy (daily full, hourly incremental)
Domain: www.socialplay.com
SSL: Let's Encrypt with auto-renewal
```

### Disaster Recovery
```yaml
Backup Strategy:
  - Database: Daily full backup, 4-hour incremental
  - Retention: 30 days
  - Cross-region replication
  
Recovery Objectives:
  - RTO (Recovery Time Objective): 1 hour
  - RPO (Recovery Point Objective): 15 minutes
  
Failover Plan:
  - Automated database failover
  - Manual service failover with runbook
  - Regular disaster recovery drills (monthly)
```

---

## Network Diagram

```
Internet
   │
   ├─── DNS (Route53/Cloudflare)
   │     │
   │     └─── CDN (CloudFront)
   │           └─── S3 (Static Assets)
   │
   └─── Load Balancer (Public Subnet)
         │
         └─── API Gateway (Private Subnet)
               │
               ├─── Main Service (Private Subnet)
               │     └─── PostgreSQL (Private Subnet)
               │     └─── Redis (Private Subnet)
               │
               └─── AI Service (Private Subnet)
                     └─── MongoDB (Private Subnet)
                     └─── Model Storage (S3)

VPC Configuration:
  - Public Subnets: Load Balancer, NAT Gateway
  - Private Subnets: Services, Databases
  - Security Groups: Restrictive inbound rules
  - Network ACLs: Additional layer of security
```

---

## API Request Flow

```
1. Client Request
   └─> CDN (if static asset) → Return from cache
   └─> Load Balancer (HTTPS termination)
       └─> API Gateway
           ├─> Rate Limiting Check
           ├─> JWT Validation (if authenticated endpoint)
           ├─> Request Logging
           └─> Route to Service
               ├─> Main Service (/api/v1/users, /api/v1/posts, etc.)
               │   ├─> Redis Cache Check
               │   ├─> Business Logic
               │   ├─> Database Query
               │   ├─> Response Formatting
               │   └─> Cache Update
               │
               └─> AI Service (/api/v1/ai/recommend, etc.)
                   ├─> Load ML Model
                   ├─> Process Request
                   ├─> Return Prediction/Analysis
                   └─> Log for Training

2. Response
   ←── API Gateway (transform response, add headers)
   ←── Load Balancer
   ←── Client
```

---

## Scalability Strategy

### Horizontal Scaling
- **Stateless Services**: All services are stateless, sessions in Redis
- **Auto-scaling**: Based on CPU, memory, and request rate
- **Database**: Read replicas for scaling reads

### Vertical Scaling
- **Database**: Upgrade instance type as needed
- **AI Service**: GPU instances for ML workloads

### Caching Strategy
- **Multi-level Caching**: CDN → Redis → Database
- **Cache Invalidation**: Time-based + event-based

### Database Sharding (Future)
- **User Sharding**: Shard by user ID
- **Geographic Sharding**: Shard by region

---

## Development Workflow

```
Developer
   │
   ├─> Feature Branch
   │    └─> Local Development (Docker Compose)
   │         └─> Unit Tests
   │              └─> Git Push
   │                   └─> CI Pipeline (GitHub Actions)
   │                        ├─> Linting
   │                        ├─> Unit Tests
   │                        ├─> Integration Tests
   │                        ├─> Build Docker Image
   │                        └─> Push to Registry
   │
   └─> Pull Request
        └─> Code Review
             └─> Merge to develop
                  └─> Auto-deploy to Staging
                       └─> QA Testing
                            └─> Merge to main
                                 └─> Manual deploy to Production
```

---

## Next Steps

1. Review [Frontend Architecture](./01-FRONTEND-ARCHITECTURE.md)
2. Review [Main Service Architecture](./02-MAIN-SERVICE-ARCHITECTURE.md)
3. Review [AI Service Architecture](./03-AI-SERVICE-ARCHITECTURE.md)
4. Review [API Gateway Setup](./04-API-GATEWAY-SETUP.md)
5. Review [Implementation Guide](./05-IMPLEMENTATION-GUIDE.md)
6. Review [API Documentation](./06-API-DOCUMENTATION.md)

---

**Document Version**: 1.0  
**Last Updated**: November 20, 2025  
**Author**: System Architect
