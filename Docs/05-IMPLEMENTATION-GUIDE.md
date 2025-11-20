# Implementation Guide - SocialPlay

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Environment Setup](#development-environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [AI Service Implementation](#ai-service-implementation)
7. [API Gateway Setup](#api-gateway-setup)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

```yaml
Development Tools:
  - Git 2.40+
  - Node.js 20+
  - Python 3.11+
  - Docker 24+
  - Docker Compose 2.20+
  - PostgreSQL 15+ (or use Docker)
  - Redis 7+ (or use Docker)
  - MongoDB 6+ (or use Docker)

Code Editors:
  - VS Code (recommended)
  - IntelliJ IDEA
  - PyCharm

Optional:
  - Postman/Insomnia (API testing)
  - DBeaver (database management)
  - Redis Insight (Redis GUI)
```

### System Requirements

```yaml
Minimum:
  CPU: 4 cores
  RAM: 8 GB
  Disk: 50 GB SSD

Recommended:
  CPU: 8 cores
  RAM: 16 GB
  Disk: 100 GB SSD
  GPU: NVIDIA GPU with 4GB+ VRAM (for AI service)
```

---

## Development Environment Setup

### Step 1: Clone Repository

```bash
# Create project directory
mkdir socialplay
cd socialplay

# Initialize git repository
git init

# Create folder structure
mkdir -p Backend/Main-Service Backend/AI-Service Frontend Docs
```

### Step 2: Install Dependencies

#### Node.js (for Frontend and Main Service)

```bash
# Verify Node.js installation
node --version  # Should be 20+
npm --version

# Install global tools
npm install -g pnpm typescript nodemon ts-node
```

#### Python (for AI Service)

```bash
# Verify Python installation
python --version  # Should be 3.11+
pip --version

# Create virtual environment
cd Backend/AI-Service
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install Python tools
pip install --upgrade pip
pip install poetry  # Package manager (optional)
```

### Step 3: Environment Variables

Create `.env` files for each service:

```bash
# Backend/Main-Service/.env.development
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/socialplay
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this

# AWS S3 (for media storage)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=socialplay-media
AWS_REGION=us-east-1

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@socialplay.com

# AI Service
AI_SERVICE_URL=http://localhost:5000
AI_SERVICE_API_KEY=your-ai-service-key

# Client URL
CLIENT_URL=http://localhost:3001
```

```bash
# Backend/AI-Service/.env
MONGODB_URL=mongodb://localhost:27017/socialplay_ai
REDIS_URL=redis://localhost:6379
API_KEY=your-ai-service-key

# Model paths
MODEL_DIR=/app/models

# Main Service
MAIN_SERVICE_URL=http://localhost:3000
MAIN_SERVICE_API_KEY=your-main-service-key
```

```bash
# Frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3000
NEXT_PUBLIC_CDN_URL=http://localhost:9000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## Database Setup

### Option 1: Docker Compose (Recommended)

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: socialplay-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: socialplay
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: socialplay-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  mongodb:
    image: mongo:6
    container_name: socialplay-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  minio:
    image: minio/minio:latest
    container_name: socialplay-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  redis_data:
  mongodb_data:
  minio_data:
```

Start databases:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Option 2: Local Installation

#### PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE socialplay;
CREATE USER socialplay_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE socialplay TO socialplay_user;
\q
```

#### Redis

```bash
# Ubuntu/Debian
sudo apt install redis-server

# Start service
sudo systemctl start redis
sudo systemctl enable redis
```

#### MongoDB

```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Backend Implementation

### Step 1: Initialize Main Service (Node.js)

```bash
cd Backend/Main-Service

# Initialize npm project
npm init -y

# Install dependencies
npm install express @prisma/client bcrypt jsonwebtoken \
  joi cors helmet morgan winston dotenv \
  multer sharp socket.io bull redis ioredis \
  nodemailer @aws-sdk/client-s3

# Install dev dependencies
npm install -D typescript @types/node @types/express \
  @types/bcrypt @types/jsonwebtoken @types/cors \
  @types/multer ts-node nodemon prisma jest \
  @types/jest supertest @types/supertest eslint prettier
```

### Step 2: Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# Copy the schema from documentation (02-MAIN-SERVICE-ARCHITECTURE.md)
# Edit prisma/schema.prisma

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### Step 3: Create Project Structure

```bash
mkdir -p src/{modules,shared,config,queue,socket}
mkdir -p src/modules/{auth,user,post,comment,like,follow,message,notification,media,analytics}
mkdir -p src/shared/{middleware,utils,types,constants,database}

# Create main files
touch src/app.ts src/server.ts src/routes.ts
```

### Step 4: Implement Core Files

Create `src/config/database.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
```

Create `src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './shared/middleware/error.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1', routes);

// Error handler
app.use(errorHandler);

export default app;
```

Create `src/server.ts`:

```typescript
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { connectDatabase } from './config/database';
import { initSocket } from './socket/socket';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Connect to database
  await connectDatabase();
  
  // Create HTTP server
  const server = http.createServer(app);
  
  // Initialize Socket.IO
  initSocket(server);
  
  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
```

### Step 5: Implement Auth Module

Follow the code examples from `02-MAIN-SERVICE-ARCHITECTURE.md` to implement:

1. `modules/auth/auth.service.ts`
2. `modules/auth/auth.controller.ts`
3. `modules/auth/auth.routes.ts`
4. `modules/auth/auth.validation.ts`
5. `shared/middleware/auth.middleware.ts`
6. `shared/utils/jwt.ts`

### Step 6: Run Main Service

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

---

## Frontend Implementation

### Step 1: Create Next.js App

```bash
cd Frontend

# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# Install additional dependencies
npm install @tanstack/react-query zustand axios socket.io-client \
  react-hook-form @hookform/resolvers zod \
  framer-motion lucide-react date-fns

# Install dev dependencies
npm install -D @types/socket.io-client
```

### Step 2: Create Project Structure

```bash
mkdir -p src/{components,lib,hooks,store,services,types,schemas,styles}
mkdir -p src/components/{ui,layout,features,shared}
mkdir -p src/lib/{api,auth,socket,utils}
```

### Step 3: Setup API Client

Create `src/lib/api/axios.ts` (from 01-FRONTEND-ARCHITECTURE.md)

### Step 4: Setup State Management

Create Zustand stores:

```bash
mkdir -p src/store/slices
touch src/store/slices/{authSlice,userSlice,postSlice,uiSlice}.ts
```

Implement auth store (from 01-FRONTEND-ARCHITECTURE.md)

### Step 5: Create UI Components

```bash
# Install shadcn/ui (optional)
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
```

### Step 6: Implement Pages

```bash
mkdir -p src/app/(auth)/{login,register}
mkdir -p src/app/(dashboard)/{feed,profile,messages,notifications}

# Create page files
touch src/app/(auth)/login/page.tsx
touch src/app/(auth)/register/page.tsx
touch src/app/(dashboard)/feed/page.tsx
```

### Step 7: Run Frontend

```bash
npm run dev
```

Access at: `http://localhost:3001`

---

## AI Service Implementation

### Step 1: Setup Python Environment

```bash
cd Backend/AI-Service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Install dependencies
pip install fastapi uvicorn[standard] \
  tensorflow torch torchvision transformers \
  scikit-learn pandas numpy \
  pillow opencv-python \
  pydantic python-dotenv \
  redis motor pymongo \
  httpx celery
```

### Step 2: Create requirements.txt

```text
fastapi==0.104.1
uvicorn[standard]==0.24.0
tensorflow==2.15.0
torch==2.1.0
torchvision==0.16.0
transformers==4.35.0
scikit-learn==1.3.2
pandas==2.1.3
numpy==1.26.2
pillow==10.1.0
opencv-python==4.8.1
pydantic==2.5.0
python-dotenv==1.0.0
redis==5.0.1
motor==3.3.2
pymongo==4.6.0
httpx==0.25.1
celery==5.3.4
pytest==7.4.3
```

### Step 3: Create Project Structure

```bash
mkdir -p src/{api,models,services,schemas,core,ml,data,tasks}
mkdir -p src/api/v1/routes
mkdir -p src/models/{recommendation,moderation,sentiment,image,trends}
```

### Step 4: Implement FastAPI App

Create `src/main.py` (from 03-AI-SERVICE-ARCHITECTURE.md)

### Step 5: Download Pre-trained Models

```bash
# Create models directory
mkdir -p models/{recommendation,moderation,sentiment,image}

# Download models (example using Hugging Face)
python -c "
from transformers import AutoTokenizer, AutoModel
model_name = 'distilbert-base-uncased-finetuned-sst-2-english'
AutoTokenizer.from_pretrained(model_name).save_pretrained('models/sentiment/distilbert')
AutoModel.from_pretrained(model_name).save_pretrained('models/sentiment/distilbert')
"
```

### Step 6: Run AI Service

```bash
# Development
uvicorn src.main:app --reload --port 5000

# Production
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:5000
```

---

## API Gateway Setup

### Option 1: Kong (Production)

Follow `04-API-GATEWAY-SETUP.md` for complete Kong setup.

```bash
# Start Kong with Docker Compose
docker-compose -f docker-compose.gateway.yml up -d

# Run setup script
bash scripts/setup-kong.sh
bash scripts/configure-rate-limiting.sh
bash scripts/configure-auth.sh
```

### Option 2: Express Gateway (Development)

```bash
cd gateway

# Initialize project
npm init -y

# Install dependencies
npm install express http-proxy-middleware \
  express-rate-limit rate-limit-redis \
  redis cors helmet jsonwebtoken \
  winston dotenv

npm install -D typescript @types/node @types/express

# Create files
mkdir -p src/middleware
touch src/{server.ts,middleware/auth.ts,middleware/logger.ts}
```

Implement gateway (from 04-API-GATEWAY-SETUP.md)

---

## Testing

### Backend Tests

```bash
cd Backend/Main-Service

# Run tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Example test:

```typescript
// src/modules/auth/tests/auth.service.test.ts
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
  });
  
  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };
      
      const result = await authService.register(userData);
      
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.accessToken).toBeDefined();
    });
  });
});
```

### Frontend Tests

```bash
cd Frontend

