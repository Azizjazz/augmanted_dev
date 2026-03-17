from pydantic import BaseModel
from typing import Dict


class PriorityCounts(BaseModel):
    high: int = 0
    medium: int = 0
    low: int = 0


class StatusCounts(BaseModel):
    backlog: int = 0
    in_progress: int = 0
    review: int = 0
    done: int = 0


class PriorityPerStatus(BaseModel):
    backlog: PriorityCounts
    in_progress: PriorityCounts
    review: PriorityCounts
    done: PriorityCounts


class StatsResponse(BaseModel):
    total: int
    by_status: StatusCounts
    by_priority_per_status: PriorityPerStatus
