from pydantic import BaseModel
from typing import Optional
from enum import Enum


class StatusEnum(str, Enum):
    backlog = "backlog"
    in_progress = "in_progress"
    review = "review"
    done = "done"


class PriorityEnum(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: StatusEnum = StatusEnum.backlog
    priority: PriorityEnum = PriorityEnum.medium


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None


class TaskMove(BaseModel):
    status: StatusEnum
    position: int = 0


class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    position: int

    class Config:
        from_attributes = True
