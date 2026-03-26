from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    AUTH_SERVICE_URL: str = "http://localhost:8001"
    TASK_SERVICE_URL: str = "http://localhost:8003"
    ANALYTICS_SERVICE_URL: str = "http://localhost:8004"

    class Config:
        env_file = ".env"
