# API Documentation

## Overview

This document provides detailed information about the AsvaLab Project Management API endpoints, request/response formats, and authentication requirements.

**Base URL**: `http://localhost:8000`

## Authentication

All API endpoints except registration and login require JWT authentication.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Token Format
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "user",
  "iat": 1640995200,
  "exp": 1641081600,
  "iss": "project-management-api"
}
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `password`: Min 8 chars, max 128 chars, must contain uppercase, lowercase, and number
- `role`: Either "user" or "admin", defaults to "user"

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    "created_at": "2024-01-20T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// 400 - Validation Failed
{
  "error": "Validation failed",
  "details": [
    {
      "msg": "Email must include @ and domain extension (e.g., user@gmail.com)",
      "param": "email"
    }
  ]
}

// 409 - User Exists
{
  "error": "User already exists with this email"
}
```

### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

## Project Management

### GET /projects
Retrieve projects based on user role.

**Authorization:** Required  
**Role-based Filtering:**
- **Admin**: Returns all projects
- **User**: Returns only user's own projects

**Query Parameters:**
- None (filtering done by role automatically)

**Response (200):**
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "user_id": 1,
      "created_at": "2024-01-20T10:30:00.000Z",
      "updated_at": "2024-01-20T10:30:00.000Z"
    }
  ],
  "count": 1,
  "cached": false
}
```

**Headers:**
- `X-Cache-Status`: "HIT" or "MISS" (when Redis caching is active)

### GET /projects/:id
Get a specific project by ID.

**Authorization:** Required  
**Access Control:** Owner or Admin only

**Response (200):**
```json
{
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "user_id": 1,
    "created_at": "2024-01-20T10:30:00.000Z",
    "updated_at": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// 404 - Not Found
{
  "error": "Project not found"
}

// 403 - Access Denied
{
  "error": "Access denied"
}
```

### POST /projects
Create a new project.

**Authorization:** Required  
**Roles:** user, admin

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description (optional)"
}
```

**Validation Rules:**
- `name`: Required, 1-255 characters
- `description`: Optional, max 1000 characters

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 2,
    "name": "New Project",
    "description": "Project description",
    "user_id": 1,
    "created_at": "2024-01-20T11:00:00.000Z",
    "updated_at": "2024-01-20T11:00:00.000Z"
  }
}
```

**Events Triggered:**
- Kafka: `project.created`
- Cache: Invalidated for user

### PUT /projects/:id
Update an existing project.

**Authorization:** Required  
**Access Control:** Owner or Admin only

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": 1,
    "name": "Updated Project Name",
    "description": "Updated description",
    "user_id": 1,
    "created_at": "2024-01-20T10:30:00.000Z",
    "updated_at": "2024-01-20T11:15:00.000Z"
  }
}
```

**Events Triggered:**
- Kafka: `project.updated`
- Cache: Invalidated for user

### DELETE /projects/:id
Delete a project and all its tasks.

**Authorization:** Required  
**Access Control:** Owner or Admin only

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

**Events Triggered:**
- Kafka: `project.deleted`
- Cache: Invalidated for user

## Task Management

### GET /projects/:projectId/tasks
Get all tasks for a specific project.

**Authorization:** Required  
**Access Control:** Project owner or Admin only

**Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design mockups",
      "description": "Create initial design mockups",
      "status": "todo",
      "project_id": 1,
      "created_at": "2024-01-20T10:45:00.000Z",
      "updated_at": "2024-01-20T10:45:00.000Z"
    },
    {
      "id": 2,
      "title": "Setup development environment",
      "description": null,
      "status": "in_progress",
      "project_id": 1,
      "created_at": "2024-01-20T11:00:00.000Z",
      "updated_at": "2024-01-20T11:30:00.000Z"
    }
  ],
  "count": 2
}
```

### POST /projects/:projectId/tasks
Create a new task in a project.

**Authorization:** Required  
**Access Control:** Project owner or Admin only

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "status": "todo"
}
```

**Validation Rules:**
- `title`: Required, 1-255 characters
- `description`: Optional, max 1000 characters
- `status`: Optional, one of: "todo", "in_progress", "completed" (defaults to "todo")

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 3,
    "title": "New Task",
    "description": "Task description",
    "status": "todo",
    "project_id": 1,
    "created_at": "2024-01-20T12:00:00.000Z",
    "updated_at": "2024-01-20T12:00:00.000Z"
  }
}
```

**Events Triggered:**
- Kafka: `task.created`

### PUT /projects/:projectId/tasks/:id
Update an existing task.

**Authorization:** Required  
**Access Control:** Project owner or Admin only

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "completed"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "completed",
    "project_id": 1,
    "created_at": "2024-01-20T10:45:00.000Z",
    "updated_at": "2024-01-20T12:15:00.000Z"
  }
}
```

**Events Triggered:**
- Kafka: `task.updated`

### DELETE /projects/:projectId/tasks/:id
Delete a specific task.

**Authorization:** Required  
**Access Control:** Project owner or Admin only

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Events Triggered:**
- Kafka: `task.deleted`

## Health & Monitoring

### GET /health
Check API health status.

**Authorization:** Not required

**Response (200):**
```json
{
  "status": "OK",
  "message": "AsvaLabs Assignment API is running",
  "timestamp": "2024-01-20T12:30:00.000Z"
}
```

### GET /
API root endpoint.

**Response (200):**
```json
{
  "message": "Welcome to AsvaLabs Assignment API",
  "version": "1.0.0"
}
```

## Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": ["Optional array of details"]
}
```

### Common Error Codes
- `NO_TOKEN` - Authorization header missing
- `INVALID_TOKEN` - JWT token invalid or expired
- `NOT_AUTHENTICATED` - User not authenticated
- `INSUFFICIENT_PERMISSIONS` - User lacks required role
- `VALIDATION_FAILED` - Request validation failed

## Caching

### Redis Caching
- **Endpoint:** `GET /projects`
- **Cache Key Pattern:** 
  - Admin: `projects:admin:all`
  - User: `projects:user:{userId}`
- **TTL:** 60 seconds
- **Invalidation:** Automatic on CUD operations

### Cache Headers
```
X-Cache-Status: HIT|MISS
Cache-Control: max-age=60
```

## Event Streaming

### Kafka Topics
- `user-events` - User registration events
- `project-events` - Project CRUD events  
- `task-events` - Task CRUD events

### Event Schema
```json
{
  "eventType": "project.created",
  "eventId": "project.created-1640995200000-abc123",
  "timestamp": "2024-01-20T12:30:00.000Z",
  "data": {
    "id": 1,
    "name": "Project Name",
    "userId": 123
  }
}
```

### cURL Examples

**Register User:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "role": "user"
  }'
```

**Get Projects:**
```bash
curl -X GET http://localhost:8000/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Project:**
```bash
curl -X POST http://localhost:8000/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Project",
    "description": "Project description"
  }'
```
