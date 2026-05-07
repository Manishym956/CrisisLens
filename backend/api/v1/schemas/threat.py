from pydantic import BaseModel, Field
from typing import List

class ThreatRankingRequest(BaseModel):
    news_text: str = Field(..., description="The content of the news article")
    source_virality_score: float = Field(default=0.5, description="A score from 0.0 to 1.0 representing how fast it is spreading")

class ThreatRankingResponse(BaseModel):
    panic_score: float
    political_score: float
    virality_score: float
    total_threat_score: float
    risk_classification: str = Field(..., description="CRITICAL, HIGH, MEDIUM, LOW")
    matched_panic_keywords: List[str]
    matched_political_keywords: List[str]
