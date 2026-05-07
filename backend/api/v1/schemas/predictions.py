from pydantic import BaseModel
from typing import List

class PredictionItem(BaseModel):
    category: str
    predicted_narrative: str
    confidence_level: str  # e.g., "High", "Medium", "Low"
    related_keywords: List[str]

class PredictionsResponse(BaseModel):
    trending_topics: List[str]
    emerging_threats: List[PredictionItem]
    election_misinformation_risk: str
    scam_narrative_prediction: str
    analysis_summary: str
