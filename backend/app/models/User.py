from datetime import date, time
from enum import Enum
from typing import Optional

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

from .EventUserLink import EventUserLink


class FitnessLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    pro = "pro"


class UserDTO(BaseModel):
    email: str
    username: str
    bonus_points: int
    level: float


class User(SQLModel, UserDTO, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str

    bonus_points: int
    level: float

    # Personal information
    first_name: str | None = None
    last_name: str | None = None
    birthday: date | None = None

    # Fitness and activity preferences
    fitness_level: FitnessLevel | None = None
    activities: str | None = None
    start_time: time | None = None
    end_time: time | None = None

    events: list["Event"] = Relationship(back_populates="attendees", link_model=EventUserLink)  # noqa: F821
