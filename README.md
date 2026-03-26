# TaskBoard Pro 3.0

A high-performance, portfolio-ready Kanban board with a premium Glassmorphism UI. Now with **Microservices Architecture**!

## Version 3.0 - Microservices

This version introduces a complete microservices architecture where each service is independent, deployable, and fault-isolated.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Port 8000)                    │
│              Single Entry Point • Routes Requests                │
└──────────┬──────────────┬───────────────┬──────────────────────┘
           │              │               │
           ▼              ▼               ▼
┌─────────────────┐ ┌──────────┐ ┌─────────────────┐
│ Auth Service    │ │ Task     │ │ Analytics       │
│ (Port 8001)    │ │ Service  │ │ Service         │
│                 │ │(8003)    │ │ (Port 8004)     │
│ JWT Auth        │ │          │ │                 │
│ Registration    │ │ Kanban   │ │ Dashboard       │
│ Login          │ │ CRUD     │ │ Stats           │
└────────┬────────┘ └────┬─────┘ └────────┬────────┘
         │               │                │
         ▼               ▼                ▼
   ┌──────────┐    ┌──────────┐    ┌────────────┐
   │ auth.db  │    │ task.db  │    │analytics.db│
   │ (users) │    │ (tasks)  │    │ (stats)   │
   └──────────┘    └──────────┘    └────────────┘
```

## 🚀 QUICK START (5 Steps)

### Step 1: Open 5 Separate Terminal Windows

You'll need **5 terminal windows** open (can be Command Prompt, PowerShell, or VS Code terminals).

---

### Step 2: Start Auth Service (Terminal 1)

```cmd
cd C:\Users\HP\Desktop\App-test\services\auth-service
pip install -r requirements.txt -q
python -m uvicorn main:app --host 0.0.0.0 --port 8001
```

✅ You should see: `Uvicorn running on http://0.0.0.0:8001`

---

### Step 3: Start Task Service (Terminal 2)

```cmd
cd C:\Users\HP\Desktop\App-test\services\task-service
pip install -r requirements.txt -q
python -m uvicorn main:app --host 0.0.0.0 --port 8003
```

✅ You should see: `Uvicorn running on http://0.0.0.0:8003`

---

### Step 4: Start Analytics Service (Terminal 3)

```cmd
cd C:\Users\HP\Desktop\App-test\services\analytics-service
pip install -r requirements.txt -q
python -m uvicorn main:app --host 0.0.0.0 --port 8004
```

✅ You should see: `Uvicorn running on http://0.0.0.0:8004`

---

### Step 5: Start API Gateway (Terminal 4)

```cmd
cd C:\Users\HP\Desktop\App-test\gateway
pip install -r requirements.txt -q
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

✅ You should see: `Uvicorn running on http://0.0.0.0:8000`

---

### Step 6: Start Frontend (Terminal 5)

```cmd
cd C:\Users\HP\Desktop\App-test\frontend
npm install
npm run dev
```

✅ You should see: `Ready - Local: http://localhost:3000`

---

### 🎉 Open Your Browser!

Go to: **http://localhost:3000**

---

## 📋 Services Summary

| Terminal | Service | Port | URL |
|----------|---------|------|-----|
| 1 | Auth Service | 8001 | http://localhost:8001 |
| 2 | Task Service | 8003 | http://localhost:8003 |
| 3 | Analytics Service | 8004 | http://localhost:8004 |
| 4 | API Gateway | 8000 | http://localhost:8000 |
| 5 | Frontend | 3000 | http://localhost:3000 |

---

## 🔧 Troubleshooting

### "Port already in use"
```cmd
# Find and kill the process using the port
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

### "Module not found"
```cmd
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings bcrypt python-jose python-multipart httpx passlib
```

### Services not connecting
- Make sure all 4 backend services are running BEFORE starting the frontend
- Check the Gateway logs for routing errors

---

## Features

- Interactive Kanban board with 4 columns (Backlog, In Progress, Review, Done)
- Draggable task cards with priority tags
- Priority color coding: High (Red), Medium (Yellow), Low (Blue)
- Fluid drag & drop animations
- Glassmorphism UI design
- **JWT Authentication**
- **User registration and login**
- **Protected routes**
- **User isolation** - Each user sees only their own tasks
- **Dashboard View** - Analytics with status distribution and severity heatmap

## Fault Isolation

| Service Down | Impact |
|-------------|--------|
| Gateway | Full outage (all requests fail) |
| Auth Service | Can't login/register (tasks still work if logged in) |
| Task Service | Can't manage tasks (auth works, dashboard fails) |
| Analytics | Dashboard shows error (core features work) |

## API Endpoints

All endpoints are accessed through the API Gateway at `http://localhost:8000`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |
| GET | `/api/v1/auth/me` | Get current user info |
| GET | `/api/v1/auth/verify` | Verify JWT token |

