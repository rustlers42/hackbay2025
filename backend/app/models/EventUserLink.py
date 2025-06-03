from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class EventParticipationType(str, Enum):
    accepted = "accepted"
    tentative = "tentative"
    organiser = "organiser"
    participated = "participated"
    not_participated = "not_participated"


class EventUserLink(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participation_type: EventParticipationType
    date: datetime | None
    score: int | None

    event_id: int = Field(foreign_key="event.id")
    user_id: int = Field(foreign_key="user.id")
