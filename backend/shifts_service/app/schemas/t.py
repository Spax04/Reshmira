from typing import List

from pydantic import BaseModel

from app.schemas.guard_schemas import GuardBaseSchema


class AllGuardsReque(BaseModel):
    guards: List[GuardBaseSchema] = []