### Tasks (Protected - requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get logged-in user's tasks |
| GET | `/api/v1/tasks/{id}` | Get task by ID |
| POST | `/api/v1/tasks` | Create new task |
| PUT | `/api/v1/tasks/{id}` | Update task |
| DELETE | `/api/v1/tasks/{id}` | Delete task |
| PATCH | `/api/v1/tasks/{id}/move` | Move task to column |

### Analytics (Protected - requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analytics/stats` | Get task statistics |
| GET | `/api/v1/analytics/heatmap` | Priority heatmap data |
| GET | `/api/v1/analytics/distribution` | Status distribution % |

> **Note:** Include header `Authorization: Bearer <token>` for protected endpoints.

## Project Structure

```
taskboard-3.0/
├── gateway/                    # API Gateway (Port 8000)
│   ├── main.py
│   └── requirements.txt
├── services/
│   ├── auth-service/          # Auth Service (Port 8001)
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── schemas.py
│   │   ├── config.py
│   │   └── auth.db
│   ├── task-service/          # Task Service (Port 8003)
│   │   ├── main.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── schemas.py
│   │   ├── config.py
│   │   └── task.db
│   └── analytics-service/     # Analytics Service (Port 8004)
│       ├── main.py
│       ├── schemas.py
│       ├── config.py
│       └── analytics.db
├── frontend/                  # Next.js 15 Frontend (Micro-Frontend Services)
│   ├── app/                   # Page Services
│   │   ├── login/            # Auth UI Service
│   │   ├── register/         # Registration UI Service
│   │   ├── board/            # Kanban UI Service
│   │   └── dashboard/        # Analytics UI Service
│   ├── components/           # Shared Components Service
│   │   ├── KanbanBoard.tsx   # Board Component
│   │   └── TaskModal.tsx     # Modal Component
│   ├── context/              # State Management Services
│   │   ├── AuthContext.tsx    # Auth State Service
│   │   └── TaskContext.tsx   # Task State Service
│   ├── lib/                  # API Client Service
│   │   └── api.ts
│   └── types/                # Type Definitions
├── docker-compose.yml         # Docker orchestration
├── start-services.bat         # Windows startup script
└── start-services.sh          # Unix startup script
```

## Frontend Micro-Services Architecture

The frontend is structured as **Micro-Frontend Services**:

| Service | Path | Responsibility |
|---------|------|----------------|
| Auth UI Service | `app/login/`, `app/register/` | User authentication screens |
| Kanban UI Service | `app/board/` | Kanban board with drag-drop |
| Analytics UI Service | `app/dashboard/` | Statistics dashboard |
| State Management | `context/` | Global state services |
| API Client | `lib/api.ts` | Backend communication |

## Environment Variables

### Gateway (.env)
```env
AUTH_SERVICE_URL=http://localhost:8001
TASK_SERVICE_URL=http://localhost:8003
ANALYTICS_SERVICE_URL=http://localhost:8004
```

### Auth Service (.env)
```env
DATABASE_URL=sqlite:///./auth.db
JWT_SECRET=your-jwt-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Multi-Agent Team

This project is developed using a 6-agent governance system:

| Agent | Role | Responsibility |
|-------|------|----------------|
| **#00 Specifier** | Product Architect | Requirements, SSoT, Milestones |
| **#01 Orchestrator** | Lead Architect | API contracts, DB schema |
| **#02 Frontend** | UI Engineer | Next.js 15, React 19, dnd-kit |
| **#03 Backend** | API Engineer | FastAPI microservices |
| **#04 QA** | Test Engineer | Jest/PyTest, E2E validation |
| **#05 DevOps** | Release Manager | Git versioning, Docs |

## Version History

- **v3.0.0**: Microservices Architecture (current)
- **v2.x.x**: Monolith with FastAPI
- **v1.x.x**: Initial release

## License

MIT
