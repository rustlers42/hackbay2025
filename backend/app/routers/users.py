from fastapi import APIRouter, Depends
from pydantic import BaseModel

from ..models import User
from ..oauth2_helper import get_current_user

router = APIRouter()


class UserResponse(BaseModel):
    email: str
    username: str


class UserScoreResponse(BaseModel):
    username: str
    score: int


@router.get("/me", response_model=UserResponse)
async def get_users_me(*, current_user: User = Depends(get_current_user)):
    """
    Get the current user
    """
    return UserResponse(email=current_user.email, username=current_user.username)
