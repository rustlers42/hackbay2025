import json
from datetime import datetime

from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()


class SearchEvent(BaseModel):
    name: str
    description: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    url: str | None = None


@router.get("", response_model=list[SearchEvent])
async def search(*, tags: list[str] = Query(...), location: str | None = Query(None)):
    """
    get currently cached events from the 'database'
    """
    PATH_TO_EVENTS = "res/cached-search-results/"
    events = []
    for tag in tags:
        with open(f"{PATH_TO_EVENTS}/{tag}.json", "r") as f:
            events.extend(json.load(f))

    return events
