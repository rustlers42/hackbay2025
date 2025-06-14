from sqlmodel import Field, Relationship, SQLModel

from .EventTagLink import EventTagLink
from .UserTagLink import UserTagLink


class Tag(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    emoji: str | None = Field(default=None, description="Emoji to display with the tag")

    events: list["Event"] = Relationship(back_populates="tags", link_model=EventTagLink)  # noqa: F821
    users: list["User"] = Relationship(back_populates="tags", link_model=UserTagLink)  # noqa: F821
