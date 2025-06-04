from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, field_validator
from sqlmodel import Session, select

from ..database import get_session
from ..models import Event, Tag, User, UserDTO, UserPublicDTO, UserTagLink
from ..oauth2_helper import get_current_user, get_password_hash

router = APIRouter()


class UserPublicWithTagsDTO(UserPublicDTO):
    tags: list[Tag]


class UserWithTagsDTO(UserDTO):
    tags: list[Tag]


class RegistrationRequest(BaseModel):
    # User account fields (optional for now since frontend doesn't include them)
    email: Optional[str] = None
    password: Optional[str] = None
    username: Optional[str] = None

    # Profile fields
    birthday: datetime
    intensity: int
    tags: list[str] = []

    @field_validator("email")
    def validate_email(cls, v):
        if v and "@" not in v:
            raise ValueError("Invalid email format")
        return v.lower() if v else None


class RegistrationResponse(BaseModel):
    message: str
    user: UserDTO


@router.post("/register", response_model=RegistrationResponse)
async def register_user(registration_data: RegistrationRequest, session: Session = Depends(get_session)):
    """
    Register a new user with profile information
    """
    # Generate email and username if not provided
    email = registration_data.email
    username = registration_data.username
    password = registration_data.password or "temppassword123"  # Temporary password

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == email)).first()

    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists")

    # Create user with all information in a single record
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        birthday=registration_data.birthday,
        intensity=registration_data.intensity,
        bonus_points=0,
        level=0.0,
    )
    session.add(user)

    tags = session.exec(select(Tag).where(Tag.name.in_(registration_data.tags))).all()
    user_tags = [UserTagLink(user_id=user.id, tag_id=tag.id) for tag in tags]
    session.add_all(user_tags)

    session.commit()

    return RegistrationResponse(
        message="User registered successfully",
        user=UserDTO(
            email=user.email,
            username=user.username,
            bonus_points=user.bonus_points,
            birthday=user.birthday,
            intensity=user.intensity,
            level=user.level,
            tags=user.tags,
        ),
    )


@router.get("/me", response_model=UserWithTagsDTO)
async def get_users_me(*, current_user: User = Depends(get_current_user)):
    """
    Get the current user
    """
    return UserWithTagsDTO(
        email=current_user.email,
        username=current_user.username,
        bonus_points=current_user.bonus_points,
        birthday=current_user.birthday,
        intensity=current_user.intensity,
        level=current_user.level,
        tags=current_user.tags,
    )


@router.get("/me/events", response_model=list[Event])
async def get_users_meevents(*, current_user: User = Depends(get_current_user)):
    """
    Get the events for the current user
    """
    return current_user.events


@router.get("/leaderboard", response_model=list[UserPublicWithTagsDTO])
async def get_leaderboard(session: Session = Depends(get_session)):
    """
    Get the leaderboard
    """
    return [
        UserPublicWithTagsDTO(
            email=user.email,
            username=user.username,
            level=user.level,
            tags=user.tags,
        )
        for user in session.exec(select(User).order_by(User.level.desc())).all()
    ]
