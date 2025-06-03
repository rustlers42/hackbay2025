from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..database import get_session
from ..models import User, UserDTO
from ..oauth2_helper import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserDTO)
async def get_users_me(*, current_user: User = Depends(get_current_user)):
    """
    Get the current user
    """
    return UserDTO(email=current_user.email, username=current_user.username, bonus_points=current_user.bonus_points)


@router.get("/leaderboard", response_model=list[UserDTO])
async def get_leaderboard(session: Session = Depends(get_session)):
    """
    Get the leaderboard
    """
    return [
        UserDTO(id=user.id, email=user.email, username=user.username, bonus_points=user.bonus_points)
        for user in session.exec(select(User).order_by(User.bonus_points.desc())).all()
    ]
