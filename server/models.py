from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TaskIn(BaseModel):
    name: str
    cron: str
    next_run: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class TaskOut(BaseModel):
    id: str = Field(alias="_id")
    name: str
    cron: str
    next_run: Optional[datetime]
    start_date: Optional[datetime]
    end_date: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
