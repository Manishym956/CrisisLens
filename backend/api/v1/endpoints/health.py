from fastapi import APIRouter
from core.logger import logger
from database.mongodb import db
from core.config import settings

router = APIRouter()

@router.get("/")
async def health_check():
    logger.info("Health check endpoint called")
    db_status = "connected" if db.client else "disconnected"
    return {
        "status": "ok",
        "project": settings.PROJECT_NAME,
        "database_status": db_status
    }