# Run tests
npm test

# E2E tests
npx playwright test
```

### API Testing with Postman

Import this collection:

```json
{
  "info": { "name": "SocialPlay API", "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:8000/api/v1/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"Password123!\",\"firstName\":\"Test\",\"lastName\":\"User\"}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Deployment

### Build Docker Images

```bash
# Main Service
cd Backend/Main-Service
docker build -t socialplay-main:latest .

# AI Service
cd Backend/AI-Service
docker build -t socialplay-ai:latest .

# Frontend
cd Frontend
docker build -t socialplay-frontend:latest .
```

### Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: socialplay-frontend:latest
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.socialplay.com/api/v1
    depends_on:
      - gateway

  gateway:
    image: kong:3.4
    ports:
      - "80:8000"
      - "443:8443"
    environment:
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=postgres
    depends_on:
      - main-service
      - ai-service

  main-service:
    image: socialplay-main:latest
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/socialplay
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    deploy:
      replicas: 3

  ai-service:
    image: socialplay-ai:latest
    environment:
      - MONGODB_URL=mongodb://mongo:27017/socialplay_ai
    deploy:
      replicas: 2
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db

volumes:
  postgres_data:
  redis_data:
  mongo_data:
```

### Deploy to Cloud

#### AWS EC2

```bash
# SSH to server
ssh -i key.pem ubuntu@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone repository
git clone https://github.com/yourusername/socialplay.git
cd socialplay

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

#### Kubernetes

```bash
# Create deployment
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services
```

---

## Troubleshooting

### Common Issues

#### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection
psql -h localhost -U postgres -d socialplay

# Reset database
npx prisma migrate reset
```

#### Port Already in Use

```bash
# Find process using port
# Windows:
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Linux/Mac:
lsof -i :3000
kill -9 <pid>
```

#### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### CORS Error

Check `.env` file:
```bash
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
```

#### JWT Token Invalid

Ensure secrets match between services and generate new token.

---

## Next Steps

1. ✅ Review [API Documentation](./06-API-DOCUMENTATION.md)
2. Configure CI/CD pipeline
3. Set up monitoring (Prometheus, Grafana)
4. Configure backups
5. Perform load testing
6. Set up SSL certificates
7. Configure domain and DNS

---

**Congratulations! You've implemented the SocialPlay platform.** 🎉
