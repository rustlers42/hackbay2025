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
                level=0.0,
            ),
            User(
                email="user@user.de",
                username="user",
                hashed_password=get_password_hash("user"),
                bonus_points=0,
                level=0.0,
            ),
            User(
                email="john.doe@outlook.com",
                username="John Doe",
                hashed_password=get_password_hash("John"),
                bonus_points=57,
                level=3.4,
            ),
            User(
                email="jane.smith@gmail.com",
                username="Jane Smith",
                hashed_password=get_password_hash("Jane"),
                bonus_points=12,
                level=1.0,
            ),
            User(
                email="alice.johnson@icloud.com",
                username="Alice Johnson",
                hashed_password=get_password_hash("Alice"),
                bonus_points=89,
                level=4.7,
            ),
            User(
                email="bob.brown@gmail.com",
                username="Bob Brown",
                hashed_password=get_password_hash("Bob"),
                bonus_points=25,
                level=2.3,
            ),
            User(
                email="carol.davis@outlook.com",
                username="Carol Davis",
                hashed_password=get_password_hash("Carol"),
                bonus_points=66,
                level=0.5,
            ),
            User(
                email="david.wilson@icloud.com",
                username="David Wilson",
                hashed_password=get_password_hash("David"),
                bonus_points=43,
                level=3.9,
            ),
            User(
                email="emily.moore@gmail.com",
                username="Emily Moore",
                hashed_password=get_password_hash("Emily"),
                bonus_points=100,
                level=4.0,
            ),
            User(
                email="frank.taylor@outlook.com",
                username="Frank Taylor",
                hashed_password=get_password_hash("Frank"),
                bonus_points=5,
                level=0.0,
            ),
            User(
                email="grace.anderson@icloud.com",
                username="Grace Anderson",
                hashed_password=get_password_hash("Grace"),
                bonus_points=78,
                level=2.8,
            ),
            User(
                email="henry.thomas@gmail.com",
                username="Henry Thomas",
                hashed_password=get_password_hash("Henry"),
                bonus_points=34,
                level=1.5,
            ),
        ]
        session.add_all(user)
        session.commit()

    if session.exec(select(Tag)).first() is None:
        logging.info("creating default tags because there are none")
        tag = [
            Tag(name="badminton"),
            Tag(name="running"),
            Tag(name="cycling"),
            Tag(name="yoga"),
            Tag(name="pilates"),
            Tag(name="soccer"),
            Tag(name="basketball"),
            Tag(name="volleyball"),
        ]
        session.add_all(tag)
        session.commit()

    if session.exec(select(Organiser)).first() is None:
        logging.info("creating default organiser because there are none")
        organiser = [
            Organiser(name="REWE", description="REWE is a German company."),
            Organiser(name="Sparkasse", description="Sparkasse is a German company."),
            Organiser(name="DAK Gesundheit", description="DAK Gesundheit is a German company."),
            Organiser(name="Mammutmarsch", description="Mammutmarsch is a running event."),
            Organiser(
                name="Ruderverein Nürnberg",
                description="The Ruderverein Nürnberg von 1880 e.V. is the organizer of the annual Nuremberg Short Distance Regatta of the German Rowing Association in Nuremberg.",
            ),
            Organiser(name="stmgp", description="Bavarian State Ministry for Health, Care and Prevention."),
        ]
        session.add_all(organiser)
        session.commit()

    if session.exec(select(Event)).first() is None:
        logging.info("creating default event because there are none")

        user = session.exec(select(User).where(User.username == "user")).first()

        rewe_organiser_id = session.exec(select(Organiser).where(Organiser.name == "REWE")).first().id
        mammutmarsch_organiser_id = session.exec(select(Organiser).where(Organiser.name == "Mammutmarsch")).first().id
        sparkasse_organiser_id = session.exec(select(Organiser).where(Organiser.name == "Sparkasse")).first().id
        ruderverein_nbg_organiser_id = (
            session.exec(select(Organiser).where(Organiser.name == "Ruderverein Nürnberg")).first().id
        )
        dak_gesundheit_organiser_id = (
            session.exec(select(Organiser).where(Organiser.name == "DAK Gesundheit")).first().id
        )

        event = [
            Event(
                name="REWE Team Challenge",
                description="16th REWE Team Challenge Dresden, running with your team",
                organiser_type=EventOrganiserType.company,
                organiser_id=rewe_organiser_id,
                latitude=51.050397,
                longitude=13.731702,
                url="https://team-challenge-dresden.de",
                max_participants=0,
                bonus_points=10,
                start_date=datetime(2025, 5, 28, 17, 0, 0),
                end_date=datetime(2025, 5, 28, 22, 0, 0),
                created_at=datetime(2025, 5, 20, 0, 0, 0),
                updated_at=datetime(2025, 5, 20, 0, 0, 0),
            ),
            Event(
                name="Mammutmarsch",
                description="For us, it's clear: Nuremberg and Mammutmarsch simply belong together! For our 2026 event, we've put together three beautiful routes for the 30, 42, and 55 KM distances. No matter which route you choose, all three have a lot to offer: One of the absolute highlights is the climb to the historic Imperial Castle - an experience that combines history and adventure. Additionally, a large part of the route takes you directly through the impressive castle moat of the city, where you can experience the fascinating connection between urban flair and picturesque landscapes up close.",
                organiser_type=EventOrganiserType.company,
                organiser_id=mammutmarsch_organiser_id,
                latitude=49.455210209867445,
                longitude=11.077309830727458,
                url="https://mammutmarsch.de/",
                max_participants=0,
                bonus_points=10,
                start_date=datetime(2025, 5, 9, 0, 0, 0),
                end_date=datetime(2025, 5, 9, 0, 0, 0),
                created_at=datetime(2025, 6, 1, 0, 0, 0),
                updated_at=datetime(2025, 6, 1, 0, 0, 0),
            ),
            Event(
                name="Sparkassen Metropolmarathon",
                description="Two cities, numerous competitions, 600 volunteers, 9,000 runners - and YOU in the middle of it all! On June 22, 2025, it's time for 'From the Imperial Castle to the Cloverleaf'!",
                organiser_type=EventOrganiserType.company,
                organiser_id=sparkasse_organiser_id,
                latitude=49.45391579580075,
                longitude=11.077261588412377,
                url="https://metropolmarathon.de",
                max_participants=0,
                bonus_points=10,
                start_date=datetime(2025, 6, 22, 0, 0, 0),
                end_date=datetime(2025, 6, 23, 0, 0, 0),
                created_at=datetime(2025, 6, 1, 0, 0, 0),
                updated_at=datetime(2025, 6, 1, 0, 0, 0),
            ),
            Event(
                name="Short Distance Regatta",
                description="Unlike the races over the normal 2000-meter course, the 'only' 500-meter course of the Short Distance Regatta offers the advantage of fast and concise races, which are started at intervals of just a few minutes, thus providing an incomparable spectacle for spectators of all age groups. On July 12/13, 2025",
                organiser_type=EventOrganiserType.company,
                organiser_id=ruderverein_nbg_organiser_id,
                latitude=49.433557427339736,
                longitude=11.118497007368967,
                url="https://www.rv-nbg.de/regatta/",
                max_participants=0,
                bonus_points=10,
                start_date=datetime(2025, 7, 12, 0, 0, 0),
                end_date=datetime(2025, 7, 13, 0, 0, 0),
                created_at=datetime(2025, 6, 1, 0, 0, 0),
                updated_at=datetime(2025, 6, 1, 0, 0, 0),
            ),
            Event(
                name="B2Run Corporate Run",
                description="The B2Run Corporate Run is a running competition organized by DAK Gesundheit. It takes place on July 22, 2025.",
                organiser_type=EventOrganiserType.company,
                organiser_id=dak_gesundheit_organiser_id,
                latitude=49.42637818095163,
                longitude=11.125750613276734,
                url="https://www.b2run.de/run/de/de/nuernberg/index.html",
                max_participants=0,
                bonus_points=10,
                start_date=datetime(2025, 7, 22, 0, 0, 0),
                end_date=datetime(2025, 7, 22, 0, 0, 0),
                created_at=datetime(2025, 6, 1, 0, 0, 0),
                updated_at=datetime(2025, 6, 1, 0, 0, 0),
            ),
        ]
        session.add_all(event)
        session.commit()

    if session.exec(select(EventTagLink)).first() is None:
        event = session.exec(select(Event).where(Event.name == "REWE Team Challenge")).first()
        running_tag = session.exec(select(Tag).where(Tag.name == "running")).first()

        event_tag_link = [
            EventTagLink(event_id=event.id, tag_id=running_tag.id),
        ]
        session.add_all(event_tag_link)
        session.commit()

    if session.exec(select(EventUserLink)).first() is None:
        event = session.exec(select(Event).where(Event.name == "REWE Team Challenge")).first()
        user = session.exec(select(User).where(User.username == "user")).first()

        event_user_link = [
            EventUserLink(event_id=event.id, user_id=user.id, participation_type=EventParticipationType.accepted),
        ]
        session.add_all(event_user_link)
        session.commit()
