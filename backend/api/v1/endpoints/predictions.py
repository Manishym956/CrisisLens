from fastapi import APIRouter
from services.predictor import prediction_engine

router = APIRouter()

@router.get("/", response_model=None)
async def get_predictions():
    """
    Full ML predictions: top fake today, narrative clusters,
    emerging threats, and Groq LLM intelligence summary.
    """
    return await prediction_engine.generate_predictions()


@router.get("/insights", response_model=None)
async def get_insights():
    """Alias for the predictions dashboard — same payload."""
    return await prediction_engine.generate_predictions()
