from datetime import datetime
from enum import Enum

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

from .EventTagLink import EventTagLink
from .EventUserLink import EventUserLink


class EventOrganiserType(str, Enum):
    public = "public"  # when public than it means the event is scraped
    individual = "individual"
    professional = "professional"
    company = "company"
    advertisement = "advertisement"


class EventDTO(BaseModel):
    name: str
    description: str

    organiser_type: EventOrganiserType
    organiser_id: str | None = None
    latitude: float
    longitude: float
    url: str | None = None
    max_participants: int | None = None  # when none than unlimited
    bonus_points: int = 0

    start_date: datetime
    end_date: datetime


class Event(SQLModel, EventDTO, table=True):
    id: int | None = Field(default=None, primary_key=True)

    created_at: datetime
    updated_at: datetime

    tags: list["Tag"] = Relationship(back_populates="events", link_model=EventTagLink)  # noqa: F821
    attendees: list["User"] = Relationship(back_populates="events", link_model=EventUserLink)  # noqa: F821
