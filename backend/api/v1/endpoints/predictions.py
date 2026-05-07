from fastapi import APIRouter
from services.predictor import prediction_engine

router = APIRouter()

@router.get("/", response_model=None)
async def get_predictions():
    """
    Analyzes recent fake news from the database and predicts emerging 
    misinformation trends, scam narratives, and election risks.
    """
    result = await prediction_engine.generate_predictions()
    return result
