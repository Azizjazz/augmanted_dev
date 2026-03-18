from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas


def get_user_tasks(
    db: Session, user_id: int, skip: int = 0, limit: int = 100
) -> List[models.Task]:
    return (
        db.query(models.Task)
        .filter(models.Task.user_id == user_id)
        .order_by(models.Task.position)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_user_task(db: Session, task_id: int, user_id: int) -> Optional[models.Task]:
    return (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == user_id)
        .first()
    )


def create_user_task(
    db: Session, task: schemas.TaskCreate, user_id: int
) -> models.Task:
    db_task = models.Task(**task.model_dump(), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_user_task(
    db: Session, task_id: int, task: schemas.TaskUpdate, user_id: int
) -> Optional[models.Task]:
    db_task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == user_id)
        .first()
    )
    if db_task:
        update_data = task.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_user_task(db: Session, task_id: int, user_id: int) -> bool:
    db_task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == user_id)
        .first()
    )
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False


def move_user_task(
    db: Session, task_id: int, move_data: schemas.TaskMove, user_id: int
) -> Optional[models.Task]:
    db_task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == user_id)
        .first()
    )
    if db_task:
        db_task.status = str(move_data.status.value)
        if move_data.position is not None:
            db_task.position = int(move_data.position)
        db.commit()
        db.refresh(db_task)
    return db_task


def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserBase, password_hash: str) -> models.User:
    db_user = models.User(
        username=user.username, email=user.email, password_hash=password_hash
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_stats(db: Session, user_id: int) -> dict:
    from sqlalchemy import func

    total = (
        db.query(func.count(models.Task.id))
        .filter(models.Task.user_id == user_id)
        .scalar()
    )

    status_counts = {}
    for status in ["backlog", "in_progress", "review", "done"]:
        count = (
            db.query(func.count(models.Task.id))
            .filter(models.Task.user_id == user_id, models.Task.status == status)
            .scalar()
        )
        status_counts[status] = count

    priority_counts = {}
    for priority in ["high", "medium", "low"]:
        count = (
            db.query(func.count(models.Task.id))
            .filter(models.Task.user_id == user_id, models.Task.priority == priority)
            .scalar()
        )
        priority_counts[priority] = count

    return {
        "total_tasks": total,
        "status_counts": status_counts,
        "priority_counts": priority_counts,
    }
