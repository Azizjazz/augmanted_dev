from fastapi import APIRouter, HTTPException, Depends, Response
from typing import List
import uuid
from datetime import datetime

from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate, ReorderTask, MoveTask
from app.schemas.stats import StatsResponse
import app.database as db
import app.auth as auth

router = APIRouter(prefix="/api", tags=["tasks"])


@router.get("/stats", response_model=StatsResponse)
def get_stats(response: Response, user_id: int = Depends(auth.get_current_user)):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return db.get_task_stats(user_id)


@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(user_id: int = Depends(auth.get_current_user)):
    tasks = db.get_all_tasks(user_id)
    return tasks


@router.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, user_id: int = Depends(auth.get_current_user)):
    now = datetime.utcnow().isoformat()
    new_task = {
        "id": str(uuid.uuid4()),
        "title": task.title,
        "description": task.description,
        "priority": task.priority.value
        if hasattr(task.priority, "value")
        else task.priority,
        "column_id": task.column_id,
        "order": len(
            [t for t in db.get_all_tasks(user_id) if t["column_id"] == task.column_id]
        ),
        "created_at": now,
        "updated_at": now,
    }
    return db.create_task(new_task, user_id)


@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, user_id: int = Depends(auth.get_current_user)):
    task = db.get_task_by_id(task_id, user_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: str, task_update: TaskUpdate, user_id: int = Depends(auth.get_current_user)
):
    update_data = task_update.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    update_data["updated_at"] = datetime.utcnow().isoformat()

    task = db.update_task(task_id, user_id, update_data)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, user_id: int = Depends(auth.get_current_user)):
    deleted = db.delete_task(task_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return None


@router.patch("/tasks/{task_id}/reorder", response_model=TaskResponse)
def reorder_task(
    task_id: str, reorder: ReorderTask, user_id: int = Depends(auth.get_current_user)
):
    update_data = {
        "column_id": reorder.new_column_id,
        "order": reorder.new_order,
        "updated_at": datetime.utcnow().isoformat(),
    }
    task = db.update_task(task_id, user_id, update_data)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/tasks/{task_id}/move", response_model=TaskResponse)
def move_task(
    task_id: str, move: MoveTask, user_id: int = Depends(auth.get_current_user)
):
    update_data = {
        "column_id": move.column_id,
        "order": move.order_index,
        "updated_at": datetime.utcnow().isoformat(),
    }
    task = db.update_task(task_id, user_id, update_data)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
