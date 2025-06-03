from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class EventOrganiserType(str, Enum):
    individual = "individual"
    professional = "professional"
    company = "company"
    advertisement = "advertisement"


class Event(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str
    description: str

    organiser_type: EventOrganiserType
    organiser_id: str
    latitude: float
    longitude: float

    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: datetime
