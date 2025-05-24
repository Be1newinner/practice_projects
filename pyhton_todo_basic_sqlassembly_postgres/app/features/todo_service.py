from typing import Sequence 
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.features.todo_model import Todo
from app.features.todo_schema import TodoCreate

async def create_todo(db: AsyncSession, data: TodoCreate) -> Todo:
    todo = Todo(**data.dict())
    db.add(todo)
    await db.commit()
    await db.refresh(todo)
    return todo

async def get_all_todos(db: AsyncSession) -> Sequence[Todo]:
    result = await db.execute(select(Todo))
    return result.scalars().all()
