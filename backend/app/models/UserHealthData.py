from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel

HealthDataType = Enum("HealtDataType", ["steps", "distance", "calories"])


class UserHealthData(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    data_type: HealthDataType
    data: int
    date: datetime

    user_id: int = Field(foreign_key="user.id")
