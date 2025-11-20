# API Documentation - SocialPlay

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Auth Endpoints](#auth-endpoints)
6. [User Endpoints](#user-endpoints)
7. [Post Endpoints](#post-endpoints)
8. [Comment Endpoints](#comment-endpoints)
9. [Like Endpoints](#like-endpoints)
10. [Follow Endpoints](#follow-endpoints)
11. [Message Endpoints](#message-endpoints)
12. [Notification Endpoints](#notification-endpoints)
13. [Media Endpoints](#media-endpoints)
14. [AI Endpoints](#ai-endpoints)
15. [WebSocket Events](#websocket-events)

---

## Overview

**Base URL**: `https://api.socialplay.com/api/v1`  
**Development**: `http://localhost:8000/api/v1`

### Response Format

All responses follow this structure:

```json
{
  "status": "success",
  "data": { /* response data */ },
  "message": "Optional message",
  "pagination": { /* if paginated */ }
}
```

Error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [ /* validation errors if any */ ]
}
```

---

## Authentication

### JWT Token

Include JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiry

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

### Refreshing Tokens

When access token expires (401 response), use refresh token to get new tokens.

---

## Rate Limiting

### Limits

| User Type | Per Minute | Per Hour |
|-----------|-----------|----------|
| Anonymous | 20 | 1,000 |
| Authenticated | 100 | 10,000 |
| Premium | 500 | 50,000 |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1637589600
```

### 429 Response

```json
{
  "status": "error",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Validation Errors

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

## Auth Endpoints

### Register

Create a new user account.

**Endpoint**: `POST /auth/register`  
**Authentication**: Not required

#### Request Body

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Validation Rules

- `email`: Valid email, unique
- `username`: 3-30 characters, alphanumeric + underscore, unique
- `password`: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
- `firstName`: 1-50 characters
- `lastName`: 1-50 characters

#### Response (201)

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": null,
      "createdAt": "2024-11-20T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### cURL Example

```bash
curl -X POST https://api.socialplay.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

### Login

Authenticate user and receive JWT tokens.

**Endpoint**: `POST /auth/login`  
**Authentication**: Not required

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://cdn.socialplay.com/avatars/johndoe.jpg",
      "role": "USER",
      "lastLoginAt": "2024-11-20T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### cURL Example

```bash
curl -X POST https://api.socialplay.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Refresh Token

Get new access token using refresh token.

**Endpoint**: `POST /auth/refresh`  
**Authentication**: Not required

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Logout

Invalidate refresh token.

**Endpoint**: `POST /auth/logout`  
**Authentication**: Required

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200)

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### Forgot Password

Request password reset link.

**Endpoint**: `POST /auth/forgot-password`  
**Authentication**: Not required

#### Request Body

```json
{
  "email": "user@example.com"
}
```

#### Response (200)

```json
{
  "status": "success",
  "message": "If the email exists, a reset link has been sent"
}
```

---

### Reset Password

Reset password with token.

**Endpoint**: `POST /auth/reset-password`  
**Authentication**: Not required

#### Request Body

```json
{
  "token": "reset-token-here",
  "password": "NewSecurePass123!"
}
```

#### Response (200)

```json
{
  "status": "success",
  "message": "Password reset successful"
}
```

---

## User Endpoints

### Get Current User

Get authenticated user's profile.

**Endpoint**: `GET /users/me`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Software developer and coffee enthusiast",
    "avatar": "https://cdn.socialplay.com/avatars/johndoe.jpg",
    "coverImage": "https://cdn.socialplay.com/covers/johndoe.jpg",
    "followersCount": 1250,
    "followingCount": 340,
    "postsCount": 89,
    "isVerified": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

#### cURL Example

```bash
curl -X GET https://api.socialplay.com/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Update Profile

Update authenticated user's profile.

**Endpoint**: `PUT /users/me`  
**Authentication**: Required

#### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "dateOfBirth": "1990-01-15",
  "phone": "+1234567890"
}
```

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Updated bio",
    "updatedAt": "2024-11-20T10:00:00.000Z"
  }
}
```

---

### Get User by ID

Get user profile by ID.

**Endpoint**: `GET /users/:userId`  
**Authentication**: Optional (some data hidden if not authenticated)

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "uuid-here",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Software developer",
    "avatar": "https://cdn.socialplay.com/avatars/johndoe.jpg",
    "followersCount": 1250,
    "followingCount": 340,
    "postsCount": 89,
    "isFollowing": false,
    "isFollowedBy": false
  }
}
```

---

### Search Users

Search users by username or name.

**Endpoint**: `GET /users/search?q=john&page=1&limit=20`  
**Authentication**: Optional

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| q | string | required | Search query |
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page (max 50) |

#### Response (200)

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-1",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://cdn.socialplay.com/avatars/johndoe.jpg",
      "bio": "Software developer",
      "followersCount": 1250
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

## Post Endpoints

### Create Post

Create a new post.

**Endpoint**: `POST /posts`  
**Authentication**: Required

#### Request Body

```json
{
  "content": "Just had the best coffee! ☕ #coffee #morning",
  "mediaUrls": [
    "https://cdn.socialplay.com/posts/image1.jpg",
    "https://cdn.socialplay.com/posts/image2.jpg"
  ],
  "mediaType": "IMAGE",
  "visibility": "PUBLIC"
}
```

#### Fields

- `content`: Post text (max 5000 characters)
- `mediaUrls`: Array of uploaded media URLs (max 10)
- `mediaType`: IMAGE, VIDEO, or DOCUMENT
- `visibility`: PUBLIC, FOLLOWERS, or PRIVATE

#### Response (201)

```json
{
  "status": "success",
  "data": {
    "id": "post-uuid",
    "content": "Just had the best coffee! ☕ #coffee #morning",
    "mediaUrls": ["https://cdn.socialplay.com/posts/image1.jpg"],
    "mediaType": "IMAGE",
    "visibility": "PUBLIC",
    "likesCount": 0,
    "commentsCount": 0,
    "sharesCount": 0,
    "author": {
      "id": "user-uuid",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://cdn.socialplay.com/avatars/johndoe.jpg"
    },
    "createdAt": "2024-11-20T10:00:00.000Z",
    "updatedAt": "2024-11-20T10:00:00.000Z"
  }
}
```

#### cURL Example

```bash
curl -X POST https://api.socialplay.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Just had the best coffee! ☕",
    "visibility": "PUBLIC"
  }'
```

---

### Get Posts (Feed)

Get paginated list of posts.

**Endpoint**: `GET /posts?page=1&limit=10`  
**Authentication**: Optional

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Posts per page (max 50) |
| userId | string | - | Filter by user ID |

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "posts": [
      {
        "id": "post-uuid",
        "content": "Amazing sunset today! 🌅",
        "mediaUrls": ["https://cdn.socialplay.com/posts/sunset.jpg"],
        "mediaType": "IMAGE",
        "likesCount": 42,
        "commentsCount": 8,
        "isLiked": false,
        "author": {
          "id": "user-uuid",
          "username": "janedoe",
          "avatar": "https://cdn.socialplay.com/avatars/janedoe.jpg"
        },
        "createdAt": "2024-11-20T09:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1250,
      "page": 1,
      "limit": 10,
      "pages": 125
    }
  }
}
```

---

### Get Personalized Feed

Get AI-recommended personalized feed.

**Endpoint**: `GET /posts/feed?page=1&limit=20`  
**Authentication**: Required

#### Response (200)

Same structure as Get Posts, but posts are ranked by AI recommendation algorithm.

---

### Get Post by ID

Get single post details.

**Endpoint**: `GET /posts/:postId`  
**Authentication**: Optional

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "post-uuid",
    "content": "Amazing sunset today! 🌅",
    "mediaUrls": ["https://cdn.socialplay.com/posts/sunset.jpg"],
    "mediaType": "IMAGE",
    "likesCount": 42,
    "commentsCount": 8,
    "sharesCount": 3,
    "isLiked": false,
    "author": {
      "id": "user-uuid",
      "username": "janedoe",
      "firstName": "Jane",
      "lastName": "Doe",
      "avatar": "https://cdn.socialplay.com/avatars/janedoe.jpg"
    },
    "comments": [
      {
        "id": "comment-uuid",
        "content": "Beautiful!",
        "author": {
          "id": "commenter-uuid",
          "username": "commenter",
          "avatar": "https://cdn.socialplay.com/avatars/commenter.jpg"
        },
        "createdAt": "2024-11-20T09:35:00.000Z"
      }
    ],
    "createdAt": "2024-11-20T09:30:00.000Z",
    "updatedAt": "2024-11-20T09:30:00.000Z"
  }
}
```

---

### Update Post

Update existing post.

**Endpoint**: `PUT /posts/:postId`  
**Authentication**: Required (must be post author)

#### Request Body

```json
{
  "content": "Updated content",
  "visibility": "FOLLOWERS"
}
```

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "post-uuid",
    "content": "Updated content",
    "visibility": "FOLLOWERS",
    "updatedAt": "2024-11-20T10:15:00.000Z"
  }
}
```

---

### Delete Post

Delete a post.

**Endpoint**: `DELETE /posts/:postId`  
**Authentication**: Required (must be post author)

#### Response (200)

```json
{
  "status": "success",
  "message": "Post deleted successfully"
}
```

---

### Like Post

Like a post.

**Endpoint**: `POST /posts/:postId/like`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "message": "Post liked successfully",
  "data": {
    "likesCount": 43
  }
}
```

---

### Unlike Post

Remove like from post.

**Endpoint**: `DELETE /posts/:postId/like`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "message": "Post unliked successfully",
  "data": {
    "likesCount": 42
  }
}
```

---

### Get Post Likes

Get list of users who liked a post.

**Endpoint**: `GET /posts/:postId/likes?page=1&limit=20`  
**Authentication**: Optional

#### Response (200)

```json
{
  "status": "success",
  "data": [
    {
      "id": "user-uuid",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://cdn.socialplay.com/avatars/johndoe.jpg",
      "likedAt": "2024-11-20T09:32:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

## Comment Endpoints

### Get Comments

Get comments for a post.

**Endpoint**: `GET /posts/:postId/comments?page=1&limit=20`  
**Authentication**: Optional

#### Response (200)

```json
{
  "status": "success",
  "data": [
    {
      "id": "comment-uuid",
      "content": "Great post!",
      "author": {
        "id": "user-uuid",
        "username": "commenter",
        "avatar": "https://cdn.socialplay.com/avatars/commenter.jpg"
      },
      "repliesCount": 2,
      "createdAt": "2024-11-20T09:35:00.000Z"
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

### Create Comment

Add comment to post.

**Endpoint**: `POST /posts/:postId/comments`  
**Authentication**: Required

#### Request Body

```json
{
  "content": "Great post! Love it!"
}
```

#### Response (201)

```json
{
  "status": "success",
  "data": {
    "id": "comment-uuid",
    "content": "Great post! Love it!",
    "postId": "post-uuid",
    "author": {
      "id": "user-uuid",
      "username": "johndoe",
      "avatar": "https://cdn.socialplay.com/avatars/johndoe.jpg"
    },
    "createdAt": "2024-11-20T10:00:00.000Z"
  }
}
```

---

### Reply to Comment

Reply to an existing comment.

**Endpoint**: `POST /comments/:commentId/reply`  
**Authentication**: Required

#### Request Body

```json
{
  "content": "Thanks for your comment!"
}
```

#### Response (201)

```json
{
  "status": "success",
  "data": {
    "id": "reply-uuid",
    "content": "Thanks for your comment!",
    "parentId": "comment-uuid",
    "author": {
      "id": "user-uuid",
      "username": "johndoe"
    },
    "createdAt": "2024-11-20T10:05:00.000Z"
  }
}
```

---

### Update Comment

Edit a comment.

**Endpoint**: `PUT /comments/:commentId`  
**Authentication**: Required (must be comment author)

#### Request Body

```json
{
  "content": "Updated comment text"
}
```

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "comment-uuid",
    "content": "Updated comment text",
    "updatedAt": "2024-11-20T10:10:00.000Z"
  }
}
```

---

### Delete Comment

Delete a comment.

**Endpoint**: `DELETE /comments/:commentId`  
**Authentication**: Required (must be comment author or post author)

#### Response (200)

```json
{
  "status": "success",
  "message": "Comment deleted successfully"
}
```

---

## Follow Endpoints

### Follow User

Follow a user.

**Endpoint**: `POST /users/:userId/follow`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "message": "Successfully followed user",
  "data": {
    "followersCount": 1251
  }
}
```

---

### Unfollow User

Unfollow a user.

**Endpoint**: `DELETE /users/:userId/follow`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "message": "Successfully unfollowed user",
  "data": {
    "followersCount": 1250
  }
}
```

---

### Get Followers

Get user's followers.

**Endpoint**: `GET /users/:userId/followers?page=1&limit=20`  
**Authentication**: Optional

#### Response (200)

```json
{
  "status": "success",
  "data": [
    {
      "id": "follower-uuid",
      "username": "follower1",
      "firstName": "Alice",
      "lastName": "Smith",
      "avatar": "https://cdn.socialplay.com/avatars/follower1.jpg",
      "bio": "Tech enthusiast",
      "followedAt": "2024-11-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "pages": 63
  }
}
```

---

### Get Following

Get users that this user follows.

**Endpoint**: `GET /users/:userId/following?page=1&limit=20`  
**Authentication**: Optional

#### Response (200)

Same structure as Get Followers.

---

## Message Endpoints

### Get Conversations

Get list of message conversations.

**Endpoint**: `GET /messages?page=1&limit=20`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "data": [
    {
      "user": {
        "id": "user-uuid",
        "username": "janedoe",
        "avatar": "https://cdn.socialplay.com/avatars/janedoe.jpg"
      },
      "lastMessage": {
        "id": "message-uuid",
        "content": "Hey, how are you?",
        "isRead": false,
        "createdAt": "2024-11-20T09:45:00.000Z"
      },
      "unreadCount": 3
    }
  ]
}
```

---

### Get Messages with User

Get message thread with specific user.

**Endpoint**: `GET /messages/:userId?page=1&limit=50`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "data": [
    {
      "id": "message-uuid",
      "content": "Hey, how are you?",
      "mediaUrl": null,
      "isRead": true,
      "sender": {
        "id": "sender-uuid",
        "username": "janedoe"
      },
      "receiver": {
        "id": "receiver-uuid",
        "username": "johndoe"
      },
      "createdAt": "2024-11-20T09:45:00.000Z",
      "readAt": "2024-11-20T09:46:00.000Z"
    }
  ],
  "pagination": {
    "total": 127,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

---

### Send Message

Send a message to user.

**Endpoint**: `POST /messages/:userId`  
**Authentication**: Required

#### Request Body

```json
{
  "content": "Hello! How are you?",
  "mediaUrl": "https://cdn.socialplay.com/messages/image.jpg"
}
```

#### Response (201)

```json
{
  "status": "success",
  "data": {
    "id": "message-uuid",
    "content": "Hello! How are you?",
    "mediaUrl": "https://cdn.socialplay.com/messages/image.jpg",
    "isRead": false,
    "sender": {
      "id": "user-uuid",
      "username": "johndoe"
    },
    "receiver": {
      "id": "receiver-uuid",
      "username": "janedoe"
    },
    "createdAt": "2024-11-20T10:00:00.000Z"
  }
}
```

---

### Mark Message as Read

Mark a message as read.

**Endpoint**: `PUT /messages/:messageId/read`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "message": "Message marked as read"
}
```

---

### Delete Message

Delete a message.

**Endpoint**: `DELETE /messages/:messageId`  
**Authentication**: Required (must be sender)

#### Response (200)

```json
{
  "status": "success",
  "message": "Message deleted successfully"
}
```

---

## Notification Endpoints

### Get Notifications

Get user's notifications.

**Endpoint**: `GET /notifications?page=1&limit=20&unreadOnly=false`  
**Authentication**: Required

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Notifications per page |
| unreadOnly | boolean | false | Show only unread |

#### Response (200)

```json
{
  "status": "success",
  "data": [
    {
      "id": "notification-uuid",
      "type": "LIKE",
      "content": "liked your post",
      "isRead": false,
      "actor": {
        "id": "actor-uuid",
        "username": "janedoe",
        "avatar": "https://cdn.socialplay.com/avatars/janedoe.jpg"
      },
      "entityType": "post",
      "entityId": "post-uuid",
      "createdAt": "2024-11-20T09:32:00.000Z"
    },
    {
      "id": "notification-uuid-2",
      "type": "FOLLOW",
      "content": "started following you",
      "isRead": true,
      "actor": {
        "id": "actor-uuid-2",
        "username": "johndoe",
        "avatar": "https://cdn.socialplay.com/avatars/johndoe.jpg"
      },
      "createdAt": "2024-11-19T15:20:00.000Z",
      "readAt": "2024-11-19T16:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  },
  "unreadCount": 12
}
```

---

### Mark Notification as Read

Mark single notification as read.

**Endpoint**: `PUT /notifications/:notificationId/read`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "message": "Notification marked as read"
}
```

---

### Mark All as Read

Mark all notifications as read.

**Endpoint**: `PUT /notifications/read-all`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "message": "All notifications marked as read"
}
```

---

### Delete Notification

Delete a notification.

**Endpoint**: `DELETE /notifications/:notificationId`  
**Authentication**: Required

#### Response (200)

```json
{
  "status": "success",
  "message": "Notification deleted successfully"
}
```

---

## Media Endpoints

### Upload Image

Upload an image.

**Endpoint**: `POST /media/upload/image`  
**Authentication**: Required  
**Content-Type**: `multipart/form-data`

#### Request

```bash
curl -X POST https://api.socialplay.com/api/v1/media/upload/image \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

#### Response (200)

```json
{
  "status": "success",
  "data": {
    "url": "https://cdn.socialplay.com/uploads/uuid-filename.jpg",
    "size": 245678,
    "type": "image/jpeg",
    "width": 1920,
    "height": 1080
  }
}
```

#### Limits

- Max file size: 10MB
- Allowed formats: JPEG, PNG, GIF, WebP
- Images are automatically optimized and converted to WebP

---

### Upload Video

Upload a video.

**Endpoint**: `POST /media/upload/video`  
**Authentication**: Required  
**Content-Type**: `multipart/form-data`

#### Limits

- Max file size: 100MB
- Allowed formats: MP4, MOV, AVI, WebM
- Max duration: 5 minutes

---

## AI Endpoints

### Get Content Recommendations

Get AI-powered content recommendations (Internal API).

**Endpoint**: `POST /ai/recommendations/feed`  
**Authentication**: API Key (internal only)

#### Request Body

```json
{
  "user_id": "uuid-here",
  "candidate_post_ids": ["post-1", "post-2", "post-3"],
  "limit": 20
}
```

#### Response (200)

```json
{
  "posts": [
    {
      "post_id": "post-1",
      "score": 0.95
    },
    {
      "post_id": "post-3",
      "score": 0.87
    }
  ]
}
```

---

### Moderate Content

Check if content is safe (Internal API).

**Endpoint**: `POST /ai/moderation/moderate`  
**Authentication**: API Key (internal only)

#### Request Body

```json
{
  "content": "Text to moderate",
  "images": ["https://cdn.socialplay.com/image.jpg"]
}
```

#### Response (200)

```json
{
  "is_safe": true,
  "text_moderation": {
    "overall_toxic": 0.12,
    "toxic": 0.10,
    "severe_toxic": 0.02
  },
  "image_moderation": [
    {
      "is_safe": true,
      "safe": 0.95,
      "questionable": 0.03,
      "unsafe": 0.02
    }
  ],
  "action": "approve"
}
```

---

### Analyze Sentiment

Analyze sentiment of text (Internal API).

**Endpoint**: `POST /ai/sentiment/analyze`  
**Authentication**: API Key (internal only)

#### Request Body

```json
{
  "text": "I absolutely love this product! Best purchase ever!"
}
```

#### Response (200)

```json
{
  "sentiment": "positive",
  "positive_score": 0.98,
  "negative_score": 0.02,
  "confidence": 0.98
}
```

---

## WebSocket Events

### Connection

Connect to WebSocket server:

```javascript
const socket = io('wss://api.socialplay.com', {
  auth: {
    token: 'YOUR_ACCESS_TOKEN'
  }
});
```

### Events

#### new_message

Receive new message.

```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data);
  // {
  //   id: 'message-uuid',
  //   content: 'Hello!',
  //   sender: { id: '...', username: '...' },
  //   createdAt: '2024-11-20T10:00:00.000Z'
  // }
});
```

#### new_notification

Receive new notification.

```javascript
socket.on('new_notification', (data) => {
  console.log('New notification:', data);
  // {
  //   id: 'notification-uuid',
  //   type: 'LIKE',
  //   content: 'liked your post',
  //   actor: { ... },
  //   createdAt: '2024-11-20T10:00:00.000Z'
  // }
});
```

#### user_typing

User is typing in chat.

```javascript
socket.on('user_typing', (data) => {
  console.log('User typing:', data);
  // { userId: 'uuid', isTyping: true }
});
```

### Emit Events

#### send_message

Send a message via WebSocket.

```javascript
socket.emit('send_message', {
  receiverId: 'user-uuid',
  content: 'Hello!'
});
```

#### typing

Indicate typing status.

```javascript
socket.emit('typing', {
  receiverId: 'user-uuid',
  isTyping: true
});
```

---

## Pagination

All list endpoints support pagination with these parameters:

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| page | integer | 1 | - | Page number |
| limit | integer | 20 | 50 | Items per page |

Response includes pagination metadata:

```json
{
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "pages": 63
  }
}
```

---

## Testing with Postman

Import this Postman collection: [SocialPlay API Collection](./postman_collection.json)

Or use this quick test:

```bash
# Set variables
export API_URL="http://localhost:8000/api/v1"
export TOKEN="your-access-token"

# Register
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get current user
curl -X GET $API_URL/users/me \
  -H "Authorization: Bearer $TOKEN"

# Create post
curl -X POST $API_URL/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"My first post!","visibility":"PUBLIC"}'
```

---

**API Version**: 1.0  
**Last Updated**: November 20, 2025  
**Support**: api@socialplay.com
