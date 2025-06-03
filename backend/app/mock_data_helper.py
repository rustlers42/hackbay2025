import logging
from datetime import datetime

from sqlmodel import Session, select

from .models import Event, EventOrganiserType, EventParticipationType, EventTagLink, EventUserLink, Organiser, Tag, User
from .oauth2_helper import get_password_hash


def setup_mock_data(session: Session):
    if session.exec(select(User)).first() is None:
        logging.info("creating default users because there are none")
        user = [
            User(
                email="admin@admin.de",
                username="admin",
                hashed_password=get_password_hash("admin"),
                bonus_points=0,
            ),
            User(
                email="user@user.de",
                username="user",
                hashed_password=get_password_hash("user"),
                bonus_points=0,
            ),
        ]
        session.add_all(user)
        session.commit()

    if session.exec(select(Tag)).first() is None:
        logging.info("creating default tags because there are none")
        tag = [
            Tag(name="cycling"),
            Tag(name="running"),
            Tag(name="workshop"),
        ]
        session.add_all(tag)
        session.commit()

    if session.exec(select(Organiser)).first() is None:
        logging.info("creating default organiser because there are none")
        organiser = [
            Organiser(name="REWE", description="REWE is a german company"),
            Organiser(name="stmgp", description="Bayrisches Staatsministerium für Gesundheit, Pflege und Prävention"),
        ]
        session.add_all(organiser)
        session.commit()

    if session.exec(select(Event)).first() is None:
        logging.info("creating default event because there are none")

        user = session.exec(select(User).where(User.username == "user")).first()

        rewe_organiser_id = session.exec(select(Organiser).where(Organiser.name == "REWE")).first().id

        event = [
            Event(
                name="REWE Teamchallenge",
                description="16. REWE Team Challenge Dresden, running with your team",
                organiser_type=EventOrganiserType.company,
                organiser_id=rewe_organiser_id,
                latitude=51.050397,
                longitude=13.731702,
                max_participants=0,
                bonus_points=10,
                start_date=datetime(2025, 5, 28, 17, 0, 0),
                end_date=datetime(2025, 5, 28, 22, 0, 0),
                created_at=datetime(2025, 5, 20, 0, 0, 0),
                updated_at=datetime(2025, 5, 20, 0, 0, 0),
            ),
        ]
        session.add_all(event)
        session.commit()

    if session.exec(select(EventTagLink)).first() is None:
        event = session.exec(select(Event).where(Event.name == "REWE Teamchallenge")).first()
        running_tag = session.exec(select(Tag).where(Tag.name == "running")).first()

        event_tag_link = [
            EventTagLink(event_id=event.id, tag_id=running_tag.id),
        ]
        session.add_all(event_tag_link)
        session.commit()

    if session.exec(select(EventUserLink)).first() is None:
        event = session.exec(select(Event).where(Event.name == "REWE Teamchallenge")).first()
        user = session.exec(select(User).where(User.username == "user")).first()

        event_user_link = [
            EventUserLink(event_id=event.id, user_id=user.id, participation_type=EventParticipationType.accepted),
        ]
        session.add_all(event_user_link)
        session.commit()
