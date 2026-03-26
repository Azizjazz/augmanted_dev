from sqlalchemy.orm import Session
from database import Task


def get_user_tasks(db: Session, user_id: int):
    return db.query(Task).filter(Task.user_id == user_id).order_by(Task.position).all()


def get_user_task(db: Session, task_id: int, user_id: int):
    return db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()


def create_user_task(
    db: Session,
    user_id: int,
    title: str,
    description: str = None,
    status: str = "backlog",
    priority: str = "medium",
):
    max_position = (
        db.query(Task).filter(Task.user_id == user_id, Task.status == status).count()
    )
    db_task = Task(
        user_id=user_id,
        title=title,
        description=description,
        status=status,
        priority=priority,
        position=max_position,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_user_task(db: Session, task: Task, **kwargs):
    for key, value in kwargs.items():
        if value is not None and hasattr(task, key):
            setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task


def delete_user_task(db: Session, task: Task):
    db.delete(task)
    db.commit()


def move_user_task(db: Session, task: Task, new_status: str, new_position: int):
    task.status = new_status
    task.position = new_position
    db.commit()
    db.refresh(task)
    return task
