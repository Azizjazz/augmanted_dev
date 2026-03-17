from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from enum import Enum
from datetime import datetime


class Priority(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.medium


class TaskCreate(TaskBase):
    column_id: str


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    column_id: Optional[str] = None
    order: Optional[int] = Field(None, validation_alias="task_order")


class TaskResponse(TaskBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    column_id: str
    order: int = Field(0, validation_alias="task_order")
    created_at: datetime
    updated_at: datetime


class ReorderTask(BaseModel):
    new_column_id: str
    new_order: int


class MoveTask(BaseModel):
    column_id: str
    order_index: int
