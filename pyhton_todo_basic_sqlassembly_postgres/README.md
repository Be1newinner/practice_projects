### ✅ Setup Summary:

- **SQLAlchemy 2.0.41** (fully async style)
- **Pydantic v2.11.4** (with `from_orm()` equivalent: `model_config`)
- **FastAPI v0.115.12**
- **Alembic v1.15.2** (for migrations)
- **PostgreSQL** backend

---

## 🔧 Step-by-Step Setup

### 1. 📁 Directory Structure

```
.
├── alembic
│   ├── env.py
│   ├── README
│   ├── script.py.mako
│   └── versions
│       └── c42a8937e3fe_create_todos_table.py
├── alembic.ini
├── app
│   ├── core
│   │   ├── config.py
│   │   └── database.py
│   └── features
│       ├── base_model.py
│       ├── todo_model.py
│       ├── todo_schema.py
│       └── todo_service.py
├── main.py
└── README.md
```

### 2. 📦 Install Required Packages

```bash
pip install fastapi sqlalchemy asyncpg alembic pydantic
```

### 3. 🔐 `core/config.py`

```python
from pydantic import BaseModel
import os

class Settings(BaseModel):
    POSTGRES_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@localhost:5432/mydb")

settings = Settings()
```

---

### 4. ⚙️ `core/database.py`

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Async Engine & Session
engine = create_async_engine(settings.POSTGRES_URL, echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)

# Base class for models
class Base(DeclarativeBase):
    pass

# Dependency for FastAPI
async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session
```

---

### 5. 📄 `models/base.py`

```python
from app.core.database import Base
```

---

### 6. ✅ `models/todo.py`

```python
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    completed: Mapped[bool] = mapped_column(default=False)
```

---

### 7. 📦 `schemas/todo.py` (Pydantic v2)

```python
from pydantic import BaseModel, ConfigDict

class TodoBase(BaseModel):
    title: str
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoRead(TodoBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
```

---

### 8. 🧠 `crud/todo.py`

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.todo import Todo
from app.schemas.todo import TodoCreate

async def create_todo(db: AsyncSession, data: TodoCreate) -> Todo:
    todo = Todo(**data.dict())
    db.add(todo)
    await db.commit()
    await db.refresh(todo)
    return todo

async def get_all_todos(db: AsyncSession) -> list[Todo]:
    result = await db.execute(select(Todo))
    return result.scalars().all()
```

---

### 9. 🚀 `main.py`

```python
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.todo import TodoCreate, TodoRead
from app.crud.todo import create_todo, get_all_todos

app = FastAPI()

@app.post("/todos", response_model=TodoRead)
async def create(todo: TodoCreate, db: AsyncSession = Depends(get_db)):
    return await create_todo(db, todo)

@app.get("/todos", response_model=list[TodoRead])
async def read_all(db: AsyncSession = Depends(get_db)):
    return await get_all_todos(db)
```

---

### 10. ⚡ Alembic Config (`alembic.ini` + env.py)

- In `alembic/env.py`, use:

```python
from app.core.database import Base
from app.core.config import settings
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

# Add your models here
from app.models import todo

def run_migrations_online():
    config.set_main_option("sqlalchemy.url", settings.POSTGRES_URL.replace("+asyncpg", ""))
```

Then run:

```bash
alembic init alembic
alembic revision --autogenerate -m "init"
alembic upgrade head
```

---

### ✅ Bonus Tips:

- **Use `.env`** for secrets (with `python-dotenv`)
- **Use `alembic revision --autogenerate`** to track model changes
- **Test DB using `pytest-asyncio`**
