# TaskBoard Pro - Golden Path Architecture

## Schema Specification
- **Task Table**: MUST include `user_id` (ForeignKey to users.id) and `status` field
- All task queries MUST filter by `user_id` for data isolation

## API Conventions
- **Prefix**: All routes MUST use the `/api/v1/` prefix
- **Auth Required**: All task endpoints require Bearer token authentication

## CORS Configuration
- Allow origins: `http://localhost:3000`, `http://127.0.0.1:3000`
- Allow credentials: `true`
- Allow all methods and headers including `Authorization`

## API Contracts

### Authentication (`/api/v1/auth/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login (returns JWT) |
| GET | `/api/v1/auth/me` | Get current user |

### Tasks (`/api/v1/tasks/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | List user's tasks |
| GET | `/api/v1/tasks/{id}` | Get single task |
| POST | `/api/v1/tasks` | Create new task |
| PUT | `/api/v1/tasks/{id}` | Update task |
| DELETE | `/api/v1/tasks/{id}` | Delete task |
| PATCH | `/api/v1/tasks/{id}/move` | Move task to column |
| GET | `/api/v1/tasks/stats` | Get task statistics |

### Stats Response Schema
```json
{
  "total_tasks": 10,
  "status_counts": { "backlog": 3, "in_progress": 4, "review": 2, "done": 1 },
  "priority_counts": { "high": 2, "medium": 5, "low": 3 }
}
```

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Glassmorphism UI
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy, Pydantic
- **Database**: SQLite (taskboard.db)

## Project Structure
```
/backend
  /routers - API route handlers (auth.py, tasks.py)
  models.py - SQLAlchemy models (User, Task)
  schemas.py - Pydantic schemas
  crud.py - Database operations
  main.py - FastAPI app entry point
  
/frontend
  /app - Next.js pages (login, register, board)
  /components - React components (KanbanBoard, TaskModal)
  /context - React contexts (AuthContext, TaskContext)
  /lib - API client (api.ts)
  /types - TypeScript types
```

## Priority Color System
- High: `border-red-500/50` with red glow
- Medium: `border-yellow-500/50` with yellow glow  
- Low: `border-blue-500/50` with blue glow

## Glassmorphism Specification
- Base class: `backdrop-blur-md bg-white/10`
- Card variant: `glass-card` with enhanced glass effect
