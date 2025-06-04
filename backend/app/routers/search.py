import json
import logging
from datetime import datetime, timedelta

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

    logging.info(f"events: {events}")

    for event in events:
        if event["weekly"]:
            # get next occurence of the event of this weekday
            # weekday is saved in the start_date as the day of the week for example "Friday"
            # we need to convert this to a datetime object
            weekday = event["start_date"].split(" ")[0]
            # get the next occurence of this weekday
            next_occurence = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            # Convert weekday string to number (0-6, where 0 is Monday)
            weekday_map = {
                "Monday": 0,
                "Tuesday": 1,
                "Wednesday": 2,
                "Thursday": 3,
                "Friday": 4,
                "Saturday": 5,
                "Sunday": 6,
            }
            target_weekday = weekday_map.get(weekday)
            if target_weekday is None:
                event["start_date"] = datetime.fromisoformat(event["start_date"])
                event["end_date"] = datetime.fromisoformat(event["end_date"])
                continue  # Skip invalid weekday

            # Calculate days until next occurrence
            days_until = (target_weekday - next_occurence.weekday()) % 7
            next_occurence += timedelta(days=days_until)

            event["start_date"] = next_occurence
            event["end_date"] = next_occurence
        else:
            event["start_date"] = datetime.fromisoformat(event["start_date"])
            event["end_date"] = datetime.fromisoformat(event["end_date"])

    # filter events by date show only events that are in the future or today
    return [event for event in events if event["start_date"] >= datetime.now()]
