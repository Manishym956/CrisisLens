from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class NewsStoreRequest(BaseModel):
    news_text: str = Field(..., description="The content of the news article")
    source_virality_score: float = Field(default=0.5, description="A score from 0.0 to 1.0 representing how fast it is spreading")

class NewsItem(BaseModel):
    id: str = Field(alias="_id")
    news_text: str
    virality_score: float
    verification_result: Dict[str, Any]
    threat_ranking: Dict[str, Any]
    user_id: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
