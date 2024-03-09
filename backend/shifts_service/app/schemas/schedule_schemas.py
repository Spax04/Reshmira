from datetime import datetime
from typing import List
from bson import ObjectId


from pydantic import BaseModel


class GuardPost(BaseModel):
    guard_post_name: str
    guards_in_post: int


class ScheduleBaseSchema(BaseModel):
    name: str
    guards: List[ObjectId] = []  # id's of guards
    shifts: List[ObjectId] = []  # id's of shifts
    guard_posts: List[GuardPost] = []  # names of guard_posts
    shift_time: float
    min_rest_time: float
    max_rest_time: float
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        orm_mode = True


class ShiftTime(BaseModel):
    hours: int
    minutes: int


class ScheduleBaseRequest(BaseModel):
    schedule_id: str
    guards: List[str] = []  # id's of guards
    guard_posts: List[GuardPost] = []  # names of positions
    shift_time: ShiftTime


class CreateScheduleSchema(BaseModel):
    name: str
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CreateScheduleResponse(CreateScheduleSchema):
    schedule_id: str
