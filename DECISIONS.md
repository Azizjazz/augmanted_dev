# Architecture Decision Records

## ADR-001: Frontend Framework - Next.js 15

**Date:** 2026-03-16
**Status:** Accepted
**Context:** Need a modern, performant frontend framework for a Kanban board application.

**Decision:** Use Next.js 15 with App Router, React 19, and TypeScript.

**Rationale:**
- **App Router:** Provides file-based routing with nested layouts, ideal for the Kanban board structure
- **React 19 Features:** Access to `useOptimistic` for instant drag-and-drop feedback, `useActionState` for form handling
- **Server Components:** Initial data loads via RSC, interactive components as Client Components
- **TypeScript:** Full type safety across the codebase
- **Ecosystem:** Excellent Tailwind CSS integration, dnd-kit compatibility

**Alternatives Considered:**
- **Vite + React 18:** Missing RSC benefits, requires manual routing setup
- **Remix:** Strong contender but Next.js 15 chosen for market prevalence and team familiarity

---

## ADR-002: Backend Framework - FastAPI

**Date:** 2026-03-16
**Status:** Accepted
**Context:** Need a Python web framework for REST API development.

**Decision:** Use FastAPI (Python 3.10+) with SQLAlchemy 2.0 and Pydantic v2.

**Rationale:**
- **Performance:** Async-first, comparable to Node.js throughput
- **Type Safety:** Pydantic v2 provides runtime validation with Python type hints
- **Auto-Documentation:** Built-in Swagger UI at `/docs`
- **Modern Python:** Full async/await support, dataclass integration
- **ORM:** SQLAlchemy 2.0 offers typed queries and async support

**Alternatives Considered:**
- **Django:** Overkill for this project, slower startup, heavier
- **Flask:** Not async-native, requires extensions for basic features
- **Express.js (Node):** Rejected per requirement for Python backend

---

## ADR-003: Database - PostgreSQL

**Date:** 2026-03-16
**Status:** Accepted
**Context:** Need a production-ready relational database.

**Decision:** Use PostgreSQL with SQLAlchemy ORM.

**Rationale:**
- **Relational Integrity:** Tasks and Columns have clear foreign key relationships
- **PostGIS Ready:** Extensible for future geospatial features
- **Production Standard:** Robust, ACID-compliant, excellent tooling
- **JSON Support:** Flexible for future metadata fields

**Alternatives Considered:**
- **SQLite:** Good for dev, but limited concurrency, not production-ready
- **MongoDB:** No, relational model fits Kanban structure better
- **MySQL:** PostgreSQL has stricter SQL compliance and better JSON support

---

## ADR-004: Drag-and-Drop Library - dnd-kit

**Date:** 2026-03-16
**Status:** Accepted
**Context:** Need accessible, performant drag-and-drop for Kanban cards.

**Decision:** Use @dnd-kit/core and @dnd-kit/sortable.

**Rationale:**
- **Accessibility:** Built-in keyboard navigation, screen reader support
- **Modular:** Core, sortable,/utilities packages for flexible composition
- **Physics:** Smooth animations, configurable sensors
- **React-Ready:** Designed for React, proper hook API
- **Future-Proof:** Active maintenance, modern React patterns

**Alternatives Considered:**
- **react-beautiful-dnd:** Deprecated, not React 18+ optimized
- **react-dnd:** Powerful but steep learning curve, verbose API
- **native HTML5 DnD:** Not accessible, limited physics

---

## ADR-005: Styling - Tailwind CSS with Glassmorphism

**Date:** 2026-03-16
**Status:** Accepted
**Context:** Need rapid, consistent styling with premium glass aesthetic.

**Decision:** Use Tailwind CSS with custom glassmorphism utility classes.

**Rationale:**
- **Speed:** Utility-first, no context switching to CSS files
- **Glassmorphism:** `backdrop-filter`, `bg-white/X`, `border-white/X` classes
- **Theme:** Extend Tailwind config for project colors
- **Responsive:** Built-in breakpoints for tablet/desktop

**Alternatives Considered:**
- **CSS Modules:** More boilerplate, no built-in glass utilities
- **Styled Components:** Runtime overhead, different paradigm
- **Plain CSS:** Slower development, harder to maintain

---

## ADR-006: State Management - React useState with Optimistic Updates

**Date:** 2026-03-16
**Status:** Accepted
**Context:** Need to manage local state for drag-and-drop operations with instant feedback.

