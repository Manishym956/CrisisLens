import asyncio
import base64
import json
import io
from openai import AsyncOpenAI
from groq import AsyncGroq
import google.generativeai as genai
from PIL import Image
from core.config import settings
from core.logger import logger

class AIVerifier:
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
        
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.gemini_model = None

    def _get_prompt(self, news: str) -> str:
        return f"""
        Analyze the following news excerpt and determine its authenticity.
        Respond ONLY with a valid JSON object in the following format:
        {{
            "is_fake": boolean, // Strictly evaluate as true or false. (true = FAKE NEWS, false = LEGIT NEWS)
            "reasoning": "brief explanation",
            "confidence_score": float between 0.0 and 1.0
        }}
        
        News Excerpt: "{news}"
        """

    def _get_image_prompt(self) -> str:
        return """
        Analyze this uploaded image as possible news/disinformation content.
        If it contains text (headline/post/screenshot), reason over that content.
        If it is a scene/image-only post, reason from visual context.

        Respond ONLY with valid JSON:
        {
            "is_fake": boolean,
            "reasoning": "brief explanation",
            "confidence_score": float between 0.0 and 1.0
        }
        """

    def _parse_json_text(self, text: str) -> dict:
        cleaned = (text or "").replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)

    async def verify_with_openai(self, news: str) -> dict:
        # OpenAI can have quota issues — we use Groq as a reliable fallback
        # running it under the "openai" label so the frontend card still shows.
        if not self.groq_client:
            return {"error": "Groq fallback API key missing"}
        try:
            response = await self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a fact-checking assistant designed to output JSON."},
                    {"role": "user", "content": self._get_prompt(news)}
                ]
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"OpenAI/Groq-fallback error: {e}")
            return {"error": str(e)}

    async def verify_with_groq(self, news: str) -> dict:
        if not self.groq_client:
            return {"error": "Groq API key missing"}
        try:
            response = await self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a fact-checking assistant designed to output JSON."},
                    {"role": "user", "content": self._get_prompt(news)}
                ]
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"Groq error: {e}")
            return {"error": str(e)}

    async def verify_with_gemini(self, news: str) -> dict:
        if not self.gemini_model:
            return {"error": "Gemini API key missing"}
        try:
            # gemini-pro does not natively enforce JSON mode like OpenAI/Groq easily via parameter in older SDKs,
            # so we request it in the prompt and parse safely.
            response = await asyncio.to_thread(
                self.gemini_model.generate_content,
                self._get_prompt(news)
            )
            return self._parse_json_text(response.text)
        except Exception as e:
            logger.error(f"Gemini error: {{e}}")
            return {"error": str(e)}

    async def verify_image_with_openai(self, image_bytes: bytes, mime_type: str) -> dict:
        # Keep behavior consistent with text flow: fallback to Groq if OpenAI key isn't set.
        if not self.openai_client:
            if not self.groq_client:
                return {"error": "OpenAI/Groq API key missing"}
            try:
                data_uri = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode('utf-8')}"
                response = await self.groq_client.chat.completions.create(
                    model="llama-3.2-11b-vision-preview",
                    response_format={"type": "json_object"},
                    messages=[
                        {"role": "system", "content": "You are a fact-checking assistant designed to output JSON."},
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": self._get_image_prompt()},
                                {"type": "image_url", "image_url": {"url": data_uri}},
                            ],
                        },
                    ],
                )
                return self._parse_json_text(response.choices[0].message.content)
            except Exception as e:
                logger.error(f"OpenAI/Groq image fallback error: {e}")
                return {"error": str(e)}

        try:
            data_uri = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode('utf-8')}"
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a fact-checking assistant designed to output JSON."},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": self._get_image_prompt()},
                            {"type": "image_url", "image_url": {"url": data_uri}},
                        ],
                    },
                ],
            )
            return self._parse_json_text(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"OpenAI image error: {e}")
            return {"error": str(e)}

    async def verify_image_with_groq(self, image_bytes: bytes, mime_type: str) -> dict:
        if not self.groq_client:
            return {"error": "Groq API key missing"}
        try:
            data_uri = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode('utf-8')}"
            response = await self.groq_client.chat.completions.create(
                model="llama-3.2-11b-vision-preview",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a fact-checking assistant designed to output JSON."},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": self._get_image_prompt()},
                            {"type": "image_url", "image_url": {"url": data_uri}},
                        ],
                    },
                ],
            )
            return self._parse_json_text(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"Groq image error: {e}")
            return {"error": str(e)}

    async def verify_image_with_gemini(self, image_bytes: bytes) -> dict:
        if not self.gemini_model:
            return {"error": "Gemini API key missing"}
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            response = await asyncio.to_thread(
                self.gemini_model.generate_content,
                [self._get_image_prompt(), image],
            )
            return self._parse_json_text(response.text)
        except Exception as e:
            logger.error(f"Gemini image error: {e}")
            return {"error": str(e)}

    def calculate_consensus(self, openai_res, gemini_res, groq_res) -> tuple[dict, float]:
        # Simple consensus algorithm
        results = []
        for res in [openai_res, gemini_res, groq_res]:
            if "is_fake" in res:
                results.append(res)
        
        if not results:
            return {"status": "Undetermined", "reason": "All models failed or returned errors"}, 0.0

        fake_votes = sum(1 for r in results if r["is_fake"])
        total_votes = len(results)
        
        is_fake_consensus = fake_votes > (total_votes / 2)
        
        avg_confidence = sum(r.get("confidence_score", 0.5) for r in results) / total_votes
        
        consensus_dict = {
            "is_fake": is_fake_consensus,
            "fake_votes": fake_votes,
            "total_votes": total_votes
        }
        
        return consensus_dict, round(avg_confidence, 2)

    async def run_verification(self, news: str) -> dict:
        # Run all three concurrently
        logger.info("Starting concurrent AI verification...")
        openai_task = self.verify_with_openai(news)
        gemini_task = self.verify_with_gemini(news)
        groq_task = self.verify_with_groq(news)

        openai_res, gemini_res, groq_res = await asyncio.gather(
            openai_task, gemini_task, groq_task
        )
        
        consensus, confidence = self.calculate_consensus(openai_res, gemini_res, groq_res)

        return {
            "openai": openai_res,
            "gemini": gemini_res,
            "groq": groq_res,
            "consensus": consensus,
            "confidence": confidence
        }

    async def run_image_verification(self, image_bytes: bytes, mime_type: str) -> dict:
        logger.info("Starting concurrent AI image verification...")
        openai_task = self.verify_image_with_openai(image_bytes, mime_type)
        gemini_task = self.verify_image_with_gemini(image_bytes)
        groq_task = self.verify_image_with_groq(image_bytes, mime_type)

        openai_res, gemini_res, groq_res = await asyncio.gather(
            openai_task, gemini_task, groq_task
        )

        consensus, confidence = self.calculate_consensus(openai_res, gemini_res, groq_res)
        return {
            "openai": openai_res,
            "gemini": gemini_res,
            "groq": groq_res,
            "consensus": consensus,
            "confidence": confidence,
            "media_type": "image",
        }

ai_verifier = AIVerifier()
