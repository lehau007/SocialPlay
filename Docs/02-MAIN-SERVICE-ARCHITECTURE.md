# Main Service Architecture - SocialPlay Backend

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Design](#database-design)
5. [Service Modules](#service-modules)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [File Upload & Processing](#file-upload--processing)
11. [Real-time Features](#real-time-features)
12. [Caching Strategy](#caching-strategy)
13. [Background Jobs](#background-jobs)
14. [Testing](#testing)

---

## Overview

The Main Service is the core backend application handling all primary business logic, user management, content operations, and social interactions.

### Responsibilities
- User authentication and authorization
- Profile management
- Post, comment, and like operations
- Follow/unfollow relationships
- Direct messaging
- Notifications
- Media upload and processing
- Analytics and reporting

### Architecture Style
**Modular Monolith** - Organized into independent modules that can be extracted into microservices if needed.

---

## Technology Stack

### Option 1: Node.js Stack (Recommended)
```yaml
Runtime: Node.js 20+
Framework: Express.js 4.18+
Language: TypeScript 5+
ORM: Prisma 5+
Validation: Joi / Zod
Authentication: Passport.js + JWT
Password Hashing: bcrypt
File Upload: Multer
Image Processing: Sharp
WebSocket: Socket.io
Email: Nodemailer
Queue: Bull (Redis-based)
Testing: Jest + Supertest
Documentation: Swagger (swagger-jsdoc, swagger-ui-express)
Logging: Winston + Morgan
Environment: dotenv
Process Manager: PM2
```

### Option 2: Python Stack
```yaml
Runtime: Python 3.11+
Framework: FastAPI 0.104+
ORM: SQLAlchemy 2.0+ with Alembic
Validation: Pydantic
Authentication: python-jose (JWT)
Password Hashing: passlib with bcrypt
File Upload: FastAPI UploadFile
Image Processing: Pillow
WebSocket: FastAPI WebSocket
Email: FastAPI-Mail
Queue: Celery with Redis
Testing: Pytest + httpx
Documentation: FastAPI auto-documentation
Logging: Python logging + structlog
Environment: python-decouple
Process Manager: Gunicorn + Uvicorn workers
```

---

## Project Structure (Node.js/TypeScript)

```
Backend/
├── src/
│   ├── config/                    # Configuration files
│   │   ├── database.ts           # Database connection
│   │   ├── redis.ts              # Redis client
│   │   ├── storage.ts            # S3/MinIO config
│   │   ├── email.ts              # Email service config
│   │   └── constants.ts          # Application constants
│   │
│   ├── modules/                   # Feature modules
│   │   ├── auth/                 # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── refresh.dto.ts
│   │   │   └── tests/
│   │   │       ├── auth.service.test.ts
│   │   │       └── auth.controller.test.ts
│   │   │
│   │   ├── user/                 # User module
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── user.validation.ts
│   │   │   ├── dto/
│   │   │   └── tests/
│   │   │
│   │   ├── post/                 # Post module
│   │   │   ├── post.controller.ts
│   │   │   ├── post.service.ts
│   │   │   ├── post.routes.ts
│   │   │   ├── post.validation.ts
│   │   │   ├── dto/
│   │   │   └── tests/
│   │   │
│   │   ├── comment/              # Comment module
│   │   ├── like/                 # Like module
│   │   ├── follow/               # Follow module
│   │   ├── message/              # Message module
│   │   ├── notification/         # Notification module
│   │   ├── media/                # Media upload module
│   │   └── analytics/            # Analytics module
│   │
│   ├── shared/                    # Shared utilities
│   │   ├── database/
│   │   │   ├── prisma.ts         # Prisma client
│   │   │   └── migrations/
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── rateLimiter.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── cors.middleware.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts         # Winston logger
│   │   │   ├── jwt.ts            # JWT utilities
│   │   │   ├── password.ts       # Password hashing
│   │   │   ├── email.ts          # Email sender
│   │   │   ├── upload.ts         # File upload handler
│   │   │   ├── pagination.ts     # Pagination helper
│   │   │   └── errors.ts         # Custom error classes
│   │   │
│   │   ├── types/
│   │   │   ├── express.d.ts      # Express type extensions
│   │   │   ├── models.ts         # Shared types
│   │   │   └── enums.ts          # Enums
│   │   │
│   │   └── constants/
│   │       ├── errors.ts         # Error messages
│   │       ├── success.ts        # Success messages
│   │       └── regex.ts          # Regex patterns
│   │
│   ├── queue/                     # Background jobs
│   │   ├── jobs/
│   │   │   ├── email.job.ts
│   │   │   ├── notification.job.ts
│   │   │   └── media.job.ts
│   │   └── workers/
│   │       └── index.ts
│   │
│   ├── socket/                    # WebSocket handlers
│   │   ├── socket.ts
│   │   ├── events/
│   │   │   ├── message.events.ts
│   │   │   ├── notification.events.ts
│   │   │   └── presence.events.ts
│   │   └── middleware/
│   │       └── auth.middleware.ts
│   │
│   ├── app.ts                     # Express app setup
│   ├── server.ts                  # Server entry point
│   └── routes.ts                  # Route aggregator
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                  # Environment variables template
├── .env.development
├── .env.production
├── .eslintrc.json               # ESLint config
├── .prettierrc                  # Prettier config
├── tsconfig.json                # TypeScript config
├── jest.config.js               # Jest config
├── Dockerfile                   # Docker config
├── docker-compose.yml           # Docker Compose
└── package.json
```

---

## Database Design

### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USER MODELS ====================

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String    @unique
  password      String    // Hashed with bcrypt
  firstName     String?
  lastName      String?
  bio           String?   @db.Text
  avatar        String?
  coverImage    String?
  dateOfBirth   DateTime?
  phone         String?
  isVerified    Boolean   @default(false)
  isActive      Boolean   @default(true)
  role          Role      @default(USER)
  
  // Social stats (denormalized for performance)
  followersCount Int      @default(0)
  followingCount Int      @default(0)
  postsCount     Int      @default(0)
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  
  // Relations
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  followers     Follow[]  @relation("UserFollowers")
  following     Follow[]  @relation("UserFollowing")
  sentMessages     Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
  notifications Notification[]
  sessions      Session[]
  
  @@index([email])
  @@index([username])
  @@map("users")
}

enum Role {
  USER
  MODERATOR
  ADMIN
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  refreshToken String   @unique
  userAgent    String?
  ipAddress    String?
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([refreshToken])
  @@map("sessions")
}

// ==================== POST MODELS ====================

model Post {
  id          String    @id @default(uuid())
  content     String    @db.Text
  mediaUrls   String[]  // Array of image/video URLs
  mediaType   MediaType?
  visibility  Visibility @default(PUBLIC)
  
  // Denormalized counts for performance
  likesCount    Int @default(0)
  commentsCount Int @default(0)
  sharesCount   Int @default(0)
  
  // Author
  authorId    String
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?
  
  // Relations
  comments    Comment[]
  likes       Like[]
  
  @@index([authorId])
  @@index([createdAt])
  @@map("posts")
}

enum MediaType {
  IMAGE
  VIDEO
  DOCUMENT
}

enum Visibility {
  PUBLIC
  FOLLOWERS
  PRIVATE
}

// ==================== COMMENT MODELS ====================

model Comment {
  id          String   @id @default(uuid())
  content     String   @db.Text
  
  // Relations
  postId      String
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  // Nested comments (replies)
  parentId    String?
  parent      Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies     Comment[] @relation("CommentReplies")
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([postId])
  @@index([authorId])
  @@index([parentId])
  @@map("comments")
}

// ==================== LIKE MODEL ====================

model Like {
  id        String   @id @default(uuid())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, postId]) // User can only like a post once
  @@index([userId])
  @@index([postId])
  @@map("likes")
}

// ==================== FOLLOW MODEL ====================

model Follow {
  id          String   @id @default(uuid())
  
  followerId  String   // User who follows
  follower    User     @relation("UserFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  
  followingId String   // User being followed
  following   User     @relation("UserFollowers", fields: [followingId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  
  @@unique([followerId, followingId]) // Can't follow same user twice
  @@index([followerId])
  @@index([followingId])
  @@map("follows")
}

// ==================== MESSAGE MODELS ====================

model Message {
  id         String      @id @default(uuid())
  content    String      @db.Text
  mediaUrl   String?
  isRead     Boolean     @default(false)
  
  senderId   String
  sender     User        @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  
  receiverId String
  receiver   User        @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  
  createdAt  DateTime    @default(now())
  readAt     DateTime?
  
  @@index([senderId])
  @@index([receiverId])
  @@index([createdAt])
  @@map("messages")
}

// ==================== NOTIFICATION MODEL ====================

model Notification {
  id        String           @id @default(uuid())
  type      NotificationType
  content   String
  isRead    Boolean          @default(false)
  
  // Polymorphic reference to related entity
  entityType String?        // e.g., "post", "comment", "follow"
  entityId   String?
  
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Actor who triggered the notification
  actorId   String?
  
  createdAt DateTime         @default(now())
  readAt    DateTime?
  
  @@index([userId])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  LIKE
  COMMENT
  FOLLOW
  MENTION
  MESSAGE
  SYSTEM
}
```

### Database Indexes Strategy

```sql
-- Performance-critical indexes
CREATE INDEX idx_posts_author_created ON posts(author_id, created_at DESC);
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at DESC);
CREATE INDEX idx_likes_user_created ON likes(user_id, created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);

-- Full-text search indexes (PostgreSQL)
CREATE INDEX idx_posts_content_fts ON posts USING gin(to_tsvector('english', content));
CREATE INDEX idx_users_username_fts ON users USING gin(to_tsvector('english', username));
```

---

## Service Modules

### 1. Authentication Service

```typescript
// modules/auth/auth.service.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '@/shared/utils/jwt';
import { AppError } from '@/shared/utils/errors';

const prisma = new PrismaClient();

export class AuthService {
  async register(data: RegisterDto) {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    });
    
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        createdAt: true
      }
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Save refresh token to database
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
    
    return { user, accessToken, refreshToken };
  }
  
  async login(email: string, password: string, userAgent?: string, ipAddress?: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check if account is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }
  
  async refreshTokens(refreshToken: string) {
    // Verify token
    const payload = verifyRefreshToken(refreshToken);
    
    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { refreshToken }
    });
    
    if (!session || session.expiresAt < new Date()) {
      throw new AppError('Invalid refresh token', 401);
    }
    
    // Generate new tokens
    const tokens = generateTokens(payload.userId);
    
    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    return tokens;
  }
  
  async logout(refreshToken: string) {
    await prisma.session.delete({
      where: { refreshToken }
    });
  }
  
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }
    
    // Generate reset token (valid for 1 hour)
    const resetToken = generateResetToken(user.id);
    
    // Send email (queue the job)
    await emailQueue.add('send-reset-password', {
      email: user.email,
      resetToken
    });
    
    return { message: 'If the email exists, a reset link has been sent' };
  }
  
  async resetPassword(token: string, newPassword: string) {
    const payload = verifyResetToken(token);
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword }
    });
    
    // Invalidate all sessions
    await prisma.session.deleteMany({
      where: { userId: payload.userId }
    });
    
    return { message: 'Password reset successful' };
  }
}
```

### 2. Post Service

```typescript
// modules/post/post.service.ts
import { PrismaClient } from '@prisma/client';
import { redisClient } from '@/config/redis';
import { AppError } from '@/shared/utils/errors';

