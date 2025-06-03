from datetime import datetime
from enum import Enum

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

from .EventTagLink import EventTagLink
from .EventUserLink import EventUserLink


class EventOrganiserType(str, Enum):
    individual = "individual"
    professional = "professional"
    company = "company"
    advertisement = "advertisement"


class EventDTO(BaseModel):
    name: str
    description: str

    organiser_type: EventOrganiserType
    organiser_id: str
    latitude: float
    longitude: float
    max_participants: int | None = None # when none then unlimited
    bonus_points: int = 0

    start_date: datetime
    end_date: datetime


class Event(SQLModel, EventDTO, table=True):
    id: int | None = Field(default=None, primary_key=True)

    created_at: datetime
    updated_at: datetime

    tags: list["Tag"] = Relationship(back_populates="events", link_model=EventTagLink)  # noqa: F821
    attendees: list["User"] = Relationship(back_populates="events", link_model=EventUserLink)  # noqa: F821
