from pydantic import BaseModel
import os

class Settings(BaseModel):
    POSTGRES_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://admin:admin123@localhost:5432/todo_db")

settings = Settings()