const prisma = new PrismaClient();

export class PostService {
  async createPost(userId: string, data: CreatePostDto) {
    const post = await prisma.post.create({
      data: {
        content: data.content,
        mediaUrls: data.mediaUrls || [],
        mediaType: data.mediaType,
        visibility: data.visibility || 'PUBLIC',
        authorId: userId,
        publishedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });
    
    // Increment user's post count
    await prisma.user.update({
      where: { id: userId },
      data: { postsCount: { increment: 1 } }
    });
    
    // Invalidate cache
    await redisClient.del(`user:${userId}:posts`);
    
    return post;
  }
  
  async getPosts(userId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    // Check cache first
    const cacheKey = `posts:${userId || 'public'}:${page}:${limit}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const where = userId ? { authorId: userId } : {};
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);
    
    const result = {
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
    
    // Cache for 5 minutes
    await redisClient.setex(cacheKey, 300, JSON.stringify(result));
    
    return result;
  }
  
  async getPost(postId: string, userId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });
    
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    
    // Check if user has liked the post
    if (userId) {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });
      
      return { ...post, isLiked: !!like };
    }
    
    return post;
  }
  
  async updatePost(postId: string, userId: string, data: UpdatePostDto) {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    
    if (post.authorId !== userId) {
      throw new AppError('Unauthorized', 403);
    }
    
    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        content: data.content,
        mediaUrls: data.mediaUrls,
        visibility: data.visibility
      }
    });
    
    // Invalidate cache
    await redisClient.del(`post:${postId}`);
    
    return updated;
  }
  
  async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    
    if (post.authorId !== userId) {
      throw new AppError('Unauthorized', 403);
    }
    
    await prisma.post.delete({
      where: { id: postId }
    });
    
    // Decrement user's post count
    await prisma.user.update({
      where: { id: userId },
      data: { postsCount: { decrement: 1 } }
    });
    
    return { message: 'Post deleted successfully' };
  }
  
  async likePost(postId: string, userId: string) {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });
    
    if (existingLike) {
      throw new AppError('Post already liked', 400);
    }
    
    // Create like
    await prisma.like.create({
      data: {
        userId,
        postId
      }
    });
    
    // Increment like count
    await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } }
    });
    
    // Create notification for post author (if not self-like)
    if (post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          type: 'LIKE',
          content: 'liked your post',
          userId: post.authorId,
          actorId: userId,
          entityType: 'post',
          entityId: postId
        }
      });
    }
    
    return { message: 'Post liked successfully' };
  }
  
  async unlikePost(postId: string, userId: string) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });
    
    // Decrement like count
    await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { decrement: 1 } }
    });
    
    return { message: 'Post unliked successfully' };
  }
  
  async getFeed(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    // Get posts from followed users + own posts
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: userId },
          {
            author: {
              followers: {
                some: {
                  followerId: userId
                }
              }
            }
          }
        ],
        visibility: {
          in: ['PUBLIC', 'FOLLOWERS']
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    // Check which posts are liked by user
    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        const like = await prisma.like.findUnique({
          where: {
            userId_postId: {
              userId,
              postId: post.id
            }
          }
        });
        
        return { ...post, isLiked: !!like };
      })
    );
    
    return postsWithLikeStatus;
  }
}
```

### 3. Follow Service

```typescript
// modules/follow/follow.service.ts
export class FollowService {
  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new AppError('Cannot follow yourself', 400);
    }
    
    // Check if already following
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    
    if (existing) {
      throw new AppError('Already following this user', 400);
    }
    
    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId,
        followingId
      }
    });
    
    // Update counts
    await Promise.all([
      prisma.user.update({
        where: { id: followerId },
        data: { followingCount: { increment: 1 } }
      }),
      prisma.user.update({
        where: { id: followingId },
        data: { followersCount: { increment: 1 } }
      })
    ]);
    
    // Create notification
    await prisma.notification.create({
      data: {
        type: 'FOLLOW',
        content: 'started following you',
        userId: followingId,
        actorId: followerId
      }
    });
    
    return { message: 'Successfully followed user' };
  }
  
  async unfollowUser(followerId: string, followingId: string) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    
    // Update counts
    await Promise.all([
      prisma.user.update({
        where: { id: followerId },
        data: { followingCount: { decrement: 1 } }
      }),
      prisma.user.update({
        where: { id: followingId },
        data: { followersCount: { decrement: 1 } }
      })
    ]);
    
    return { message: 'Successfully unfollowed user' };
  }
  
  async getFollowers(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    return followers.map(f => f.follower);
  }
  
  async getFollowing(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    return following.map(f => f.following);
  }
}
```

---

## API Endpoints

### Authentication Endpoints

```typescript
// modules/auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@/shared/middleware/validation.middleware';
import { loginSchema, registerSchema } from './auth.validation';
import { rateLimiter } from '@/shared/middleware/rateLimiter.middleware';

const router = Router();
const authController = new AuthController();

// Public routes with rate limiting
router.post(
  '/register',
  rateLimiter({ max: 3, windowMs: 60 * 60 * 1000 }), // 3 per hour
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  rateLimiter({ max: 5, windowMs: 15 * 60 * 1000 }), // 5 per 15 min
  validate(loginSchema),
  authController.login
);

router.post('/refresh', authController.refreshTokens);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
```

### User Endpoints

```
GET    /api/v1/users/me                    # Get current user
PUT    /api/v1/users/me                    # Update current user
DELETE /api/v1/users/me                    # Delete account
GET    /api/v1/users/:id                   # Get user by ID
GET    /api/v1/users/:id/posts             # Get user's posts
GET    /api/v1/users/:id/followers         # Get user's followers
GET    /api/v1/users/:id/following         # Get user's following
GET    /api/v1/users/search                # Search users
```

### Post Endpoints

```
GET    /api/v1/posts                       # Get all posts (paginated)
POST   /api/v1/posts                       # Create post
GET    /api/v1/posts/feed                  # Get personalized feed
GET    /api/v1/posts/:id                   # Get post by ID
PUT    /api/v1/posts/:id                   # Update post
DELETE /api/v1/posts/:id                   # Delete post
POST   /api/v1/posts/:id/like              # Like post
DELETE /api/v1/posts/:id/like              # Unlike post
GET    /api/v1/posts/:id/likes             # Get post likes
```

### Comment Endpoints

```
GET    /api/v1/posts/:postId/comments      # Get post comments
POST   /api/v1/posts/:postId/comments      # Create comment
PUT    /api/v1/comments/:id                # Update comment
DELETE /api/v1/comments/:id                # Delete comment
POST   /api/v1/comments/:id/reply          # Reply to comment
```

### Follow Endpoints

```
POST   /api/v1/users/:id/follow            # Follow user
DELETE /api/v1/users/:id/follow            # Unfollow user
```

### Message Endpoints

```
GET    /api/v1/messages                    # Get conversations
GET    /api/v1/messages/:userId            # Get messages with user
POST   /api/v1/messages/:userId            # Send message
PUT    /api/v1/messages/:id/read           # Mark as read
DELETE /api/v1/messages/:id                # Delete message
```

### Notification Endpoints

```
GET    /api/v1/notifications               # Get notifications
PUT    /api/v1/notifications/:id/read      # Mark as read
PUT    /api/v1/notifications/read-all      # Mark all as read
DELETE /api/v1/notifications/:id           # Delete notification
```

---

## Authentication & Authorization

### JWT Implementation

```typescript
// shared/utils/jwt.ts
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
};
```

### Auth Middleware

```typescript
// shared/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/shared/utils/jwt';
import { AppError } from '@/shared/utils/errors';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }
    
    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    
    req.user = { id: payload.userId };
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });
    
    if (!user || !roles.includes(user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    
    next();
  };
};
```

---

## Middleware

### Rate Limiter

```typescript
// shared/middleware/rateLimiter.middleware.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '@/config/redis';

export const rateLimiter = (options?: {
  max?: number;
  windowMs?: number;
}) => {
  return rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rl:'
    }),
    max: options?.max || 100,
    windowMs: options?.windowMs || 60 * 1000,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false
  });
};
```

### Error Handler

```typescript
// shared/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/shared/utils/logger';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }
  
  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      status: 'error',
      message: 'Database error'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
  
  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
```

---

## File Upload & Processing

```typescript
// modules/media/media.service.ts
import multer from 'multer';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
    } else {
      cb(null, true);
    }
  }
});

export class MediaService {
  async uploadImage(file: Express.Multer.File, userId: string) {
    // Process image with sharp
    const processedImage = await sharp(file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    
    // Generate unique filename
    const filename = `${userId}/${uuidv4()}.webp`;
    
    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
      Body: processedImage,
      ContentType: 'image/webp',
      ACL: 'public-read'
    }));
    
    const url = `https://${process.env.STORAGE_BUCKET}.${process.env.STORAGE_ENDPOINT}/${filename}`;
    
    return { url };
  }
}
```

---

## Real-time Features

```typescript
// socket/socket.ts
import { Server } from 'socket.io';
import { verifyAccessToken } from '@/shared/utils/jwt';

export const initSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });
  
  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    
    // Join user's personal room
    socket.join(`user:${userId}`);
    
    // Handle messaging
    socket.on('send_message', async (data) => {
      const message = await createMessage(data);
      
      // Emit to receiver
      io.to(`user:${data.receiverId}`).emit('new_message', message);
    });
    
    // Handle typing indicator
    socket.on('typing', (data) => {
      io.to(`user:${data.receiverId}`).emit('user_typing', {
        userId,
        isTyping: true
      });
    });
    
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
  
  return io;
};
```

---

## Caching Strategy

```typescript
// config/redis.ts
import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect();

