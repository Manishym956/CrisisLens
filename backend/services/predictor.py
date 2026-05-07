import json
from openai import AsyncOpenAI
from database.mongodb import db
from core.config import settings
from core.logger import logger

class PredictionEngine:
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def generate_predictions(self) -> dict:
        if not self.openai_client:
            return {"error": "OpenAI API key missing for predictions engine"}

        # 1. Fetch recent fake news data from MongoDB
        collection = db.client[settings.MONGO_DB_NAME]["analyzed_news"]
        
        pipeline = [
            {"$match": {"verification_result.consensus.is_fake": True}},
            {"$sort": {"created_at": -1}},
            {"$limit": 30}
        ]
        
        cursor = collection.aggregate(pipeline)
        recent_news = []
        async for doc in cursor:
            recent_news.append(doc["news_text"])

        if not recent_news:
            return {"message": "Not enough data to generate predictions. Add more fake news."}

        news_corpus = "\n".join([f"- {news}" for news in recent_news])

        # 2. Prompt LLM to analyze and predict
        prompt = f"""
        You are an elite Misinformation Intelligence Analyst. 
        Analyze the following recent fake news excerpts and predict emerging trends.
        
        Recent Fake News:
        {news_corpus}
        
        Respond ONLY with a valid JSON object in this exact format:
        {{
            "trending_topics": ["topic1", "topic2"],
            "emerging_threats": [
                {{
                    "category": "string",
                    "predicted_narrative": "string",
                    "confidence_level": "High/Medium/Low",
                    "related_keywords": ["kw1", "kw2"]
                }}
            ],
            "election_misinformation_risk": "string describing risk to upcoming elections",
            "scam_narrative_prediction": "string predicting the next type of scam based on trends",
            "analysis_summary": "overall summary of the current misinformation landscape"
        }}
        """

        try:
            logger.info("Running AI Prediction Engine...")
            response = await self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a cyber threat intelligence AI."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"Prediction engine error: {e}")
            return {"error": str(e)}

prediction_engine = PredictionEngine()
