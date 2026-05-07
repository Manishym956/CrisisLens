from fastapi import APIRouter, File, UploadFile
from api.v1.schemas.deepfake import DeepfakeResult
from services.deepfake_service import deepfake_service

router = APIRouter()

@router.post("/detect", response_model=DeepfakeResult)
async def detect_deepfake(file: UploadFile = File(...)):
    """
    Upload an image to detect if the faces within it are deepfaked.
    Uses OpenCV for face extraction and HuggingFace for inference.
    """
    # Read the file bytes
    image_bytes = await file.read()
    
    # Analyze the image
    result = await deepfake_service.analyze_image(image_bytes)
    return result
