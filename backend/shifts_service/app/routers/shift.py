from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from app.serializers.user_serializer import user_response_entity

from app.database import Guard
from .. import oauth2
from app.schemas.shift_schemas import ShiftBaseSchema

router = APIRouter()


@router.get('/me', response_model=schemas.GuardResponse)
def get_me(user_id: str = Depends(oauth2.require_user)):
    user = user_response_entity(User.find_one({'_id': ObjectId(str(user_id))}))
    return {"status": "success", "user": user}

