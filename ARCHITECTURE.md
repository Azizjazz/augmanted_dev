# TaskBoard Pro 3.0 - Microservices Architecture

## Overview
Full microservices architecture. Both backend and frontend are composed of independent, deployable services with fault isolation.

## Architecture Diagram

```mermaid
graph TB
    subgraph FRONTEND["🎨 Frontend Microservices"]
        subgraph FE_SERVICES["Frontend Services"]
            AUTH_UI["Auth UI Service<br/>/login, /register"]
            BOARD_UI["Board UI Service<br/>/board"]
            DASHBOARD_UI["Dashboard UI Service<br/>/dashboard"]
        end
        
        subgraph FE_SHARED["Shared Services"]
            AUTH_CTX["AuthContext<br/>(Auth State)"]
            TASK_CTX["TaskContext<br/>(Task State)"]
            AUTH_SVC["authService.ts"]
            TASK_SVC["taskService.ts"]
            ANALYTICS_SVC["analyticsService.ts"]
        end
    end
    
    subgraph GATEWAY["🚪 API Gateway (8000)"]
        GW["Gateway Service"]
    end
    
    subgraph BACKEND["⚙️ Backend Microservices"]
        subgraph BACKEND_SERVICES["Backend Services"]
            AUTH_SVC_B["Auth Service (8001)<br/>auth.db"]
            TASK_SVC_B["Task Service (8003)<br/>task.db"]
            ANALYTICS_SVC_B["Analytics Service (8004)<br/>analytics.db"]
        end
    end
    
    AUTH_UI --> AUTH_CTX
    BOARD_UI --> TASK_CTX
    DASHBOARD_UI --> TASK_CTX
    AUTH_CTX --> AUTH_SVC
    TASK_CTX --> TASK_SVC
    TASK_CTX --> ANALYTICS_SVC
    
    AUTH_SVC --> GW
    TASK_SVC --> GW
    ANALYTICS_SVC --> GW
    
    GW --> AUTH_SVC_B
    GW --> TASK_SVC_B
    GW --> ANALYTICS_SVC_B
```

## Backend Microservices

### 1. API Gateway (Port 8000)
**Responsibility**: Single entry point, routes requests
- All frontend requests go through here
- Forwards to appropriate backend service

### 2. Auth Service (Port 8001)
**Database**: `auth.db`
**Responsibility**: Authentication, JWT
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /auth/verify`

### 3. Task Service (Port 8003)
**Database**: `task.db`
**Responsibility**: Task CRUD
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}`
- `PATCH /tasks/{id}/move`

### 4. Analytics Service (Port 8004)
**Database**: `analytics.db`
**Responsibility**: Statistics
- `GET /analytics/stats`
- `GET /analytics/heatmap`
- `GET /analytics/distribution`

## Frontend Microservices

### UI Services (Pages)
| Service | Route | Responsibility |
|---------|-------|----------------|
| Auth UI | `/login`, `/register` | Login/registration forms |
| Board UI | `/board` | Kanban board view |
| Dashboard UI | `/dashboard` | Analytics dashboard |

### Shared Services
| Service | Responsibility |
|---------|----------------|
| `authService.ts` | Auth API calls |
| `taskService.ts` | Task API calls |
| `analyticsService.ts` | Analytics API calls |
| `AuthContext` | Auth state management |
| `TaskContext` | Task state management |

## Fault Isolation

| Service Down | Frontend Impact | Backend Impact |
|-------------|-----------------|----------------|
| Gateway | Full outage | - |
| Auth Service | Can't login | - |
| Task Service | Board broken | - |
| Analytics Service | Dashboard shows error | - |

## Database Isolation

| Service | Database | Contains |
|---------|----------|----------|
| Auth | `auth.db` | Users, passwords |
| Task | `task.db` | Tasks only |
| Analytics | `analytics.db` | Stats cache |

## Ports

| Service | Port |
|---------|------|
| Gateway | 8000 |
| Auth | 8001 |
| Task | 8003 |
| Analytics | 8004 |
| Frontend | 3000 |

## Project Structure

```
taskboard-3.0/
├── gateway/                    # API Gateway
├── services/
│   ├── auth-service/          # Auth microservice
│   ├── task-service/         # Task microservice
│   └── analytics-service/    # Analytics microservice
└── frontend/                  # Frontend microservices
    ├── app/
    │   ├── login/
    │   ├── register/
    │   ├── board/
    │   └── dashboard/
    ├── services/             # API client services
    ├── context/              # State services
    └── components/           # Shared UI components
```

## Version
3.0.0 (Full Microservices)
