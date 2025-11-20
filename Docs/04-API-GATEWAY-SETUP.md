# API Gateway Setup Guide - SocialPlay

## Table of Contents
1. [Overview](#overview)
2. [Technology Options](#technology-options)
3. [Kong API Gateway Setup](#kong-api-gateway-setup)
4. [Rate Limiting Configuration](#rate-limiting-configuration)
5. [Authentication & Authorization](#authentication--authorization)
6. [Route Configuration](#route-configuration)
7. [Load Balancing](#load-balancing)
8. [Security Features](#security-features)
9. [Monitoring & Logging](#monitoring--logging)
10. [Alternative: Express API Gateway](#alternative-express-api-gateway)

---

## Overview

The API Gateway serves as the single entry point for all client requests, handling:
- **Request Routing**: Direct requests to appropriate services
- **Authentication**: JWT validation
- **Rate Limiting**: Prevent abuse
- **Load Balancing**: Distribute traffic
- **Request/Response Transformation**: Modify payloads
- **Logging & Monitoring**: Track all requests
- **Security**: CORS, API key validation, IP filtering

### Architecture

```
Client → Load Balancer → API Gateway → [Main Service / AI Service]
                           │
                           ├─> Rate Limiter (Redis)
                           ├─> Auth Validator (JWT)
                           ├─> Request Logger
                           └─> Security Filters
```

---

## Technology Options

### Option 1: Kong API Gateway (Recommended for Production)
**Pros:**
- Enterprise-grade, battle-tested
- Rich plugin ecosystem
- High performance (built on Nginx)
- Excellent rate limiting and auth plugins
- Admin UI available

**Cons:**
- More complex setup
- Requires PostgreSQL or Cassandra for configuration
- Higher resource usage

### Option 2: AWS API Gateway
**Pros:**
- Fully managed service
- Auto-scaling
- Integrated with AWS services
- Built-in monitoring

**Cons:**
- AWS vendor lock-in
- Can be expensive at scale
- Less customization

### Option 3: Custom Express.js Gateway
**Pros:**
- Full control
- Simple to customize
- Lower resource usage
- Easy debugging

**Cons:**
- Need to implement features yourself
- Less battle-tested
- More maintenance

---

## Kong API Gateway Setup

### Installation with Docker Compose

```yaml
# docker-compose.gateway.yml
version: '3.8'

services:
  kong-database:
    image: postgres:15
    environment:
      POSTGRES_USER: kong
      POSTGRES_DB: kong
      POSTGRES_PASSWORD: kong_password
    volumes:
      - kong_data:/var/lib/postgresql/data
    networks:
      - kong-net
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "kong"]
      interval: 10s
      timeout: 5s
      retries: 5

  kong-migration:
    image: kong:3.4
    command: kong migrations bootstrap
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong_password
      KONG_PG_DATABASE: kong
    depends_on:
      kong-database:
        condition: service_healthy
    networks:
      - kong-net

  kong:
    image: kong:3.4
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong_password
      KONG_PG_DATABASE: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
      KONG_PROXY_LISTEN: 0.0.0.0:8000, 0.0.0.0:8443 ssl
    ports:
      - "8000:8000"   # Proxy HTTP
      - "8443:8443"   # Proxy HTTPS
      - "8001:8001"   # Admin API HTTP
      - "8444:8444"   # Admin API HTTPS
    depends_on:
      kong-database:
        condition: service_healthy
      kong-migration:
        condition: service_completed_successfully
    networks:
      - kong-net
    healthcheck:
      test: ["CMD", "kong", "health"]
      interval: 10s
      timeout: 10s
      retries: 10

  konga:
    image: pantsel/konga:latest
    environment:
      NODE_ENV: production
      DB_ADAPTER: postgres
      DB_HOST: kong-database
      DB_USER: kong
      DB_PASSWORD: kong_password
      DB_DATABASE: konga
    ports:
      - "1337:1337"
    depends_on:
      - kong-database
    networks:
      - kong-net

networks:
  kong-net:
    driver: bridge

volumes:
  kong_data:
```

### Start Kong

```bash
docker-compose -f docker-compose.gateway.yml up -d
```

### Verify Kong is Running

```bash
curl -i http://localhost:8001/
```

---

## Route Configuration

### Configure Services and Routes

```bash
#!/bin/bash
# scripts/setup-kong.sh

KONG_ADMIN_URL="http://localhost:8001"

# ==================== MAIN SERVICE ====================

# Create Main Service
curl -i -X POST $KONG_ADMIN_URL/services \
  --data name=main-service \
  --data url=http://main-service:3000

# Create routes for Main Service
# Authentication routes
curl -i -X POST $KONG_ADMIN_URL/services/main-service/routes \
  --data 'paths[]=/api/v1/auth' \
  --data name=auth-routes

# User routes
curl -i -X POST $KONG_ADMIN_URL/services/main-service/routes \
  --data 'paths[]=/api/v1/users' \
  --data name=user-routes

# Post routes
curl -i -X POST $KONG_ADMIN_URL/services/main-service/routes \
  --data 'paths[]=/api/v1/posts' \
  --data name=post-routes

# Comment routes
curl -i -X POST $KONG_ADMIN_URL/services/main-service/routes \
  --data 'paths[]=/api/v1/comments' \
  --data name=comment-routes

# Message routes
curl -i -X POST $KONG_ADMIN_URL/services/main-service/routes \
  --data 'paths[]=/api/v1/messages' \
  --data name=message-routes

# Notification routes
curl -i -X POST $KONG_ADMIN_URL/services/main-service/routes \
  --data 'paths[]=/api/v1/notifications' \
  --data name=notification-routes

# ==================== AI SERVICE ====================

# Create AI Service
curl -i -X POST $KONG_ADMIN_URL/services \
  --data name=ai-service \
  --data url=http://ai-service:5000

# Create routes for AI Service (Internal only)
curl -i -X POST $KONG_ADMIN_URL/services/ai-service/routes \
  --data 'paths[]=/api/v1/ai' \
  --data name=ai-routes
```

---

## Rate Limiting Configuration

### Redis Setup for Rate Limiting

```yaml
# Add to docker-compose.gateway.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - kong-net
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

### Configure Rate Limiting Plugin

```bash
#!/bin/bash
# scripts/configure-rate-limiting.sh

KONG_ADMIN_URL="http://localhost:8001"

# ==================== GLOBAL RATE LIMITS ====================

# Global rate limit (applies to all routes)
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=rate-limiting \
  --data config.minute=100 \
  --data config.hour=5000 \
  --data config.policy=redis \
  --data config.redis_host=redis \
  --data config.redis_port=6379

# ==================== ROUTE-SPECIFIC RATE LIMITS ====================

# Authentication routes - stricter limits
AUTH_ROUTE_ID=$(curl -s $KONG_ADMIN_URL/routes | jq -r '.data[] | select(.name=="auth-routes") | .id')

curl -i -X POST $KONG_ADMIN_URL/routes/$AUTH_ROUTE_ID/plugins \
  --data name=rate-limiting \
  --data config.minute=5 \
  --data config.hour=20 \
  --data config.policy=redis \
  --data config.redis_host=redis \
  --data config.redis_port=6379 \
  --data config.fault_tolerant=true

# Post creation - moderate limits
POST_ROUTE_ID=$(curl -s $KONG_ADMIN_URL/routes | jq -r '.data[] | select(.name=="post-routes") | .id')

curl -i -X POST $KONG_ADMIN_URL/routes/$POST_ROUTE_ID/plugins \
  --data name=rate-limiting \
  --data config.minute=10 \
  --data config.hour=100 \
  --data config.policy=redis \
  --data config.redis_host=redis \
  --data config.redis_port=6379

# ==================== USER-BASED RATE LIMITS ====================

# Rate limit by authenticated user
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=rate-limiting \
  --data config.minute=100 \
  --data config.hour=10000 \
  --data config.policy=redis \
  --data config.redis_host=redis \
  --data config.redis_port=6379 \
  --data config.limit_by=consumer

# Premium users get higher limits (configured per consumer)
```

### Rate Limiting Tiers

```bash
#!/bin/bash
# Configure different rate limits for user tiers

# Free tier (default)
FREE_LIMIT_MINUTE=100
FREE_LIMIT_HOUR=5000

# Premium tier
PREMIUM_LIMIT_MINUTE=500
PREMIUM_LIMIT_HOUR=50000

# Create consumer for premium user
curl -i -X POST $KONG_ADMIN_URL/consumers \
  --data username=premium_user_123

# Apply premium rate limit to consumer
curl -i -X POST $KONG_ADMIN_URL/consumers/premium_user_123/plugins \
  --data name=rate-limiting \
  --data config.minute=$PREMIUM_LIMIT_MINUTE \
  --data config.hour=$PREMIUM_LIMIT_HOUR \
  --data config.policy=redis \
  --data config.redis_host=redis
```

---

## Authentication & Authorization

### JWT Plugin Configuration

```bash
#!/bin/bash
# scripts/configure-auth.sh

KONG_ADMIN_URL="http://localhost:8001"

# ==================== JWT AUTHENTICATION ====================

# Enable JWT plugin globally (except for public routes)
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=jwt \
  --data config.key_claim_name=kid \
  --data config.secret_is_base64=false \
  --data config.run_on_preflight=false

# ==================== EXCLUDE PUBLIC ROUTES FROM AUTH ====================

# Get route IDs
AUTH_ROUTE_ID=$(curl -s $KONG_ADMIN_URL/routes | jq -r '.data[] | select(.name=="auth-routes") | .id')

# Disable JWT for auth routes (login, register, etc.)
curl -i -X POST $KONG_ADMIN_URL/routes/$AUTH_ROUTE_ID/plugins \
  --data name=request-termination \
  --data config.status_code=200 \
  --data config.message="Allowed" \
  --data enabled=false

# Alternative: Use ACL to allow anonymous access
curl -i -X POST $KONG_ADMIN_URL/routes/$AUTH_ROUTE_ID/plugins \
  --data name=acl \
  --data config.allow=anonymous

# ==================== JWT CREDENTIALS ====================

# Create consumer (represents a user)
curl -i -X POST $KONG_ADMIN_URL/consumers \
  --data username=user_123

# Create JWT credential for consumer
curl -i -X POST $KONG_ADMIN_URL/consumers/user_123/jwt \
  --data algorithm=HS256 \
  --data key=user_123_key \
  --data secret=your-secret-key
```

### JWT Validation Flow

```
1. Client sends request with JWT in Authorization header
   Authorization: Bearer <jwt_token>

2. Kong validates JWT:
   - Signature verification
   - Expiration check
   - Issuer validation

3. If valid:
   - Extract user ID from JWT
   - Add to request headers: X-Consumer-ID, X-Consumer-Username
   - Forward to backend service

4. If invalid:
   - Return 401 Unauthorized
```

### Custom JWT Validation (Alternative)

```lua
-- kong/plugins/custom-jwt/handler.lua
local jwt_decoder = require "kong.plugins.jwt.jwt_parser"

local CustomJWTHandler = {
  PRIORITY = 1000,
  VERSION = "1.0.0",
}

function CustomJWTHandler:access(conf)
  local token = kong.request.get_header("Authorization")
  
  if not token then
    return kong.response.exit(401, { message = "No token provided" })
  end
  
  -- Remove "Bearer " prefix
  token = token:sub(8)
  
  -- Decode and verify JWT
  local jwt, err = jwt_decoder:new(token)
  if err then
    return kong.response.exit(401, { message = "Invalid token" })
  end
  
  -- Verify signature
  local verified = jwt:verify_signature(conf.secret_key)
  if not verified then
    return kong.response.exit(401, { message = "Invalid signature" })
  end
  
  -- Check expiration
  if jwt.claims.exp and jwt.claims.exp < os.time() then
    return kong.response.exit(401, { message = "Token expired" })
  end
  
  -- Add user ID to headers
  kong.service.request.set_header("X-User-ID", jwt.claims.userId)
  kong.service.request.set_header("X-User-Role", jwt.claims.role)
end

return CustomJWTHandler
```

---

## Load Balancing

### Upstream Configuration

```bash
#!/bin/bash
# scripts/configure-load-balancing.sh

KONG_ADMIN_URL="http://localhost:8001"

# ==================== CREATE UPSTREAM ====================

# Create upstream for Main Service
curl -i -X POST $KONG_ADMIN_URL/upstreams \
  --data name=main-service-upstream \
  --data algorithm=round-robin \
  --data slots=1000

# Create upstream for AI Service
curl -i -X POST $KONG_ADMIN_URL/upstreams \
  --data name=ai-service-upstream \
  --data algorithm=least-connections

# ==================== ADD TARGETS (INSTANCES) ====================

# Add Main Service instances
curl -i -X POST $KONG_ADMIN_URL/upstreams/main-service-upstream/targets \
  --data target=main-service-1:3000 \
  --data weight=100

curl -i -X POST $KONG_ADMIN_URL/upstreams/main-service-upstream/targets \
  --data target=main-service-2:3000 \
  --data weight=100

curl -i -X POST $KONG_ADMIN_URL/upstreams/main-service-upstream/targets \
  --data target=main-service-3:3000 \
  --data weight=100

# Add AI Service instances
curl -i -X POST $KONG_ADMIN_URL/upstreams/ai-service-upstream/targets \
  --data target=ai-service-1:5000 \
  --data weight=100

curl -i -X POST $KONG_ADMIN_URL/upstreams/ai-service-upstream/targets \
  --data target=ai-service-2:5000 \
  --data weight=100

# ==================== UPDATE SERVICE TO USE UPSTREAM ====================

curl -i -X PATCH $KONG_ADMIN_URL/services/main-service \
  --data host=main-service-upstream

curl -i -X PATCH $KONG_ADMIN_URL/services/ai-service \
  --data host=ai-service-upstream
```

### Health Checks

```bash
# Configure health checks for Main Service upstream
curl -i -X POST $KONG_ADMIN_URL/upstreams/main-service-upstream/health \
  --data healthchecks.active.healthy.interval=5 \
  --data healthchecks.active.healthy.successes=2 \
  --data healthchecks.active.unhealthy.interval=5 \
  --data healthchecks.active.unhealthy.http_failures=3 \
  --data healthchecks.active.http_path=/health

# Configure passive health checks
curl -i -X PATCH $KONG_ADMIN_URL/upstreams/main-service-upstream \
  --data healthchecks.passive.healthy.successes=5 \
  --data healthchecks.passive.unhealthy.http_failures=5 \
  --data healthchecks.passive.unhealthy.timeouts=3
```

---

## Security Features

### CORS Configuration

```bash
#!/bin/bash
# scripts/configure-cors.sh

KONG_ADMIN_URL="http://localhost:8001"

# Enable CORS plugin
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=cors \
  --data config.origins=https://socialplay.com,https://www.socialplay.com,http://localhost:3001 \
  --data config.methods=GET,POST,PUT,DELETE,PATCH,OPTIONS \
  --data config.headers=Accept,Authorization,Content-Type,X-CSRF-Token \
  --data config.exposed_headers=X-RateLimit-Limit,X-RateLimit-Remaining,X-RateLimit-Reset \
  --data config.credentials=true \
  --data config.max_age=3600
```

### IP Restriction (Optional)

```bash
# Restrict access to admin API by IP
curl -i -X POST $KONG_ADMIN_URL/routes/{admin-route-id}/plugins \
  --data name=ip-restriction \
  --data config.allow=10.0.0.0/8,192.168.0.0/16
```

### Request Size Limiting

```bash
# Limit request body size to 10MB
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=request-size-limiting \
  --data config.allowed_payload_size=10
```

### Bot Detection

```bash
# Block common bots
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=bot-detection \
  --data config.allow=googlebot,bingbot \
  --data config.deny=badbot,maliciousbot
```

### Request/Response Transformation

```bash
# Remove sensitive headers from response
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=response-transformer \
  --data config.remove.headers=X-Internal-Server,X-Database-Host

# Add custom headers to requests
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=request-transformer \
  --data config.add.headers=X-Gateway:Kong,X-Request-ID:$(uuidgen)
```

---

## Monitoring & Logging

### Prometheus Plugin

```bash
# Enable Prometheus metrics
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=prometheus
```

Access metrics at: `http://localhost:8001/metrics`

### File Logging

```bash
# Log all requests to file
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=file-log \
  --data config.path=/var/log/kong/access.log
```

### HTTP Logging (to centralized logging service)

```bash
# Send logs to ELK stack
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=http-log \
  --data config.http_endpoint=http://logstash:5000 \
  --data config.method=POST \
  --data config.content_type=application/json
```

### Request Tracing

```bash
# Enable request ID for tracing
curl -i -X POST $KONG_ADMIN_URL/plugins \
  --data name=correlation-id \
  --data config.header_name=X-Request-ID \
  --data config.generator=uuid \
  --data config.echo_downstream=true
```

---

## Alternative: Express API Gateway

For simpler deployments, use a custom Express.js gateway:

### Express Gateway Implementation

```typescript
// gateway/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { authenticateJWT } from './middleware/auth';
import { logger } from './middleware/logger';

const app = express();
const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.connect();

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
  credentials: true
}));

// Request logging
app.use(logger);

// Global rate limiter
const globalLimiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests from this IP'
});

app.use(globalLimiter);

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Public routes (no auth)
app.use('/api/v1/auth', createProxyMiddleware({
  target: 'http://main-service:3000',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Forwarded-For', req.ip);
  }
}));

// Protected routes (require JWT)
app.use('/api/v1/users', authenticateJWT, createProxyMiddleware({
  target: 'http://main-service:3000',
  changeOrigin: true
}));

app.use('/api/v1/posts', authenticateJWT, createProxyMiddleware({
  target: 'http://main-service:3000',
  changeOrigin: true
}));

app.use('/api/v1/comments', authenticateJWT, createProxyMiddleware({
  target: 'http://main-service:3000',
  changeOrigin: true
}));

app.use('/api/v1/messages', authenticateJWT, createProxyMiddleware({
  target: 'http://main-service:3000',
  changeOrigin: true
}));

app.use('/api/v1/notifications', authenticateJWT, createProxyMiddleware({
  target: 'http://main-service:3000',
  changeOrigin: true
}));

// Internal AI service (requires API key, not exposed publicly)
app.use('/api/v1/ai', 
  (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.AI_SERVICE_API_KEY) {
      return res.status(403).json({ error: 'Invalid API key' });
    }
    next();
  },
  createProxyMiddleware({
    target: 'http://ai-service:5000',
    changeOrigin: true
  })
);

// ==================== ERROR HANDLER ====================

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
```

### JWT Authentication Middleware

```typescript
// gateway/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    
    // Add user info to headers for backend services
    req.headers['x-user-id'] = payload.userId;
    req.headers['x-user-role'] = payload.role;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Request Logger

```typescript
// gateway/src/middleware/logger.ts
import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'gateway.log' }),
    new winston.transports.Console()
  ]
});

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
  });
  
  next();
};
```

### Dockerfile

```dockerfile
# gateway/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["node", "dist/server.js"]
```

---

## Configuration Summary

### Environment Variables

```bash
# .env
# Kong Configuration
KONG_DATABASE=postgres
KONG_PG_HOST=kong-database
KONG_PG_USER=kong
KONG_PG_PASSWORD=kong_password
KONG_PG_DATABASE=kong

# Redis for Rate Limiting
REDIS_URL=redis://redis:6379

# Backend Services
MAIN_SERVICE_URL=http://main-service:3000
AI_SERVICE_URL=http://ai-service:5000
AI_SERVICE_API_KEY=your-secret-api-key

# JWT
JWT_SECRET=your-jwt-secret-key

# CORS
ALLOWED_ORIGINS=https://socialplay.com,http://localhost:3001

# Rate Limits
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Testing the Gateway

```bash
# Test health check
curl http://localhost:8000/health

# Test rate limiting
for i in {1..110}; do
  curl http://localhost:8000/api/v1/posts
done
# Should get 429 after 100 requests

# Test authentication
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:8000/api/v1/users/me
# Should get 401

# Test with valid token
curl -H "Authorization: Bearer <valid_token>" \
  http://localhost:8000/api/v1/users/me
# Should get 200
```

---

**Next Document**: [Implementation Guide](./05-IMPLEMENTATION-GUIDE.md)
