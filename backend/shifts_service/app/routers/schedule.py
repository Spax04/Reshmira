from datetime import datetime, timedelta
from bson.objectid import ObjectId
from fastapi import APIRouter, Response, status, Depends, HTTPException
from pymongo import ReturnDocument
from app import oauth2
from app.database import Guard, Schedule, Shift
from app.serializers.guard_serializer import guard_entity, guard_response_entity
from app.schemas import guard_schemas, schedule_schemas
from app.oauth2 import AuthJWT
from ..config import settings
from app.schemas.shift_schemas import ShiftBaseSchema, GuardAssignment
from app.serializers.schedule_serializer import schedule_entity

router = APIRouter()
ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


@router.post('/create-new', status_code=status.HTTP_201_CREATED, response_model=schedule_schemas.CreateScheduleResponse)
async def create_schedule(payload: schedule_schemas.CreateScheduleSchema):
    new_schedule_data = payload.dict()
    new_schedule_data['created_at'] = datetime.utcnow()
    new_schedule_data['updated_at'] = new_schedule_data['created_at']

    Schedule.insert_one(new_schedule_data)
    return {"status": "success"}


@router.post('/fill-schedule', status_code=status.HTTP_201_CREATED, response_model=schedule_schemas.ScheduleBaseSchema)
async def create_schedule(payload: schedule_schemas.ScheduleBaseRequest):
    schedule = Schedule.find_one({"_id": ObjectId(payload.schedule_id)})

    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Schedule does not exist')

    Schedule.update_one({'_id': ObjectId(payload.schedule_id)}, {'$set': {'created_at': datetime.utcnow()}})

    shift_duration = timedelta(hours=payload.shift_time.hours, minutes=payload.shift_time.minutes)

    guard_index = 0

    guards_pre_shift = 0
    guards_by_schedule = Guard.find({"schedule_id": payload.schedule_id})
    # Iterate over guard posts in the payload and sum up guards_in_post attribute
    for post in payload.guard_posts:
        guards_pre_shift += post.guards_in_post

    start_date = datetime.utcnow()
    current_date = start_date
    isWeekDone = False
    one_week = timedelta(days=7)

    shift_ids = []  # To store IDs of the shifts inserted

    while not isWeekDone:

        guard_assignments = []
        for post in payload.guard_posts:
            for guard in range(post.guards_in_post):
                guard_assignments.append(
                    GuardAssignment(guard_id=ObjectId(guards_by_schedule[guard_index]["_id"]),
                                    guard_post_name=post.guard_post_name))
                guard_index += 1
                if guard_index >= len(guards_by_schedule):
                    guard_index = 0

        new_shift = ShiftBaseSchema(start_time=current_date, end_time=current_date + shift_duration,
                                    schedule_id=ObjectId(payload.schedule_id), guards=guard_assignments)

        # Insert the new shift
        inserted_shift = Shift.insert_one(new_shift.dict())

        # Get the inserted shift's ID
        shift_id = inserted_shift.inserted_id
        shift_ids.append(shift_id)

        # Update current_date for the next shift
        current_date += shift_duration

        # Check if one week has passed
        if current_date - start_date >= one_week:
            isWeekDone = True

    # Update schedule with the IDs of the shifts
    updated_schedule = Schedule.find_one_and_update(
        {'_id': ObjectId(payload.schedule_id)},
        {'$set': {'shifts': shift_ids}},
        return_document=ReturnDocument.AFTER
    )

    return {"status": "success", "schedule": schedule_entity(updated_schedule)}
