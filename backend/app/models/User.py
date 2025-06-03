from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

from .EventUserLink import EventUserLink


class UserDTO(BaseModel):
    id: int
    email: str
    username: str
    bonus_points: int


class User(SQLModel, UserDTO, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str
    username: str
    hashed_password: str
    bonus_points: int

    events: list["Event"] = Relationship(back_populates="attendees", link_model=EventUserLink)  # noqa: F821
