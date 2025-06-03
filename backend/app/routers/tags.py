from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..database import get_session
from ..models import Tag

router = APIRouter()


@router.get("", response_model=list[Tag])
async def get_tags(session: Session = Depends(get_session)):
    tags = session.exec(select(Tag)).all()
    return tags


@router.get("/{tag_id}", response_model=Tag)
async def get_tag_by_id(tag_id: int, session: Session = Depends(get_session)):
    tag = session.exec(select(Tag).where(Tag.id == tag_id)).one_or_none()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag


@router.post("", response_model=Tag)
async def create_tag(tag: Tag, session: Session = Depends(get_session)):
    # cleanup the tag name
    tag_name = tag.name.strip().lower()
    tag_name = tag_name.replace(" ", "_")  # replace spaces with underscores

    # check if the tag already exists
    existing_tag = session.exec(select(Tag).where(Tag.name == tag_name)).one_or_none()
    if existing_tag:
        raise HTTPException(status_code=400, detail="Tag already exists")

    tag = Tag(name=tag.name)
    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag
