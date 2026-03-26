# TaskBoard Pro 3.0

A high-performance Kanban board with **full microservices architecture**.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │Auth UI │  │Board UI │  │Dashboard UI     │ │
│  └────┬────┘  └────┬────┘  └────────┬────────┘ │
│       └────────────┼────────────────┘          │
│                    ▼                           │
│  ┌─────────────────────────────────────────┐  │
│  │  Services: authService, taskService,    │  │
│  │  analyticsService + State Management    │  │
│  └────────────────────┬────────────────────┘  │
└───────────────────────┼───────────────────────┘
                        │ HTTP
                        ▼
┌─────────────────────────────────────────────────┐
│              API GATEWAY (8000)                  │
└──────┬──────────────┬───────────────┬───────────┘
       │              │               │
       ▼              ▼               ▼
┌──────────┐  ┌───────────┐  ┌────────────────┐
│   Auth   │  │   Task    │  │   Analytics    │
│  (8001) │  │  (8003)   │  │    (8004)     │
│ auth.db │  │ task.db   │  │ analytics.db  │
└─────────┘  └───────────┘  └────────────────┘
```

## Services

| Layer | Service | Port | Database |
|-------|---------|------|----------|
| Frontend | Auth UI | 3000 | - |
| Frontend | Board UI | 3000 | - |
| Frontend | Dashboard UI | 3000 | - |
| Backend | Gateway | 8000 | - |
| Backend | Auth | 8001 | auth.db |
| Backend | Task | 8003 | task.db |
| Backend | Analytics | 8004 | analytics.db |

## Quick Start

### 1. Start Backend (4 terminals)

```cmd
:: Terminal 1
cd services\auth-service && python -m uvicorn main:app --port 8001

:: Terminal 2
cd services\task-service && python -m uvicorn main:app --port 8003

:: Terminal 3
cd services\analytics-service && python -m uvicorn main:app --port 8004

:: Terminal 4
cd gateway && python -m uvicorn main:app --port 8000
```

### 2. Start Frontend

```cmd
cd frontend
npm install
npm run dev
```

### 3. Open
**http://localhost:3000**

## Fault Isolation

| If This Fails | Impact |
|---------------|--------|
| Gateway | Everything down |
| Auth Service | Can't login |
| Task Service | Board broken |
| Analytics | Dashboard shows error |

## Project Structure

```
taskboard-3.0/
├── gateway/                    # API Gateway (8000)
├── services/
│   ├── auth-service/          # Auth Service (8001)
│   ├── task-service/         # Task Service (8003)
│   └── analytics-service/    # Analytics Service (8004)
└── frontend/
    ├── app/                  # Pages
    ├── services/             # API clients
    ├── context/              # State management
    └── components/           # UI components
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Tasks
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PUT /api/v1/tasks/{id}`
- `DELETE /api/v1/tasks/{id}`
- `PATCH /api/v1/tasks/{id}/move`

### Analytics
- `GET /api/v1/analytics/stats`

## Version
3.0.0 - Full Microservices
