from datetime import datetime

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

from .EventUserLink import EventUserLink
from .UserTagLink import UserTagLink


class UserDTO(BaseModel):
    """
    Public user data
    """

    email: str
    username: str
    bonus_points: int
    level: float

    interests: str | None = None


class User(SQLModel, UserDTO, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str

    bonus_points: int
    level: float

    # Personal information
    birthday: datetime | None = None

    intensity: int | None = None

    events: list["Event"] = Relationship(back_populates="attendees", link_model=EventUserLink)  # noqa: F821
    tags: list["Tag"] = Relationship(back_populates="users", link_model=UserTagLink)  # noqa: F821
