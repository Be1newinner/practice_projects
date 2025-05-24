from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.features.todo_schema import TodoCreate, TodoRead
from app.features.todo_service import create_todo, get_all_todos

app = FastAPI()

@app.post("/todos", response_model=TodoRead)
async def create(todo: TodoCreate, db: AsyncSession = Depends(get_db)):
    return await create_todo(db, todo)

@app.get("/todos", response_model=list[TodoRead])
async def read_all(db: AsyncSession = Depends(get_db)):
    return await get_all_todos(db)
