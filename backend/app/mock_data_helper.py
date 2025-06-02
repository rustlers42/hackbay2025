import logging

from sqlmodel import Session, select

from .models import User
from .oauth2_helper import get_password_hash


def setup_mock_data(session: Session):
    if session.exec(select(User)).first() is None:
        logging.info("creating default users because there are none")
        user = [
            User(
                email="admin@admin.de",
                username="admin",
                hashed_password=get_password_hash("admin"),
                score=0,
            )
        ]
        session.add_all(user)
        session.commit()
