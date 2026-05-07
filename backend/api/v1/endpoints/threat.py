from fastapi import APIRouter
from api.v1.schemas.threat import ThreatRankingRequest, ThreatRankingResponse
from services.threat_ranker import threat_ranker

router = APIRouter()

@router.post("/rank-threat", response_model=ThreatRankingResponse)
async def rank_threat(request: ThreatRankingRequest):
    """
    Ranks the threat level of a given news excerpt based on panic keywords,
    political sensitivity, and a provided virality score.
    Returns the classification (CRITICAL, HIGH, MEDIUM, LOW).
    """
    result = threat_ranker.rank_threat(request.news_text, request.source_virality_score)
    return result
