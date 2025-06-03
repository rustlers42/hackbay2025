from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from ..database import get_session
from ..models import Event, EventOrganiserType

router = APIRouter()


class EventDTO(BaseModel):
    name: str
    description: str

    organiser_type: EventOrganiserType
    organiser_id: str

    latitude: float
    longitude: float

    start_date: datetime
    end_date: datetime


@router.get("", response_model=list[EventDTO])
def get_events(session: Session = Depends(get_session)):
    events = session.exec(select(Event)).all()
    return [
        EventDTO(
            name=event.name,
            description=event.description,
            organiser_type=event.organiser_type,
            organiser_id=event.organiser_id,
            start_date=event.start_date,
            end_date=event.end_date,
            latitude=event.latitude,
            longitude=event.longitude,
        )
        for event in events
    ]


@router.get("/{event_id}", response_model=EventDTO)
def get_event(event_id: int, session: Session = Depends(get_session)):
    event = session.exec(select(Event).where(Event.id == event_id)).one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventDTO(
        name=event.name,
        description=event.description,
        organiser_type=event.organiser_type,
        organiser_id=event.organiser_id,
        start_date=event.start_date,
        end_date=event.end_date,
        latitude=event.latitude,
        longitude=event.longitude,
    )


@router.post("", response_model=EventDTO)
def create_event(event: EventDTO, session: Session = Depends(get_session)):
    event = Event(
        name=event.name,
        description=event.description,
        organiser_type=event.organiser_type,
        organiser_id=event.organiser_id,
        latitude=event.latitude,
        longitude=event.longitude,
        start_date=event.start_date,
        end_date=event.end_date,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    session.add(event)
    session.commit()
    session.refresh(event)
    return EventDTO(
        name=event.name,
        description=event.description,
        organiser_type=event.organiser_type,
        organiser_id=event.organiser_id,
        latitude=event.latitude,
        longitude=event.longitude,
        start_date=event.start_date,
        end_date=event.end_date,
    )
