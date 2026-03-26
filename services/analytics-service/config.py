from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    TASK_SERVICE_URL: str = "http://localhost:8003"
    JWT_SECRET: str = "your-jwt-secret-key-min-32-chars-change"
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"
