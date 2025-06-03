from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel

EventParticipationType = Enum("EventParticipationType", ["accepted", "tentative", "participated"])


class EventUserLink(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participation_type: EventParticipationType
    date: datetime | None
    score: int | None

    event_id: int = Field(foreign_key="event.id")
    user_id: int = Field(foreign_key="user.id")
