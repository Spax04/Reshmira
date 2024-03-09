from datetime import datetime
from typing import List

from pydantic import BaseModel


class ScheduleBaseSchema(BaseModel):
    name: str
    guards: List[str] = []  # id's of guards
    shifts: List[str] = []  # id's of shifts
    positions: List[str] = []  # names of positions
    shift_time: float
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        orm_mode = True


class ScheduleBaseRequest(BaseModel):
    name: str
    guards: List[str] = []  # id's of guards
    positions: List[str] = []  # names of positions
    shift_time: float
