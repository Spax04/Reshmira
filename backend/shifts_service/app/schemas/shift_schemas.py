from datetime import datetime
from typing import List
from bson import ObjectId

from pydantic import BaseModel


class GuardAssignment(BaseModel):
    guard_id: ObjectId
    guard_post_name: str


class ShiftBaseSchema(BaseModel):
    start_time: datetime
    end_time: datetime
    schedule_id: ObjectId
    guards: List[GuardAssignment] = []

    class Config:
        orm_mode = True


class CreateShiftRequest(ShiftBaseSchema):
    start_time: datetime
    end_time: datetime
    schedule_id: str
    guards: List[GuardAssignment] = []

    class Config:
        orm_mode = True


class ListShiftsResponse(BaseModel):
    guards: List[ShiftBaseSchema] = []


class ListShiftsRequest(BaseModel):
    schedule_id: str