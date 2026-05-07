from fastapi import APIRouter
from api.v1.schemas.verification import VerificationRequest, VerificationResponse
from services.ai_verifier import ai_verifier

router = APIRouter()

@router.post("/verify-news", response_model=VerificationResponse)
async def verify_news(request: VerificationRequest):
    """
    Verify news using OpenAI, Gemini, and Groq concurrently.
    Returns a consensus and individual model responses.
    """
    result = await ai_verifier.run_verification(request.news)
    return result
