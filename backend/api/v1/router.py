from fastapi import APIRouter
from api.v1.endpoints import (
    health, 
    news, 
    predictions, 
    deepfake,
    automation,
    realtime,
    threat,
    verification,
    auth,
    profile
)

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(verification.router, prefix="/verification", tags=["verification"])
api_router.include_router(threat.router, prefix="/threat", tags=["threat"])
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(deepfake.router, prefix="/deepfake", tags=["deepfake"])
api_router.include_router(automation.router, prefix="/automation", tags=["automation"])
api_router.include_router(realtime.router, prefix="/realtime", tags=["realtime"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
