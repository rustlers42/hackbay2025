from datetime import date, time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, validator
from sqlmodel import Session, select

from ..database import get_session
from ..models import User, UserDTO, FitnessLevel
from ..oauth2_helper import get_current_user, get_password_hash

router = APIRouter()


class RegistrationRequest(BaseModel):
    # User account fields (optional for now since frontend doesn't include them)
    email: Optional[str] = None
    password: Optional[str] = None
    username: Optional[str] = None
    
    # Profile fields
    firstName: str
    lastName: str
    birthday: str  # Will be converted to date
    insuranceProvider: str
    insuranceNumber: str
    fitnessLevel: Optional[FitnessLevel] = None
    activities: Optional[str] = None
    location: Optional[str] = None
    startTime: Optional[str] = None  # Will be converted to time
    endTime: Optional[str] = None    # Will be converted to time
    
    @validator('insuranceNumber')
    def validate_insurance_number(cls, v):
        if not v or len(v) != 10 or not v[0].isalpha() or not v[1:].isdigit():
            raise ValueError('Insurance number must be in format A123456789')
        return v.upper()
    
    @validator('email')
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower() if v else None


class RegistrationResponse(BaseModel):
    message: str
    user: UserDTO


@router.post("/register", response_model=RegistrationResponse)
async def register_user(
    registration_data: RegistrationRequest,
    session: Session = Depends(get_session)
):
    """
    Register a new user with profile information
    """
    # Generate email and username if not provided
    email = registration_data.email
    username = registration_data.username
    password = registration_data.password or "temppassword123"  # Temporary password
    
    if not email:
        # Generate email based on name and insurance number
        email = f"{registration_data.firstName.lower()}.{registration_data.lastName.lower()}@temp.com"
    
    if not username:
        # Generate username based on name
        username = f"{registration_data.firstName.lower()}{registration_data.lastName.lower()}"
    
    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Check if username is taken and append number if needed
    base_username = username
    counter = 1
    while True:
        existing_username = session.exec(
            select(User).where(User.username == username)
        ).first()
        
        if not existing_username:
            break
            
        username = f"{base_username}{counter}"
        counter += 1
    
    # Parse and validate all data before creating any database records
    try:
        birthday = date.fromisoformat(registration_data.birthday)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid birthday format. Use YYYY-MM-DD"
        )
    
    start_time = None
    end_time = None
    
    if registration_data.startTime:
        try:
            start_time = time.fromisoformat(registration_data.startTime)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid start time format. Use HH:MM"
            )
    
    if registration_data.endTime:
        try:
            end_time = time.fromisoformat(registration_data.endTime)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid end time format. Use HH:MM"
            )
    
    # Create user with all information in a single record
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        bonus_points=0,
        # Personal information
        first_name=registration_data.firstName,
        last_name=registration_data.lastName,
        birthday=birthday,
        # Insurance information
        insurance_provider=registration_data.insuranceProvider,
        insurance_number=registration_data.insuranceNumber,
        # Fitness and activity preferences
        fitness_level=registration_data.fitnessLevel,
        activities=registration_data.activities,
        location=registration_data.location,
        start_time=start_time,
        end_time=end_time
    )
    
    session.add(user)
    # Single commit - everything succeeds or fails together
    session.commit()
    
    return RegistrationResponse(
        message="User registered successfully",
        user=UserDTO(
            email=user.email,
            username=user.username,
            bonus_points=user.bonus_points
        )
    )


@router.get("/me", response_model=UserDTO)
async def get_users_me(*, current_user: User = Depends(get_current_user)):
    """
    Get the current user
    """
    return UserDTO(id=current_user.id, email=current_user.email, username=current_user.username, bonus_points=current_user.bonus_points)


@router.get("/leaderboard", response_model=list[UserDTO])
async def get_leaderboard(session: Session = Depends(get_session)):
    """
    Get the leaderboard
    """
    return [
        UserDTO(email=user.email, username=user.username, bonus_points=user.bonus_points)
        for user in session.exec(select(User).order_by(User.bonus_points.desc())).all()
    ]
