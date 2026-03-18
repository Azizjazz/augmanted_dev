# TaskBoard Pro

A high-performance, portfolio-ready Kanban board with a premium Glassmorphism UI.

## Multi-Agent Team Setup

This project is developed using a 6-agent governance system:

| Agent | Role | Responsibility |
|-------|------|----------------|
| **#00 Specifier** | Product Architect | Requirements, SSoT, Milestones |
| **#01 Orchestrator** | Lead Architect | API contracts, DB schema, State structure |
| **#02 Frontend** | UI Engineer | Next.js 15, React 19, dnd-kit |
| **#03 Backend** | API Engineer | FastAPI, Python, SQLite |
| **#04 QA** | Test Engineer | Jest/PyTest, E2E validation |
| **#05 DevOps** | Release Manager | CI/CD, Docs, Versioning |

## Tech Stack

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- dnd-kit (Drag & Drop)
- TypeScript

### Backend
- FastAPI
- Python 3.10+
- SQLAlchemy
- SQLite

## Features

- Interactive Kanban board with 4 columns (Backlog, In Progress, Review, Done)
- Draggable task cards with priority tags
- Priority color coding: High (Red), Medium (Yellow), Low (Blue)
- Fluid drag & drop animations
- Glassmorphism UI design
- RESTful API backend
- **JWT Authentication**
- **User registration and login**
- **Protected routes**
- **User isolation** - Each user sees only their own tasks
- **Dashboard View** - Analytics with status distribution and severity heatmap
- **Task deletion** - Click the X button on task cards to remove them

## Views

### Board View (`/board`)
Default Kanban board with drag-and-drop task management across columns.

### Dashboard View (`/dashboard`)
Analytics dashboard showing:
- Total task count
- Status distribution bar chart
- Severity heatmap (High/Medium/Low priority counts with glowing borders)

### Toggling Between Views
Use the navigation links in the header:
- Click **"Board"** to switch to Kanban board
- Click **"Dashboard"** to switch to Analytics view

Both views require authentication.

## User Authentication Flow

```
/ (root) → Redirects to /login
/login     → Login form (redirects to /board on success)
/register → Registration form (redirects to /board on success)
/board    → Protected Kanban board (redirects to /login if not authenticated)
/dashboard → Protected Analytics dashboard (redirects to /login if not authenticated)
```

### Quick Auth Test
1. Visit http://localhost:3000 (redirects to /login)
2. Click "Sign up" to go to /register
3. Create account with username, email, password
4. You'll be logged in and redirected to /board
5. Click "Dashboard" in header to view task statistics
6. Click "Logout" to clear session and return to /login

## Project Structure

```
taskboard-pro/
├── frontend/              # Next.js 15 application
│   ├── app/              # App router (layout.tsx, page.tsx)
│   ├── components/       # React components
│   ├── context/          # TaskContext for global state
│   ├── lib/              # API client
│   └── types/            # TypeScript interfaces
├── backend/              # FastAPI application
│   ├── routers/          # API route handlers
│   ├── main.py           # Application entry point
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   ├── crud.py           # Database operations
│   └── taskboard.db      # SQLite database
├── requirements.md      # Project requirements
├── ARCHITECTURE.md       # System architecture
└── PASS_CRITERIA.md     # Sprint 1 acceptance criteria
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API will be available at: http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App will be available at: http://localhost:3000

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |
| GET | `/api/v1/auth/me` | Get current user info |

### Tasks (Protected - requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get logged-in user's tasks |
| GET | `/api/v1/tasks/{id}` | Get task by ID (own task only) |
| POST | `/api/v1/tasks` | Create new task |
| PUT | `/api/v1/tasks/{id}` | Update task |
| DELETE | `/api/v1/tasks/{id}` | Delete task |
| PATCH | `/api/v1/tasks/{id}/move` | Move task to column |
| GET | `/api/v1/tasks/stats` | Get task statistics |

> **Note:** All task endpoints return only the logged-in user's tasks. Include header: `Authorization: Bearer <token>`

## Milestones

- [x] **Sprint 1**: Foundation (Backend API, Frontend Setup, TaskContext)
- [x] **Sprint 2**: Authentication (JWT, Login, Register, Protected Routes)
- [x] **Sprint 3**: Kanban Core (Drag & Drop, Task Modal, 4 Columns)
- [x] **Sprint 4**: UI Polish (Glassmorphism, Dropdown Visibility, Priority Glows)
- [x] **Sprint 5**: Analytics Dashboard (Stats endpoint, Dashboard view, Delete feature)
- [ ] **Sprint 6**: Enhanced Features

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./taskboard.db
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

> **Important:** Generate a strong `JWT_SECRET` key (min 32 characters) for production use.

## License

MIT
