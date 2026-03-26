from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx

from config import Settings

settings = Settings()
app = FastAPI(title="API Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICE_ROUTES = {
    "/api/v1/auth": settings.AUTH_SERVICE_URL,
    "/api/v1/tasks": settings.TASK_SERVICE_URL,
    "/api/v1/analytics": settings.ANALYTICS_SERVICE_URL,
}


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "api-gateway", "version": "3.0.0"}


@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy(path: str, request: Request):
    full_path = f"/{path}"

    target_base = None
    for route, base_url in SERVICE_ROUTES.items():
        if full_path.startswith(route):
            target_base = base_url
            break

    if target_base is None:
        raise HTTPException(status_code=404, detail="Route not found")

    service_path = full_path[len("/api/v1") :]
    target_url = f"{target_base}{service_path}"

    body = await request.body()

    headers = {}
    auth_header = request.headers.get("authorization")
    if auth_header:
        headers["Authorization"] = auth_header

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.request(
                method=request.method,
                url=target_url,
                content=body,
                headers=headers,
                params=request.query_params,
            )

            return JSONResponse(
                content=response.json() if response.text else {},
                status_code=response.status_code,
            )
    except httpx.ConnectError as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gateway error: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
