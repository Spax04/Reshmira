from datetime import datetime, timedelta
from bson.objectid import ObjectId
from fastapi import APIRouter, Response, status, Depends, HTTPException

from app import oauth2
from app.database import Guard,Schedule
from app.serializers.user_serializer import user_entity, user_response_entity
from app.schemas import guard_schemas,schedule_schemas
from app.oauth2 import AuthJWT
from ..config import settings

router = APIRouter()
ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


@router.post('/create', status_code=status.HTTP_201_CREATED, response_model=schedule_schemas.ScheduleBaseRequest)
async def create_schedule(payload: schedule_schemas.ScheduleBaseSchema):

    new_schedule_data = payload.dict()
    new_schedule_data['created_at'] = datetime.utcnow()
    new_schedule_data['updated_at'] = new_schedule_data['created_at']

    Schedule.insert_one(new_schedule_data)
    return {"status": "success"}



