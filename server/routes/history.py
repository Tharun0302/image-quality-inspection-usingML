from fastapi import APIRouter
from utils.history_manager import get_history

router = APIRouter()

@router.get("")
async def get_image_history():
    history = get_history()
    return {"history": history}
