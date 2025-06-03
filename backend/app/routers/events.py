from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..database import get_session
from ..models import Event, EventParticipationType, EventTagLink, EventUserLink, User, UserDTO
from ..oauth2_helper import get_current_user

router = APIRouter()


@router.get("", response_model=list[Event])
def get_events(session: Session = Depends(get_session)):
    events = session.exec(select(Event)).all()
    return events


@router.get("/{event_id}", response_model=dict)
def get_event(event_id: int, session: Session = Depends(get_session)):
    event = session.exec(select(Event).where(Event.id == event_id)).one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return {
        "event": event,
        "tags": event.tags,
        "attendees": [
            UserDTO(
                id=attendee.id, email=attendee.email, username=attendee.username, bonus_points=attendee.bonus_points
            )
            for attendee in event.attendees
        ],
    }


@router.post("", response_model=Event)
def create_event(event: Event, session: Session = Depends(get_session)):
    event.created_at = datetime.now()
    event.updated_at = datetime.now()
    session.add(event)

    # store the tags in the database
    event_tag_link = [EventTagLink(event_id=event.id, tag_id=tag_id) for tag_id in event.tags_ids]
    session.add_all(event_tag_link)

    session.commit()
    session.refresh(event)
    return event


@router.put("{event_id}/participate", response_model=EventUserLink)
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
