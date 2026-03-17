# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-03-17

### Feature Sprint 4: The Visual Dashboard

#### Backend
- Added `/api/stats` endpoint with JWT authentication
- SQL aggregation using COUNT and GROUP BY for efficient stats calculation
- Returns: total tasks, by_status counts, by_priority_per_status nested object
- Created `app/schemas/stats.py` with StatsResponse Pydantic schema

#### Frontend
- Created StatsDashboard component with Glassmorphism styling
- Four large Stat Cards showing Backlog, In Progress, Review, Done counts
- Priority Breakdown section with progress bars for High/Medium/Low per status
- Toggle buttons in header to switch between Board View and Dashboard View

#### Testing
- Frontend tests passing (8/8)
- Verified stats endpoint with test data:
  - 3 tasks created (2 backlog: 1 high, 1 medium; 1 in_progress: 1 low)

## [1.1.0] - 2026-03-17

### Feature Sprint 3: JWT Authentication

#### Backend
- Switched from PostgreSQL to SQLite (`sqlite:///./taskboard.db`)
- Implemented JWT authentication using python-jose and bcrypt
- Created `/api/auth/register` and `/api/auth/login` endpoints
- All task routes now protected with JWT (GET, POST, PATCH, DELETE)
- Created `app/auth.py` with JWT token generation and validation

#### Frontend
- Created `/dashboard` route with KanbanBoard (moved from `/`)
- Root `/` redirects to `/login` if no token, else `/dashboard`
- Login and Signup pages redirect to `/dashboard` after success
- Updated all API calls to include Authorization header
- Created AuthContext for managing token state

#### Environment
- Updated `.env` to use `DATABASE_URL=sqlite:///./taskboard.db`
- Added python-jose, bcrypt to requirements.txt

## [0.8.0] - 2026-03-17

### Critical Fixes
- Fixed DELETE 405 error: Added DELETE handler to frontend `/api/tasks/[id]/route.ts`
- Fixed PATCH 422 error: Frontend reorder route now converts camelCase to snake_case before sending to backend
- Fixed data persistence: Changed from in-memory storage to SQLite file (`tasks.db`)

### Fixed
- DELETE endpoint now returns 204 No Content (proper REST behavior)
- Frontend state properly updates after Delete/Add operations

### Added
- Task Counter UI showing total number of active tasks
- SQLite database for persistent storage (survives refresh/restart)

#### Frontend
- Added GET, PATCH, DELETE handlers to `/api/tasks/[id]/route.ts`
- Updated reorder route to convert `newColumnId` → `new_column_id` and `newOrder` → `new_order`
- Added task counter displaying total tasks in header

#### Backend
- Created `app/database.py` with SQLite persistence
- All CRUD operations now use SQLite instead of in-memory list
- Tasks persist to `backend/tasks.db` file

#### Testing
- Updated backend tests to expect 204 for DELETE
- Updated E2E tests to use database functions instead of in-memory list

## [0.7.0] - 2026-03-17

### Fixed
- Empty column drop bug: Tasks can now be dropped into entirely empty columns
- Changed collision detection from closestCorners to closestCenter for reliable empty column drops
- Column containers now have min-height: 500px for adequate drop target area
- useDroppable configured on column containers for drop zone detection

### Added
- Delete (trash) icon on TaskCard with onDelete functionality
- PATCH /tasks/{id}/move endpoint for moving tasks between columns
- Backend test for move endpoint

#### Frontend
- Added useDroppable hook to ColumnComponent for empty column drop support
- Added min-height: 500px to column containers
- Added delete button with trash icon to TaskCard
- handleDeleteTask function to remove tasks from database

#### Backend
- Added MoveTask Pydantic schema (column_id, order_index)
- Implemented PATCH /tasks/{id}/move endpoint with cache invalidation

#### Testing
- Added test_move_task to backend tests
- All tests passing (7 backend, 8 frontend, 6 E2E)

## [0.5.0-fix] - 2026-03-17

### Fixed
- Optimized GET /tasks endpoint with LRU caching
- Fixed dnd-kit onDragEnd handler to correctly update local state after PATCH request succeeds
- Ensured SortableContext has correct items array from column.tasks
- Added PointerSensor and KeyboardSensor with proper activation constraints

### Added
- State management documentation in ARCHITECTURE.md (React Context + useState)
- Optimistic UI updates for instant task creation feedback

#### Frontend
- Fixed dnd-kit sensors configuration (PointerSensor with 8px distance, KeyboardSensor with sortableKeyboardCoordinates)
- Updated handleDragEnd to sync local state with server response after PATCH

#### Backend
- Added @lru_cache to GET /tasks for performance optimization
- Cache invalidation on all write operations (POST, PATCH, DELETE)

#### Testing
- E2E tests for drag-drop workflow passing (create task, drag across columns)

## [0.4.2] - 2026-03-16

### Fixed
- Fixed state synchronization: Convert API response from snake_case to camelCase
- Tasks now appear immediately after creation without refresh

## [0.4.1] - 2026-03-16

### Fixed
- Fixed dnd-kit import error: moved `useSortable` from `@dnd-kit/core` to `@dnd-kit/sortable`
- Verified @dnd-kit/sortable and @dnd-kit/utilities are in package.json

## [0.3.0] - 2026-03-16

### Phase: Interactive Tasks

#### Frontend
- Integrated @dnd-kit for drag-and-drop functionality
- Added smooth animations when dragging tasks between columns
- Created AddTaskModal with glassmorphism effect (backdrop-blur-md)
- Implemented optimistic UI updates for instant feedback
- Added "Add Task" button to open modal

#### Backend
- Added PATCH /tasks/{id}/reorder endpoint for status changes
- Updated TaskUpdate schema to support column and order changes
- Implemented ReorderTask Pydantic schema

#### Testing
- Created E2E test for drag-drop workflow (create task in Backlog, drag to In Progress)
- Added tests for reordering within same column and across multiple columns

## [0.2.0] - 2026-03-16

### Phase: API Integration

#### Frontend
- Connected KanbanBoard to backend API
- Added loading states and error handling
- Implemented task fetching from /api/tasks

#### Backend
- Created full CRUD endpoints (GET, POST, PATCH, DELETE)
- Implemented in-memory database for tasks

## [0.1.0] - 2026-03-16

### Added
- Initial project scaffolding with Next.js 15 and FastAPI
- ARCHITECTURE.md with full technical specification
- Glassmorphism design system (Tailwind CSS)
- dnd-kit integration for drag-and-drop
- TypeScript interfaces for Task and Column
- Pydantic schemas for API contracts
- REST API endpoints for Tasks and Columns

### Defined
- Four-column Kanban pipeline: Backlog, In Progress, Review, Done
- Priority system: high (red), medium (amber), low (blue)
- Optimistic UI update strategy using React 19 useOptimistic
