# Sprint 1 Pass Criteria - TaskBoard Pro

## Overview
This document defines the acceptance criteria for Sprint 1 (Foundation Milestone).

---

## Backend API Tests

### Tasks API
- [ ] `GET /api/v1/tasks` returns 200 and an array of tasks
- [ ] `GET /api/v1/tasks/{id}` returns 200 for existing task
- [ ] `GET /api/v1/tasks/{id}` returns 404 for non-existent task
- [ ] `POST /api/v1/tasks` creates a new task and returns 201
- [ ] `POST /api/v1/tasks` validates required `title` field
- [ ] `PUT /api/v1/tasks/{id}` updates task and returns 200
- [ ] `PUT /api/v1/tasks/{id}` returns 404 for non-existent task
- [ ] `DELETE /api/v1/tasks/{id}` deletes task and returns 204
- [ ] `PATCH /api/v1/tasks/{id}/move` moves task to new status
- [ ] API accepts valid priority values: `high`, `medium`, `low`
- [ ] API accepts valid status values: `backlog`, `in_progress`, `review`, `done`

### Database
- [ ] SQLite database `taskboard.db` is created in `/backend`
- [ ] `tasks` table exists with correct schema
- [ ] Database operations (CRUD) persist data correctly

### CORS
- [ ] Backend allows requests from `http://localhost:3000`
- [ ] Health check endpoint `/health` returns 200

---

## Frontend Tests

### Setup
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts development server on port 3000
- [ ] Application loads without console errors

### TaskContext
- [ ] `TaskProvider` wraps the entire application
- [ ] `useTaskContext()` provides access to task state
- [ ] Context includes: `tasks`, `isLoading`, `error`
- [ ] Context includes actions: `fetchTasks`, `addTask`, `updateTask`, `deleteTask`, `moveTask`

### Root Layout
- [ ] `layout.tsx` wraps children with `TaskProvider`
- [ ] Global styles (`globals.css`) apply correctly
- [ ] Page renders without hydration errors

### API Integration
- [ ] Tasks are fetched on initial load
- [ ] Loading state is displayed during API calls
- [ ] Error state is displayed on API failure

### TypeScript
- [ ] All TypeScript files compile without errors
- [ ] Types match the ARCHITECTURE.md specifications

---

## Integration Tests

### End-to-End Flow
- [ ] Frontend fetches tasks from Backend API
- [ ] Tasks display in their respective columns
- [ ] Create task form submits to API
- [ ] Created task appears in the task list
- [ ] Task can be updated
- [ ] Task can be deleted
- [ ] Task can be moved between columns

---

## Visual Checkpoints

### Glassmorphism UI Foundation
- [ ] Gradient background is visible (purple/blue)
- [ ] Glass-style containers have blur effect
- [ ] Cards have semi-transparent appearance

### Responsive Layout
- [ ] Board layout adapts to different screen sizes
- [ ] Four columns are visible on desktop
- [ ] Content remains readable on mobile

---

## Test Commands

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Sign-off

| Role | Agent | Status |
|------|-------|--------|
| QA | #04 | Pending |
| Orchestrator | #01 | Approved |
