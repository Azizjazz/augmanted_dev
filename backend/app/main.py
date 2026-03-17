from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import tasks
from app.api import auth

app = FastAPI(
    title="TaskBoard Pro API",
    description="Backend API for TaskBoard Pro Kanban Board",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/")
def read_root():
    return {"message": "TaskBoard Pro API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
