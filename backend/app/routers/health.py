from fastapi import APIRouter, Response, status

router = APIRouter()


@router.get("")
async def health():
    """
    Checks health, returns 200 if healthy
    """
    return Response(content="OK", status_code=status.HTTP_200_OK)
