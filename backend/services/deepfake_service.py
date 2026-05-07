import io
import cv2
import numpy as np
from PIL import Image
from core.logger import logger

class DeepfakeService:
    def __init__(self):
        # 1. Face Detection Setup
        # Using Haar cascades as it's lightweight and runs instantly on CPU
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # 2. HuggingFace Model Setup
        self.model_pipeline = None

    def _load_model(self):
        # Lazy loading to prevent the server from crashing/hanging on startup during the hackathon
        if self.model_pipeline is None:
            from transformers import pipeline
            logger.info("Downloading/Loading HuggingFace Deepfake model... This might take a minute.")
            # device=-1 forces CPU inference. device=0 would use GPU if available.
            self.model_pipeline = pipeline("image-classification", model="prithivMLmods/Deep-Fake-Detector-Model", device=-1)
            logger.info("Deepfake Model loaded successfully!")

    async def analyze_image(self, image_bytes: bytes) -> dict:
        try:
            # Step 1: Detect Faces using OpenCV
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return {"error": "Invalid image format"}

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            num_faces = len(faces)
            
            if num_faces == 0:
                return {
                    "is_deepfake": False,
                    "confidence": 0.0,
                    "faces_detected": 0,
                    "message": "No faces detected to analyze."
                }

            # Step 2: Deepfake Inference
            # We load the model only when the first image is sent to avoid breaking the MVP on slow internet.
            self._load_model()
            
            pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            # Run inference
            results = self.model_pipeline(pil_img)
            
            # The model usually returns [{'label': 'FAKE', 'score': 0.98}, {'label': 'REAL', 'score': 0.02}]
            highest_score_result = max(results, key=lambda x: x['score'])
            
            # Accommodate different model label outputs
            label = highest_score_result['label'].upper()
            is_fake = "FAKE" in label or label == "LABEL_1"
            confidence = highest_score_result['score']

            return {
                "is_deepfake": is_fake,
                "confidence": round(confidence, 4),
                "faces_detected": num_faces,
                "message": f"Analyzed {num_faces} face(s) successfully using HuggingFace Vision Transformer."
            }

        except Exception as e:
            logger.error(f"Deepfake analysis error: {e}")
            return {"error": str(e)}

deepfake_service = DeepfakeService()
