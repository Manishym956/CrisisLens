from fastapi import APIRouter, UploadFile, File
from api.v1.schemas.verification import VerificationRequest, VerificationResponse
from services.ai_verifier import ai_verifier
from services.url_verifier import url_verifier_service
from pydantic import BaseModel

router = APIRouter()

@router.post("/verify-news", response_model=VerificationResponse)
async def verify_news(request: VerificationRequest):
    """
    Verify news using OpenAI, Gemini, and Groq concurrently.
    Returns a consensus and individual model responses.
    """
    result = await ai_verifier.run_verification(request.news)
    return result


class URLVerifyRequest(BaseModel):
    url: str


@router.post("/verify-url")
async def verify_url(request: URLVerifyRequest):
    """
    Verify the legitimacy of a URL/website.
    - Analyzes domain trust signals (HTTPS, TLD, known reputable domains)
    - Scrapes page content and runs AI consensus verification on it
    - Returns a composite trust score and legitimacy verdict
    """
    result = await url_verifier_service.verify_url(request.url)
    return result


@router.post("/verify-image-news")
async def verify_image_news(file: UploadFile = File(...)):
    """
    Verify whether uploaded image-based content is misinformation using
    OpenAI, Gemini, and Groq vision-capable analysis (no DB storage).
    """
    image_bytes = await file.read()
    mime_type = file.content_type or "image/jpeg"
    result = await ai_verifier.run_image_verification(image_bytes, mime_type)
    return result
