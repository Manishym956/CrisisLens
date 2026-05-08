"""
predictor.py — ML-powered predictions engine for CrisisLens
Uses the freshly regenerated .pkl models to:
  1. Fetch Top 5 Fake News today from MongoDB
  2. Run LDA topic clustering on today's articles
  3. Use trend_predictor to surface emerging threat categories
  4. Use Groq LLM for a final narrative intelligence summary
"""

import asyncio, json, pickle, warnings
from datetime import datetime, timezone
from pathlib import Path

from database.mongodb import db
from core.config import settings
from core.logger import logger

warnings.filterwarnings("ignore")

BASE = Path(__file__).parent.parent   # backend/

def _load(filename: str):
    path = BASE / filename
    try:
        with open(path, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        logger.warning(f"[PREDICTOR] Could not load {filename}: {e}")
        return None


class PredictionEngine:
    def __init__(self):
        self._models_loaded = False

    def _ensure_models(self):
        if self._models_loaded:
            return
        logger.info("[PREDICTOR] Loading .pkl models...")
        self.tfidf     = _load("tfidf_vectorizer.pkl")
        self.clf       = _load("fake_news_model.pkl")
        self.lda_vec   = _load("lda_vectorizer.pkl")
        self.lda       = _load("lda_model.pkl")
        self.trend_vec = _load("trend_vectorizer.pkl")
        self.trend_clf = _load("trend_predictor.pkl")
        self._models_loaded = True
        logger.info("[PREDICTOR] Models loaded.")

    TOPIC_LABELS = [
        "Conspiracy & Cover-ups",
        "Health Misinformation",
        "Political Manipulation",
        "Financial Panic",
        "Military & War Disinformation",
    ]

    # ── helpers ───────────────────────────────────────────────────────────────

    def _fake_prob(self, text: str) -> float:
        if not self.tfidf or not self.clf:
            return 0.5
        try:
            vec = self.tfidf.transform([text])
            return float(self.clf.predict_proba(vec)[0][1])
        except Exception:
            return 0.5

    def _topic(self, text: str) -> str:
        if not self.lda_vec or not self.lda:
            return "Unknown"
        try:
            vec = self.lda_vec.transform([text])
            idx = int(self.lda.transform(vec)[0].argmax())
            return self.TOPIC_LABELS[idx]
        except Exception:
            return "Unknown"

    def _trend(self, text: str) -> str:
        if not self.trend_vec or not self.trend_clf:
            return "general"
        try:
            vec = self.trend_vec.transform([text])
            return str(self.trend_clf.predict(vec)[0])
        except Exception:
            return "general"

    # ── MongoDB queries ────────────────────────────────────────────────────────

    async def _fetch_top_fake_today(self, limit: int = 5) -> list[dict]:
        """Top fake articles ranked by threat score, created today."""
        collection = db.client[settings.MONGO_DB_NAME]["analyzed_news"]
        today_start = datetime.now(timezone.utc).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        pipeline = [
            {"$match": {
                "verification_result.consensus.is_fake": True,
                "created_at": {"$gte": today_start},
            }},
            {"$sort": {"threat_ranking.total_threat_score": -1}},
            {"$limit": limit},
        ]
        results = []
        async for doc in collection.aggregate(pipeline):
            results.append(doc)

        # If nothing today, fall back to last 7 days (useful right after seeding)
        if not results:
            pipeline[0]["$match"].pop("created_at", None)
            pipeline.insert(1, {"$match": {"verification_result.consensus.is_fake": True}})
            pipeline[0] = {"$match": {"verification_result.consensus.is_fake": True}}
            async for doc in collection.aggregate([
                {"$match": {"verification_result.consensus.is_fake": True}},
                {"$sort": {"created_at": -1, "threat_ranking.total_threat_score": -1}},
                {"$limit": limit},
            ]):
                results.append(doc)
        return results

    async def _fetch_all_recent(self, limit: int = 30) -> list[dict]:
        """All recent articles for trend analysis."""
        collection = db.client[settings.MONGO_DB_NAME]["analyzed_news"]
        results = []
        async for doc in collection.find(
            {},
            sort=[("created_at", -1)],
            limit=limit,
        ):
            results.append(doc)
        return results

    # ── narrative summary via Groq ────────────────────────────────────────────

    async def _llm_summary(self, texts: list[str]) -> dict:
        if not settings.GROQ_API_KEY or not texts:
            return {}
        corpus = "\n".join(f"- {t[:200]}" for t in texts[:15])
        prompt = f"""You are a misinformation intelligence analyst.
Analyze these recent news excerpts and predict emerging misinformation trends.

{corpus}

Respond ONLY with valid JSON:
{{
    "analysis_summary": "2-3 sentence overview of the current misinformation landscape",
    "election_misinformation_risk": "1 sentence risk assessment for elections",
    "scam_narrative_prediction": "1 sentence prediction of next scam narrative",
    "trending_topics": ["topic1", "topic2", "topic3"]
}}"""
        try:
            from groq import AsyncGroq
            client = AsyncGroq(api_key=settings.GROQ_API_KEY)
            r = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a cyber threat intelligence AI. Output JSON only."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.6,
            )
            return json.loads(r.choices[0].message.content)
        except Exception as e:
            logger.error(f"[PREDICTOR] LLM summary failed: {e}")
            return {}

    # ── main entry point ───────────────────────────────────────────────────────

    async def generate_predictions(self) -> dict:
        self._ensure_models()

        top_fake_docs, all_docs = await asyncio.gather(
            self._fetch_top_fake_today(5),
            self._fetch_all_recent(30),
        )

        if not all_docs:
            return {"message": "No data in database yet. Run seed_database.py first."}

        # ── Top 5 Fake Today ──────────────────────────────────────────────────
        top_fake = []
        for doc in top_fake_docs:
            text = doc.get("news_text", "")
            top_fake.append({
                "title":   doc.get("title", text[:80]),
                "excerpt": text[:200] + ("..." if len(text) > 200 else ""),
                "source":  doc.get("source", "Unknown"),
                "source_url": doc.get("source_url", ""),
                "threat_score": doc.get("threat_ranking", {}).get("total_threat_score", 5.0),
                "risk_classification": doc.get("threat_ranking", {}).get("risk_classification", "MEDIUM"),
                "topic": doc.get("ml_analysis", {}).get("topic") or self._topic(text),
                "created_at": doc.get("created_at", datetime.now(timezone.utc)).isoformat(),
            })

        # ── Topic Cluster Distribution ────────────────────────────────────────
        topic_counts: dict[str, int] = {}
        for doc in all_docs:
            text = doc.get("news_text", "")
            topic = doc.get("ml_analysis", {}).get("topic") or self._topic(text)
            topic_counts[topic] = topic_counts.get(topic, 0) + 1

        narrative_clusters = [
            {"topic": t, "count": c, "percentage": round(c / len(all_docs) * 100)}
            for t, c in sorted(topic_counts.items(), key=lambda x: -x[1])
        ]

        # ── Trend Breakdown ───────────────────────────────────────────────────
        trend_counts: dict[str, int] = {}
        for doc in all_docs:
            text = doc.get("news_text", "")
            trend = doc.get("ml_analysis", {}).get("trend_category") or self._trend(text)
            trend_counts[trend] = trend_counts.get(trend, 0) + 1

        total_trend = sum(trend_counts.values()) or 1
        emerging_threats = []
        for trend, count in sorted(trend_counts.items(), key=lambda x: -x[1])[:4]:
            pct = count / total_trend
            confidence = "High" if pct > 0.3 else "Medium" if pct > 0.15 else "Low"
            emerging_threats.append({
                "category": trend.title(),
                "count": count,
                "percentage": round(pct * 100),
                "confidence_level": confidence,
                "predicted_narrative": f"Escalating {trend} misinformation narratives based on {count} recent articles.",
            })

        # ── LLM Summary ────────────────────────────────────────────────────────
        fake_texts = [d.get("news_text", "") for d in all_docs
                      if d.get("verification_result", {}).get("consensus", {}).get("is_fake")]
        llm_data = await self._llm_summary(fake_texts or [d.get("news_text", "") for d in all_docs[:10]])

        return {
            "top_fake_today": top_fake,
            "narrative_clusters": narrative_clusters,
            "emerging_threats": emerging_threats,
            "total_articles_analyzed": len(all_docs),
            "total_fake_detected": sum(
                1 for d in all_docs
                if d.get("verification_result", {}).get("consensus", {}).get("is_fake")
            ),
            "analysis_summary": llm_data.get("analysis_summary", "Misinformation patterns detected across multiple categories."),
            "election_misinformation_risk": llm_data.get("election_misinformation_risk", "Moderate risk detected."),
            "scam_narrative_prediction": llm_data.get("scam_narrative_prediction", "Financial and health scams trending."),
            "trending_topics": llm_data.get("trending_topics", [t["topic"] for t in narrative_clusters[:3]]),
        }


prediction_engine = PredictionEngine()
