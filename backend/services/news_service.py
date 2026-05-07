from datetime import datetime, timezone
from database.mongodb import db
from core.config import settings
from services.ai_verifier import ai_verifier
from services.threat_ranker import threat_ranker

class NewsService:
    def __init__(self):
        self.collection_name = "analyzed_news"

    @property
    def collection(self):
        return db.client[settings.MONGO_DB_NAME][self.collection_name]

    async def store_news(self, news_text: str, virality_score: float) -> dict:
        # 1. Run Verification (Level 2)
        verification_result = await ai_verifier.run_verification(news_text)
        
        # 2. Run Threat Ranking (Level 3)
        threat_result = threat_ranker.rank_threat(news_text, virality_score)
        
        # 3. Create Document
        document = {
            "news_text": news_text,
            "virality_score": virality_score,
            "verification_result": verification_result,
            "threat_ranking": threat_result,
            "created_at": datetime.now(timezone.utc)
        }
        
        # 4. Save to MongoDB
        result = await self.collection.insert_one(document)
        document["_id"] = str(result.inserted_id)
        
        return document

    async def get_top_fake_news(self, limit: int = 10):
        # Retrieve top fake news by threat score descending
        # We also filter where consensus says it's fake
        pipeline = [
            {"$match": {"verification_result.consensus.is_fake": True}},
            {"$sort": {"threat_ranking.total_threat_score": -1}},
            {"$limit": limit}
        ]
        
        cursor = self.collection.aggregate(pipeline)
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
            
        return results

    async def search_news(self, query: str, limit: int = 10):
        # Case-insensitive regex search
        cursor = self.collection.find(
            {"news_text": {"$regex": query, "$options": "i"}}
        ).limit(limit)
        
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
            
        return results

news_service = NewsService()
