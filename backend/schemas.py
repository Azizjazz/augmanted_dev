from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Dict
from enum import Enum


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class TaskStatus(str, Enum):
    backlog = "backlog"
    in_progress = "in_progress"
    review = "review"
    done = "done"


class TaskPriority(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.medium
    status: TaskStatus = TaskStatus.backlog


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    position: Optional[int] = None


class TaskMove(BaseModel):
    status: TaskStatus
    position: Optional[int] = None


class TaskResponse(TaskBase):
    id: int
    position: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_tasks: int
    status_counts: Dict[str, int]
    priority_counts: Dict[str, int]
