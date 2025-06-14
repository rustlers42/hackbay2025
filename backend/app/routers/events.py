from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlmodel import Session, select

from ..database import get_session
from ..models import Event, EventDTO, EventParticipationType, EventUserLink, User, UserDTO
from ..oauth2_helper import get_current_user

router = APIRouter()


@router.get("", response_model=list[Event])
def get_events(session: Session = Depends(get_session)):
    events = session.exec(select(Event)).all()
    return [event for event in events if event.start_date >= datetime.today()]


@router.get("/{event_id}", response_model=dict)
def get_event(event_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    event = session.exec(select(Event).where(Event.id == event_id)).one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return {
        "event": event,
        "tags": event.tags,
        "is_participating": any(p.id == current_user.id for p in event.attendees),
        "attendees": [
            UserDTO(
                email=attendee.email,
                username=attendee.username,
                bonus_points=attendee.bonus_points,
                level=attendee.level,
            )
            for attendee in event.attendees
        ],
    }


@router.post("", response_model=Event)
def create_event(event_dto: EventDTO, session: Session = Depends(get_session)):
    # Create Event object from DTO data
    event_data = event_dto.model_dump()
    event = Event(**event_data)

    # Set timestamps
    event.created_at = datetime.now()
    event.updated_at = datetime.now()

    # Handle datetime conversion if they come as strings
    if isinstance(event.start_date, str):
        event.start_date = datetime.fromisoformat(event.start_date)
    if isinstance(event.end_date, str):
        event.end_date = datetime.fromisoformat(event.end_date)

    session.add(event)
    session.commit()
    session.refresh(event)

    # Note: Tag handling would need to be done separately if tags are provided
    # This would require additional logic to handle tag relationships

    return event


@router.put("/{event_id}/participate", response_model=EventUserLink)
def participate_in_event(
    event_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)
):
    # check if the event exists
    event = session.exec(select(Event).where(Event.id == event_id)).one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # check if the user already participated in the event
    event_user_link = session.exec(
        select(EventUserLink).where(EventUserLink.event_id == event_id, EventUserLink.user_id == current_user.id)
    ).one_or_none()
    if event_user_link:
        raise HTTPException(status_code=400, detail="You already participated in this event")

    event_user_link = EventUserLink(
        event_id=event_id, user_id=current_user.id, participation_type=EventParticipationType.accepted
    )
    session.add(event_user_link)
    session.commit()
    session.refresh(event_user_link)
    return event_user_link


@router.delete("/{event_id}/leave", response_model=dict)
def leave_event(
    event_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)
):
    # check if the event exists
    event = session.exec(select(Event).where(Event.id == event_id)).one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # check if the user is actually participating in the event
    event_user_link = session.exec(
        select(EventUserLink).where(EventUserLink.event_id == event_id, EventUserLink.user_id == current_user.id)
    ).one_or_none()
    if not event_user_link:
        raise HTTPException(status_code=400, detail="You are not participating in this event")

    # remove the participation
    session.delete(event_user_link)
    session.commit()

    return Response(status_code=204)
