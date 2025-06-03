from sqlmodel import Field, SQLModel


class EventTagLink(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    event_id: int = Field(foreign_key="event.id")
    tag_id: int = Field(foreign_key="tag.id")
