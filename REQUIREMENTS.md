# TaskBoard Pro: Project Overview

TaskBoard Pro is a high-performance, portfolio-ready Kanban board designed with a premium, modern aesthetic. Instead of a standard, utilitarian dashboard, TaskBoard Pro features a stunning Glassmorphism UI with a gradient background, frosted-glass translucent columns, and smooth interactive hover effects.

## Core Features

| Feature | Description |
|---------|-------------|
| **Kanban Board** | Interactive pipeline with 4 columns: Backlog, In Progress, Review, Done |
| **Task Cards** | Draggable cards with title, description, and priority tags |
| **Priority Tags** | Color-coded: High (Red), Medium (Yellow), Low (Blue) |
| **Drag & Drop** | Fluid animations when moving tasks across columns |
| **Add Task Modal** | Glass-themed modal for creating new tasks |
| **Analytics Dashboard** | Real-time stats with status distribution and severity heatmap |
| **Task Deletion** | Click X button on task cards to remove them |
| **View Toggle** | Switch between Board and Dashboard views |

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: FastAPI, Python 3.10+, SQLAlchemy, SQLite

## Milestones

### [COMPLETED] Milestone 1: Foundation (Sprint 1)
- [x] Initialize Next.js 15 frontend with Tailwind CSS
- [x] Setup FastAPI backend with SQLite database
- [x] Implement TaskContext for global state management
- [x] Create database schema (Tasks table)
- [x] Define API endpoints for CRUD operations

### [COMPLETED] Milestone 2: Authentication (Sprint 2)
- [x] User registration (`/register`) with email/password
- [x] User login (`/login`) with JWT token
- [x] Protected routes - redirect unauthenticated users to `/login`
- [x] JWT token storage in localStorage
- [x] Logout functionality

### [COMPLETED] Milestone 3: Kanban Core (Sprint 3)
- [x] Build Kanban board layout with 4 columns
- [x] Implement draggable task cards
- [x] Add fluid drag & drop animations
- [x] Create Add Task modal component
- [x] Connect frontend to backend API
- [x] Task deletion feature
- [x] Analytics dashboard with stats endpoint

### [COMPLETED] Milestone 4: UI Polish (Sprint 4)
- [x] Apply Glassmorphism styling to all components
- [x] Add gradient background and hover effects
- [x] Implement responsive design
- [x] Add priority tag color coding with glowing borders
- [x] Fix dropdown visibility (bg-slate-800, text-white)
- [x] Board/Dashboard view toggle

### [IN PROGRESS] Milestone 5: Enhanced Features (Sprint 5)
- [ ] Task editing functionality
- [ ] Task reordering within columns
- [ ] Enhanced search/filter capabilities
- [ ] Export functionality

## User Flow

```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│   /      │────▶│  /login   │────▶│  /register   │
│ (root)   │     │           │     │              │
└──────────┘     └─────┬─────┘     └──────┬───────┘
                        │                   │
                        │  No account?      │ Has account?
                        ▼                   ▼
                   ┌───────────┐     ┌───────────┐
                   │ /register │     │  /login   │
                   └─────┬─────┘     └─────┬─────┘
                         │                 │
                         └────────┬────────┘
                                  │
                     ┌────────────┴────────────┐
                     │   POST /api/v1/auth/*    │
                     │   JWT Token Generated    │
                     └────────────┬────────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │  Store Token in        │
                     │  localStorage          │
                     └────────────┬───────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │  Redirect to /board    │
                     │  (Protected Route)    │
                     └────────────────────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │  Toggle: /dashboard    │
                     │  View Statistics       │
                     └────────────────────────┘
```

## Interactive Features

- **Interactive Pipeline**: Four main columns to manage workflows: Backlog, In Progress, Review, and Done.
- **Draggable Task Cards**: Cards feature titles, descriptions, and color-coded priority tags (Red for High, Yellow for Medium, Blue for Low).
- **Fluid Drag & Drop**: Smooth animations when picking up and moving tasks across the board.
- **Add Task Modal**: A sleek, matching glass-themed modal to easily inject new tasks into the workflow.
- **Delete Tasks**: Click the X button on any task card to remove it.
- **Analytics Dashboard**: View total task count, status distribution bars, and severity heatmap.
