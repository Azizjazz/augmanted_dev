from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./task.db"
    JWT_SECRET: str = "your-jwt-secret-key-min-32-chars-change"
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"
