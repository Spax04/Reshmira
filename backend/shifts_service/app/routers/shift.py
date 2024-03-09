from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from app.serializers.shift_serializer import shifts_list_entity
from app.schemas import shift_schemas
from app.database import Shift
from .. import oauth2
from app.schemas.shift_schemas import ShiftBaseSchema

router = APIRouter()


@router.get('/schedule-shifts', response_model=shift_schemas.ListShiftsResponse)
def get_me(schedule: shift_schemas.ListShiftsRequest = Depends(oauth2.require_user())):
    shifts = shifts_list_entity(Shift.find({'schedule_id': ObjectId(str(schedule.schedule_id))}))
    return {"status": "success", "shifts": shifts}