**Decision:** Use React `useState` with optimistic updates pattern.

**Rationale:**
- **Simplicity:** useState is sufficient for this scope - no need for Redux/Zustand
- **Optimistic Updates:** Update local state immediately on drag-over for instant feedback
- **Server Sync:** Re-fetch or patch state after API response
- **React 19 Ready:** Compatible with `useOptimistic` when upgrading

**State Flow:**
1. Fetch tasks from API on mount
2. On drag-over: Optimistically update task position in local state
3. On drag-end: Call API to persist change
4. On API success: Sync with server response (or re-fetch)
5. On API failure: Rollback to previous state

**Alternatives Considered:**
- **Redux Toolkit:** Overkill for this project, adds complexity
- **Zustand:** Good alternative but adds external dependency
- **React Query:** Could be added later for caching, not needed now

---

## ADR-007: dnd-kit Dependency Correction

**Date:** 2026-03-16
**Status:** Accepted
**Context:** Build error - useSortable was incorrectly imported from @dnd-kit/core.

**Decision:** Move useSortable import to @dnd-kit/sortable package.

**Fix Applied:**
- `useSortable` must be imported from `@dnd-kit/sortable`
- `DndContext`, `DragOverlay`, sensors stay in `@dnd-kit/core`
- `SortableContext` stays in `@dnd-kit/sortable`

**GATE_STATUS: CLEARED**

---

## ADR-008: PostgreSQL with psycopg2 Driver

**Date:** 2026-03-17
**Status:** Accepted
**Context:** Need persistent database that survives server restarts.

**Decision:** Use PostgreSQL with psycopg2-binary driver.

**Implementation:**
- **Driver:** psycopg2-binary for synchronous PostgreSQL connections
- **Connection:** Connection string loaded from DATABASE_URL environment variable
- **Default:** `postgresql://postgres:postgres@localhost:5432/taskboard`

**Database Schema:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    column_id VARCHAR(50) NOT NULL,
    task_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**GATE_STATUS: CLEARED**

---

## ADR-009: JWT Authentication with OAuth2 Password Flow

**Date:** 2026-03-17
**Status:** Accepted
**Context:** Need secure authentication with per-user task isolation.

**Decision:** JWT tokens with OAuth2 Password Flow.

**Implementation:**
- **Library:** python-jose for JWT encoding/decoding
- **Password Hashing:** passlib with bcrypt
- **Token Expiry:** 24 hours
- **Storage:** JWT stored in localStorage on frontend

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB
    
    Note over User,Frontend: Registration
    User->>Frontend: Enter email/password
    Frontend->>API: POST /api/auth/register
    API->>DB: Create user (hash password)
    DB-->>API: User created
    API-->>Frontend: 201 Created
    
    Note over User,Frontend: Login
    User->>Frontend: Enter email/password
    Frontend->>API: POST /api/auth/login
    API->>DB: Verify credentials
    DB-->>API: User verified
    API->>API: Generate JWT
    API-->>Frontend: { access_token, token_type }
    Frontend->>Frontend: Store token in localStorage
    
    Note over User,Frontend: Authenticated Request
    Frontend->>API: GET /tasks (Authorization: Bearer <token>)
    API->>API: Decode JWT, extract user_id
    API->>DB: SELECT * FROM tasks WHERE user_id = ?
    DB-->>API: Tasks for this user only
    API-->>Frontend: [Task1, Task2, ...]
```

### User Task Isolation

```mermaid
erDiagram
    USERS ||--o{ TASKS : owns
    USERS {
        int id PK
        string email
        string hashed_password
        timestamp created_at
    }
    TASKS {
        string id PK
        int user_id FK
        string title
        string description
        string priority
        string column_id
        int task_order
        timestamp created_at
        timestamp updated_at
    }
```

**API Endpoints:**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Get JWT token
- `GET /tasks` - List user's tasks (requires JWT)
- `POST /tasks` - Create task (requires JWT)
- `PATCH /tasks/{id}` - Update task (requires JWT)
- `DELETE /tasks/{id}` - Delete task (requires JWT)
- `PATCH /tasks/{id}/reorder` - Reorder task (requires JWT)

**Security:**
- All task endpoints require valid JWT token
- Users can only access their own tasks (user_id in WHERE clause)
- Passwords hashed with bcrypt
- JWT signed with HS256

**GATE_STATUS: CLEARED**
