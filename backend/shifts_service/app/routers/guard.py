from datetime import datetime, timedelta
from bson.objectid import ObjectId
from fastapi import APIRouter, Response, status, Depends, HTTPException

from app import oauth2
from app.database import Guard
from app.serializers.user_serializer import user_entity, user_response_entity
from app.schemas import guard_schemas
from app.oauth2 import AuthJWT
from ..config import settings

router = APIRouter()
ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


@router.post('/register', status_code=status.HTTP_201_CREATED, response_model=guard_schemas.GuardResponse)
async def create_guard(payload: guard_schemas.CreateGuardSchema):
    guard = Guard.find_one({'_id': payload.user_id})
    if guard:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Guard already exist')
    new_guard_data = payload.dict()
    new_guard_data['_id'] = payload.user_id  # Assign user_id to _id
    new_guard_data['created_at'] = datetime.utcnow()
    new_guard_data['updated_at'] = new_guard_data['created_at']

    del new_guard_data['user_id']

    Guard.insert_one(new_guard_data)
    return {"status": "success"}


@router.get('/schedule-guards', status_code=status.HTTP_201_CREATED, response_model=guard_schemas.AllGuardsResponse)
async def get_guards_by_schedule_id(payload: guard_schemas.AllGuardsRequest):
    guards = Guard.find({'schedule_id': payload.schedule_id})

    return {"status": "success", "guards": guards}
