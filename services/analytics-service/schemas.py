from pydantic import BaseModel
from typing import Dict


class StatsResponse(BaseModel):
    total_tasks: int
    status_counts: Dict[str, int]
    priority_counts: Dict[str, int]


class DistributionResponse(BaseModel):
    distribution: Dict[str, float]


class HeatmapResponse(BaseModel):
    high: int
    medium: int
    low: int
