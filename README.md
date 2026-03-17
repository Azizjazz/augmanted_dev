# TaskBoard Pro

A high-performance, portfolio-ready Kanban board featuring a stunning Glassmorphism UI with seamless drag-and-drop physics.

![Next.js 15](https://img.shields.io/badge/Next.js-15-black)
![React 19](https://img.shields.io/badge/React-19-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **Interactive Pipeline**: Four-column workflow (Backlog, In Progress, Review, Done)
- **Fluid Drag & Drop**: Smooth animations powered by dnd-kit
- **Glassmorphism UI**: Premium frosted-glass aesthetic with gradient backgrounds
- **Priority Tags**: Color-coded task priorities (High/Medium/Low)
- **Add Task Modal**: Sleek glass-themed task creation

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| Backend | FastAPI (Python 3.10+) |
| Database | PostgreSQL |
| ORM | SQLAlchemy 2.0 |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL (or SQLite for dev)

### Installation

```bash
# Frontend
npx create-next-app@latest taskboard --typescript --tailwind --eslint --app --src-dir
cd taskboard
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities clsx tailwind-merge

# Backend
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pydantic psycopg2-binary python-dotenv
```

### Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/taskboard
```

### Running

```bash
# Frontend (http://localhost:3000)
npm run dev

# Backend (http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Project Structure

```
taskboard/           # Next.js 15 frontend
├── src/
│   ├── app/         # App Router pages
│   ├── components/ # React components
│   └── lib/         # Types & utilities
backend/             # FastAPI backend
├── app/
│   ├── api/         # Route handlers
│   ├── models/     # SQLAlchemy models
│   ├── schemas/    # Pydantic schemas
│   └── services/   # Business logic
```

## License

MIT
