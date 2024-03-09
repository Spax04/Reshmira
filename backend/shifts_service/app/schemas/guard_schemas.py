from datetime import datetime
from typing import List
from pydantic import BaseModel


class GuardBaseSchema(BaseModel):
    name: str
    role: str = None  # 'admin' or 'guest'
    schedule_id: str
    shifts: List[str] = []
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        orm_mode = True


class CreateGuardSchema(GuardBaseSchema):
    user_id: str
    name: str
    role: str


class GuardResponse(BaseModel):
    status: str


class AllGuardsResponse(BaseModel):
    guards: List[GuardBaseSchema] = []


class AllGuardsRequest(BaseModel):
    schedule_id: str
