from datetime import datetime, timezone
import re
from urllib.parse import quote_plus
import httpx
from database.mongodb import db
from core.config import settings
from core.logger import logger
from services.ai_verifier import ai_verifier
from services.threat_ranker import threat_ranker
from services.websocket_manager import manager

class NewsService:
    def __init__(self):
        self.collection_name = "analyzed_news"

    @property
    def collection(self):
        return db.client[settings.MONGO_DB_NAME][self.collection_name]

    async def store_news(self, news_text: str, virality_score: float, user_id: str = None) -> dict:
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
            "user_id": user_id,
            "created_at": datetime.now(timezone.utc)
        }
        
        # 4. Save to MongoDB
        result = await self.collection.insert_one(document)
        document["_id"] = str(result.inserted_id)

        # 5. Auto-Dispatch based on Threat Rank
        rank = threat_result.get("total_threat_score", 10)
        is_fake = verification_result.get("consensus", {}).get("is_fake", False)

        if is_fake:
            if rank <= 2:
                # CRITICAL — Fire emergency email immediately in background
                from services.automation import automation_service
                import asyncio
                asyncio.ensure_future(
                    automation_service.send_emergency_email(news_text, rank, threat_result)
                )
                logger.info(f"[DISPATCH] Rank {rank} — Emergency email queued.")

            elif rank <= 6:
                # HIGH/MEDIUM — Post to Discord in background
                from services.automation import automation_service
                import asyncio
                asyncio.ensure_future(
                    automation_service.post_to_discord(news_text, rank, threat_result)
                )
                logger.info(f"[DISPATCH] Rank {rank} — Discord post queued.")
            elif rank >= 7:
                # LOW — optional user-level automated export dispatch
                try:
                    from bson import ObjectId
                    users_collection = db.client[settings.MONGO_DB_NAME]["users"]
                    user_doc = None
                    if user_id:
                        user_doc = await users_collection.find_one({"_id": ObjectId(user_id)})
                    if user_doc and user_doc.get("settings", {}).get("automated_report_dispatch", False):
                        recipient = user_doc.get("email")
                        if recipient:
                            from services.automation import automation_service
                            import asyncio
                            asyncio.ensure_future(
                                automation_service.send_low_threat_export_email(recipient)
                            )
                            logger.info(f"[DISPATCH] Rank {rank} — Low-threat export email queued for {recipient}.")
                except Exception as e:
                    logger.error(f"[DISPATCH] Low-threat export dispatch check failed: {e}")

        # 6. Broadcast to all connected WebSocket clients
        if is_fake:
            await manager.broadcast("new_fake_news_alert", document)

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

    async def get_live_google_feed(self, limit: int = 5, query: str = "fake news OR misinformation"):
        """
        Fetch top Google News RSS items in-memory (no DB writes).
        """
        url = (
            "https://news.google.com/rss/search"
            f"?q={quote_plus(query)}&hl=en-IN&gl=IN&ceid=IN:en"
        )
        headers = {"User-Agent": "CrisisLens/1.0"}
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return []

            xml = resp.text
            items = re.findall(r"<item>(.*?)</item>", xml, re.DOTALL)
            parsed = []
            for item in items[: max(1, min(limit, 20))]:
                title_m = re.search(r"<title[^>]*><!\[CDATA\[(.*?)\]\]></title>|<title[^>]*>(.*?)</title>", item, re.DOTALL)
                link_m = re.search(r"<link>(.*?)</link>", item, re.DOTALL)
                pub_m = re.search(r"<pubDate>(.*?)</pubDate>", item, re.DOTALL)
                source_m = re.search(r"<source[^>]*>(.*?)</source>", item, re.DOTALL)

                title = (title_m.group(1) or title_m.group(2) or "").strip() if title_m else ""
                title = re.sub(r"<[^>]+>", " ", title).strip()
                link = link_m.group(1).strip() if link_m else ""
                published_at = pub_m.group(1).strip() if pub_m else ""
                source = re.sub(r"<[^>]+>", " ", source_m.group(1)).strip() if source_m else "Google News"

                if not title:
                    continue
                parsed.append(
                    {
                        "title": title,
                        "url": link,
                        "source": source,
                        "published_at": published_at,
                    }
                )
            return parsed
        except Exception as e:
            logger.error(f"Google live feed fetch failed: {e}")
            return []

news_service = NewsService()
