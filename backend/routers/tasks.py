from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from routers.auth import get_current_user
import crud
import schemas
from database import get_db
import models

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/stats", response_model=schemas.StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_user_stats(db, user_id=current_user.id)


@router.get("", response_model=List[schemas.TaskResponse])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tasks = crud.get_user_tasks(db, user_id=current_user.id, skip=skip, limit=limit)
    return tasks


@router.get("/{task_id}", response_model=schemas.TaskResponse)
def read_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_task = crud.get_user_task(db, task_id=task_id, user_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.post("", response_model=schemas.TaskResponse, status_code=201)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_user_task(db=db, task=task, user_id=current_user.id)


@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    task: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_task = crud.update_user_task(
        db, task_id=task_id, task=task, user_id=current_user.id
    )
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    success = crud.delete_user_task(db, task_id=task_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return None


@router.patch("/{task_id}/move", response_model=schemas.TaskResponse)
def move_task(
    task_id: int,
    move_data: schemas.TaskMove,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_task = crud.move_user_task(
        db, task_id=task_id, move_data=move_data, user_id=current_user.id
    )
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task
