from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select

from ..database import get_session
from ..models import Event

router = APIRouter()


class EventResponse(BaseModel):
    id: int
    name: str
    description: str
    start_date: datetime
    end_date: datetime


@router.get("/", response_model=list[EventResponse])
def get_events(session: Session = Depends(get_session)):
    events = session.exec(select(Event)).all()
    return [
        EventResponse(
            id=event.id,
            name=event.name,
            description=event.description,
            start_date=event.start_date,
            end_date=event.end_date,
        )
        for event in events
    ]
