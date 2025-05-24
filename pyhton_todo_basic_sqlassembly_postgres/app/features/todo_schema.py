from pydantic import BaseModel, ConfigDict

class TodoBase(BaseModel):
    title: str
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoRead(TodoBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
