import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.logger import logger
from core.config import settings


class AutomationService:

    # ─────────────────────────────────────────────
    # TIER 1: Emergency Email  (Ranks 1 – 2)
    # ─────────────────────────────────────────────
    async def send_emergency_email(self, news_text: str, rank: int, threat_result: dict) -> dict:
        """Send a priority email via Gmail SMTP to all configured authority recipients."""
        if not all([settings.SMTP_EMAIL, settings.SMTP_PASSWORD, settings.ALERT_EMAIL_RECIPIENTS]):
            logger.warning("[EMAIL] Skipped — SMTP credentials not configured in .env")
            return {"status": "skipped", "reason": "SMTP not configured"}

        recipients = [r.strip() for r in settings.ALERT_EMAIL_RECIPIENTS.split(",") if r.strip()]
        classification = threat_result.get("risk_classification", "CRITICAL")
        snippet = news_text[:300] + ("..." if len(news_text) > 300 else "")

        subject = f"🚨 [CrisisLens] THREAT RANK {rank} | {classification} Misinformation Detected"
        body = f"""
CrisisLens Intelligence — PRIORITY ALERT
=========================================

THREAT RANK : {rank}/10  ({classification})
PANIC SCORE : {threat_result.get('panic_score', 0):.0%}
POLITICAL   : {threat_result.get('political_score', 0):.0%}
VIRALITY    : {threat_result.get('virality_score', 0):.0%}

NEWS EXCERPT
─────────────
{snippet}

MATCHED KEYWORDS
Panic      : {', '.join(threat_result.get('matched_panic_keywords', [])) or 'None'}
Political  : {', '.join(threat_result.get('matched_political_keywords', [])) or 'None'}

─────────────────────────────────────────
This alert was generated automatically by CrisisLens AI.
Immediate verification and response is recommended.
        """.strip()

        try:
            msg = MIMEMultipart()
            msg["From"] = settings.SMTP_EMAIL
            msg["To"] = ", ".join(recipients)
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))

            # Run blocking SMTP in thread pool to avoid blocking event loop
            def _send():
                with smtplib.SMTP("smtp.gmail.com", 587) as server:
                    server.ehlo()
                    server.starttls()
                    server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
                    server.sendmail(settings.SMTP_EMAIL, recipients, msg.as_string())

            await asyncio.get_event_loop().run_in_executor(None, _send)
            logger.info(f"[EMAIL SENT] Rank {rank} alert dispatched to: {recipients}")
            return {"status": "sent", "recipients": recipients}

        except Exception as e:
            logger.error(f"[EMAIL FAILED] {e}")
            return {"status": "error", "message": str(e)}

    # ─────────────────────────────────────────────
    # TIER 2: Discord Post  (Ranks 3 – 6)
    # ─────────────────────────────────────────────
    async def post_to_discord(self, news_text: str, rank: int, threat_result: dict) -> dict:
        """Send a rich embed alert to a Discord channel via webhook."""
        if not settings.DISCORD_WEBHOOK_URL:
            logger.warning("[DISCORD] Skipped — DISCORD_WEBHOOK_URL not configured in .env")
            return {"status": "skipped", "reason": "Discord webhook not configured"}

        classification = threat_result.get("risk_classification", "HIGH")
        snippet = news_text[:300] + ("..." if len(news_text) > 300 else "")
        matched = (
            threat_result.get("matched_panic_keywords", []) +
            threat_result.get("matched_political_keywords", [])
        )

        # Colour: HIGH = orange (16744272), MEDIUM = yellow (16776960)
        colour = 16744272 if rank <= 4 else 16776960

        payload = {
            "username": "CrisisLens AI",
            "avatar_url": "https://img.icons8.com/fluency/48/radar.png",
            "embeds": [{
                "title": f"⚠️ Threat Rank {rank}/10 — {classification} Misinformation Detected",
                "description": f"**News Excerpt**\n> {snippet}",
                "color": colour,
                "fields": [
                    {"name": "🔥 Panic Score",     "value": f"{threat_result.get('panic_score', 0):.0%}",     "inline": True},
                    {"name": "🗳️ Political Score", "value": f"{threat_result.get('political_score', 0):.0%}", "inline": True},
                    {"name": "📡 Virality Score",  "value": f"{threat_result.get('virality_score', 0):.0%}",  "inline": True},
                    {
                        "name": "🔍 Flagged Keywords",
                        "value": ", ".join(matched) if matched else "Pattern-based detection",
                        "inline": False
                    },
                ],
                "footer": {"text": "CrisisLens Intelligence System — Auto-Dispatch"},
                "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
            }]
        }

        try:
            import httpx
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    settings.DISCORD_WEBHOOK_URL,
                    json=payload,
                    timeout=10.0
                )
            if resp.status_code in (200, 204):
                logger.info(f"[DISCORD POSTED] Rank {rank} alert sent to Discord channel.")
                return {"status": "posted"}
            else:
                logger.error(f"[DISCORD FAILED] HTTP {resp.status_code}: {resp.text}")
                return {"status": "error", "code": resp.status_code}
        except Exception as e:
            logger.error(f"[DISCORD FAILED] {e}")
            return {"status": "error", "message": str(e)}

    # ─────────────────────────────────────────────
    # Legacy helpers (kept for manual triggers)
    # ─────────────────────────────────────────────
    async def trigger_webhook(self, webhook_url: str, payload: dict) -> dict:
        import httpx
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(webhook_url, json=payload, timeout=5.0)
                return {"status": "success" if response.status_code < 400 else "failed"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def generate_daily_report(self) -> dict:
        from database.mongodb import db
        collection = db.client[settings.MONGO_DB_NAME]["analyzed_news"]
        cursor = collection.find(
            {"verification_result.consensus.is_fake": True}
        ).sort("threat_ranking.total_threat_score", 1).limit(5)

        report_items = []
        async for doc in cursor:
            rank = doc["threat_ranking"]["total_threat_score"]
            classification = doc["threat_ranking"]["risk_classification"]
            report_items.append(f"- [Rank {rank} | {classification}] {doc['news_text'][:60]}...")

        report_body = "\n".join(report_items) if report_items else "No fake news detected today."
        return {"title": "CrisisLens Daily Threat Report", "body": report_body}


automation_service = AutomationService()
