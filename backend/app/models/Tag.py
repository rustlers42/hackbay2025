from sqlmodel import Field, Relationship, SQLModel

from .EventTagLink import EventTagLink


class Tag(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str

    events: list["Event"] = Relationship(back_populates="tags", link_model=EventTagLink)  # noqa: F821
