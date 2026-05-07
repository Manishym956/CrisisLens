from pydantic import BaseModel, Field
from typing import Dict, Any

class VerificationRequest(BaseModel):
    news: str = Field(..., description="The news text to verify")

class VerificationResponse(BaseModel):
    openai: Dict[str, Any]
    gemini: Dict[str, Any]
    groq: Dict[str, Any]
    consensus: Dict[str, Any]
    confidence: float
