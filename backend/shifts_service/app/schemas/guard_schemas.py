from datetime import datetime
from typing import List
from pydantic import BaseModel
from bson import ObjectId


class GuardBaseSchema(BaseModel):
    name: str
    role: str = None  # 'admin' or 'guest'
    schedule_id: ObjectId
    shifts: List[ObjectId] = []
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


class ListGuardsResponse(BaseModel):
    guards: List[GuardBaseSchema] = []


class AllGuardsRequest(BaseModel):
    schedule_id: str
