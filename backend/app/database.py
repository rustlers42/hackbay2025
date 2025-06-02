from sqlmodel import Session, create_engine

from .settings import settings

connect_args = {"check_same_thread": False}
engine = create_engine(settings.database_url, connect_args=connect_args)  # echo=True


def get_session():
    with Session(engine) as session:
        yield session
