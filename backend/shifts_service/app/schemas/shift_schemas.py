from datetime import datetime
from typing import List

from pydantic import BaseModel


class GuardAssignment(BaseModel):
    guard_id: str
    position: str


class ShiftBaseSchema(BaseModel):
    start_time: datetime
    end_time: datetime
    schedule_id: str
    guards: List[GuardAssignment] = []

    class Config:
        orm_mode = True


class CreateShiftSchema(ShiftBaseSchema):
    start_time: datetime
    end_time: datetime
    schedule_id: str
    guards: List[GuardAssignment] = []

    class Config:
        orm_mode = True
