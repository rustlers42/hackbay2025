from sqlmodel import Field, SQLModel


class UserTagLink(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.id")
    tag_id: int = Field(foreign_key="tag.id")
