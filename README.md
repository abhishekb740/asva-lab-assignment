# AsvaLab Assignment - Multi-Tenant Project Management Tool

A full-stack multi-tenant project management application built with Node.js and React, featuring role-based access control, real-time caching, and event-driven architecture.

## Features

### Backend
- **REST API** with Node.js + Express
- **JWT Authentication** with admin/user roles
- **PostgreSQL** database with migrations
- **Redis Caching** for optimized performance (1-minute TTL)
- **Kafka Events** for event-driven architecture
- **Role-based Access Control**
- **Input Validation** with express-validator
- **Unit Tests**

### Frontend
- **React + TypeScript**
- **Role-based Route Guards**

### Multi-Tenancy
- **Admin Users**: Can view and manage all projects/tasks
- **Regular Users**: Can only manage their own projects/tasks

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd asva-lab-assignment
```

### 2. Environment Setup
Create `.env` file in the root directory:

**Option 1:** Simply copy the existing `.env.example` file:
```bash
cp .env.example .env
```

**Option 2:** Or create `.env` file manually with the following content:
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=asvalabassignment
POSTGRES_DB=AsvaLab
POSTGRES_HOST=localhost

VITE_API_URL=http://localhost:8000

SERVER_PORT=8000

JWT_SECRET=YOUR_SECRET_KEY
```

Either way, you'll be ready to run Docker Compose!

### 3. Start with Docker Compose
```bash
# Start all services (API, Database, Redis, Kafka, Frontend)
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Kafka**: http://localhost:8080

## Project Structure

```
asvalab-assignment/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/ # Request handlers
│   │   │   ├── middleware/  # Auth, validation, caching
│   │   │   └── routes/      # API endpoints
│   │   ├── config/          # Database, Redis, Kafka config
│   │   ├── models/          # Data models
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── migrations/          # Database migrations
│   ├── __tests__/           # Unit tests
│   └── Dockerfile
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── stores/          # State management
│   │   └── types/           # TypeScript definitions
│   └── Dockerfile
├── docker-compose.yml       # Multi-service setup
└── docs/                    # API documentation
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run migrate up    # Run database migrations
npm start            # Start development server
npm test             # Run unit tests
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests
```

### Database Migrations
```bash
cd backend
npm run migrate up       # Apply all migrations
npm run migrate down     # Rollback last migration
npm run migrate create <name>  # Create new migration
```

## Testing

### Run All Tests
```bash
# Backend tests
cd backend && npm test
```

## API Overview

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

### Project Management
- `GET /projects` - List projects (filtered by role)
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Task Management
- `GET /projects/:id/tasks` - List project tasks
- `POST /projects/:id/tasks` - Create task
- `PUT /projects/:id/tasks/:taskId` - Update task
- `DELETE /projects/:id/tasks/:taskId` - Delete task

** [Detailed API Documentation](docs/API.md)**

## Authentication & Authorization

### JWT Tokens
- **Expiration**: 24 hours
- **Claims**: userId, email, role
- **Header**: `Authorization: Bearer <token>`

### Role-based Access
- **Admin**: Full access to all projects and tasks
- **User**: Access only to own projects and tasks

## Caching Strategy

### Redis Implementation
- **Cache Key Pattern**: `projects:user:{userId}` or `projects:admin:all`
- **TTL**: 60 seconds (1 minute as per requirements)
- **Cache Invalidation**: Automatic on create/update/delete
- **Fallback**: Direct database query if Redis unavailable

## Event-Driven Architecture

### Kafka Events
- **User Registration**: `user.registered`
- **Project Operations**: `project.created`, `project.updated`, `project.deleted`
- **Task Operations**: `task.created`, `task.updated`, `task.deleted`

### Event Structure
```json
{
  "eventType": "project.created",
  "eventId": "project.created-1234567890-abc123",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "data": {
    "id": 1,
    "name": "New Project",
    "userId": 123
  }
}
