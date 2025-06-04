from datetime import datetime

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

from .EventUserLink import EventUserLink
from .UserTagLink import UserTagLink


class UserPublicDTO(BaseModel):
    """
    Public user data
    """

    email: str
    username: str
    level: float


class UserDTO(UserPublicDTO):
    """
    More not that sensitive user data
    """

    bonus_points: int
    birthday: datetime | None = None
    intensity: int | None = None  # recommended intensity for events in minutes


class User(SQLModel, UserDTO, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str

    events: list["Event"] = Relationship(back_populates="attendees", link_model=EventUserLink)  # noqa: F821
    tags: list["Tag"] = Relationship(back_populates="users", link_model=UserTagLink)  # noqa: F821
