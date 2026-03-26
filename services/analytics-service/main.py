from fastapi import FastAPI, HTTPException, Header
from jose import JWTError, jwt
import httpx

from config import Settings
from schemas import StatsResponse, DistributionResponse, HeatmapResponse

settings = Settings()
app = FastAPI(title="Analytics Service", version="1.0.0")


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


@app.get("/health")
def health():
    return {"status": "healthy", "service": "analytics-service"}


@app.get("/analytics/stats", response_model=StatsResponse)
async def get_stats(authorization: str = Header(None)):
    user_id = get_user_id_from_token(authorization)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.TASK_SERVICE_URL}/tasks",
                headers={"Authorization": authorization},
            )

            if response.status_code == 401:
                raise HTTPException(status_code=401, detail="Authentication failed")

            tasks = response.json()
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Task service unavailable")

    status_counts = {"backlog": 0, "in_progress": 0, "review": 0, "done": 0}
    priority_counts = {"high": 0, "medium": 0, "low": 0}

    for task in tasks:
        status = task.get("status", "backlog")
        priority = task.get("priority", "medium")

        if status in status_counts:
            status_counts[status] += 1
        if priority in priority_counts:
            priority_counts[priority] += 1

    return StatsResponse(
        total_tasks=len(tasks),
        status_counts=status_counts,
        priority_counts=priority_counts,
    )


@app.get("/analytics/heatmap", response_model=HeatmapResponse)
async def get_heatmap(authorization: str = Header(None)):
    stats = await get_stats(authorization)
    return HeatmapResponse(
        high=stats.priority_counts.get("high", 0),
        medium=stats.priority_counts.get("medium", 0),
        low=stats.priority_counts.get("low", 0),
    )


@app.get("/analytics/distribution", response_model=DistributionResponse)
async def get_distribution(authorization: str = Header(None)):
    stats = await get_stats(authorization)
    total = stats.total_tasks

    if total == 0:
        return DistributionResponse(
            distribution={
                "backlog": 0.0,
                "in_progress": 0.0,
                "review": 0.0,
                "done": 0.0,
            }
        )

    distribution = {
        status: (count / total) * 100 for status, count in stats.status_counts.items()
    }

    return DistributionResponse(distribution=distribution)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8004)
