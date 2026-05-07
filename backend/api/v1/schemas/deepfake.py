from pydantic import BaseModel

class DeepfakeResult(BaseModel):
    is_deepfake: bool
    confidence: float
    faces_detected: int
    message: str
