from fastapi import FastAPI, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import Optional

from database import get_db, init_db
from schemas import (
    TaskCreate,
    TaskUpdate,
    TaskMove,
    TaskResponse,
    StatusEnum,
    PriorityEnum,
)
from crud import (
    get_user_tasks,
    get_user_task,
    create_user_task,
    update_user_task,
    delete_user_task,
    move_user_task,
)
from config import Settings

settings = Settings()
app = FastAPI(title="Task Service", version="1.0.0")


def get_user_id_from_token(authorization: str = Header(None)) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization header")

    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return int(user_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.on_event("startup")
def startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "healthy", "service": "task-service"}


@app.get("/tasks", response_model=list[TaskResponse])
def list_tasks(authorization: str = Header(None), db: Session = Depends(get_db)):
    user_id = get_user_id_from_token(authorization)
    tasks = get_user_tasks(db, user_id)
    return tasks


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int, authorization: str = Header(None), db: Session = Depends(get_db)
):
    user_id = get_user_id_from_token(authorization)
    task = get_user_task(db, task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    user_id = get_user_id_from_token(authorization)
    task = create_user_task(
        db,
        user_id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status.value,
        priority=task_data.priority.value,
    )
    return task


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    user_id = get_user_id_from_token(authorization)
    task = get_user_task(db, task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_data.model_dump(exclude_unset=True)
    if "status" in update_data:
        update_data["status"] = update_data["status"].value
    if "priority" in update_data:
        update_data["priority"] = update_data["priority"].value

    updated_task = update_user_task(db, task, **update_data)
    return updated_task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int, authorization: str = Header(None), db: Session = Depends(get_db)
):
    user_id = get_user_id_from_token(authorization)
    task = get_user_task(db, task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    delete_user_task(db, task)


@app.patch("/tasks/{task_id}/move", response_model=TaskResponse)
def move_task(
    task_id: int,
    move_data: TaskMove,
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    user_id = get_user_id_from_token(authorization)
    task = get_user_task(db, task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    updated_task = move_user_task(db, task, move_data.status.value, move_data.position)
    return updated_task


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8003)