// Cache decorator
export const cache = (ttl: number = 300) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      
      // Check cache
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Call original method
      const result = await originalMethod.apply(this, args);
      
      // Store in cache
      await redisClient.setex(cacheKey, ttl, JSON.stringify(result));
      
      return result;
    };
    
    return descriptor;
  };
};
```

---

## Background Jobs

```typescript
// queue/jobs/email.job.ts
import Queue from 'bull';
import { sendEmail } from '@/shared/utils/email';

export const emailQueue = new Queue('email', {
  redis: process.env.REDIS_URL
});

emailQueue.process('send-welcome', async (job) => {
  const { email, name } = job.data;
  
  await sendEmail({
    to: email,
    subject: 'Welcome to SocialPlay!',
    template: 'welcome',
    data: { name }
  });
});

emailQueue.process('send-reset-password', async (job) => {
  const { email, resetToken } = job.data;
  
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    template: 'reset-password',
    data: { resetUrl }
  });
});
```

---

## Testing

```typescript
// modules/auth/tests/auth.service.test.ts
import { AuthService } from '../auth.service';
import { prismaMock } from '@/tests/utils/prisma-mock';

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
  });
  
  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };
      
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: '1',
        ...userData
      });
      
      const result = await authService.register(userData);
      
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });
});
```

---

**Next Document**: [AI Service Architecture](./03-AI-SERVICE-ARCHITECTURE.md)
