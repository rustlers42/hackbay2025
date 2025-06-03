from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from ..database import get_session
from ..oauth2_helper import Token, authenticate_user, create_access_token
from ..settings import settings
from .events import router as events_router
from .health import router as health_router
from .search import router as search_router
from .tags import router as tags_router
from .users import RegistrationRequest, RegistrationResponse, register_user
from .users import router as users_router

router = APIRouter()
router.include_router(events_router, prefix="/events", tags=["events"])
router.include_router(tags_router, prefix="/tags", tags=["tags"])
router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(search_router, prefix="/search", tags=["search"])


@router.post("/register", response_model=RegistrationResponse, tags=["auth"])
async def register(registration_data: RegistrationRequest, session: Session = Depends(get_session)):
    """
    Register endpoint at root level to match frontend expectations
    """
    return await register_user(registration_data, session)


@router.post("/token", tags=["auth"])
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session),
) -> Token:
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(data={"email": user.email}, expires_delta=access_token_expires)
    return Token(access_token=access_token, token_type="bearer")
