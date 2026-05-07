from fastapi import APIRouter
from api.v1.endpoints import health, verification, threat, news, predictions, deepfake, automation

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(verification.router, prefix="/verification", tags=["verification"])
api_router.include_router(threat.router, prefix="/threat", tags=["threat"])
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(deepfake.router, prefix="/deepfake", tags=["deepfake"])
api_router.include_router(automation.router, prefix="/automation", tags=["automation"])






