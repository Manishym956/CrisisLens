import httpx
from core.logger import logger
from database.mongodb import db
from core.config import settings

class AutomationService:
    async def trigger_webhook(self, webhook_url: str, payload: dict) -> dict:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(webhook_url, json=payload, timeout=5.0)
                if response.status_code in [200, 201, 202, 204]:
                    logger.info(f"Webhook triggered successfully: {webhook_url}")
                    return {"status": "success", "message": "Webhook delivered"}
                else:
                    return {"status": "failed", "message": f"Webhook returned status {response.status_code}"}
        except Exception as e:
            logger.error(f"Webhook error: {e}")
            return {"status": "error", "message": str(e)}

    async def send_discord_slack_alert(self, webhook_url: str, message: str) -> dict:
        # Both Slack and Discord accept simple JSON payloads like {"content": "..."} or {"text": "..."}
        payload = {"content": f"🚨 **CRISIS ALERT** 🚨\n{message}", "text": f"🚨 *CRISIS ALERT* 🚨\n{message}"}
        return await self.trigger_webhook(webhook_url, payload)

    async def send_email_alert(self, to_email: str, message: str) -> dict:
        # For Hackathon MVP, we mock the email send or use a basic SMTP setup
        # Real implementation would use SendGrid, Mailgun, or standard SMTP
        logger.info(f"Simulating email sent to {to_email}: {message}")
        return {"status": "success", "message": f"Simulated email sent to {to_email}"}

    async def generate_daily_report(self) -> dict:
        # Fetches top fake news and compiles a report payload
        collection = db.client[settings.MONGO_DB_NAME]["analyzed_news"]
        cursor = collection.find({"verification_result.consensus.is_fake": True}).sort("threat_ranking.total_threat_score", -1).limit(5)
        
        report_items = []
        async for doc in cursor:
            report_items.append(f"- [Threat: {doc['threat_ranking']['risk_classification']}] {doc['news_text'][:50]}...")
            
        report_body = "\n".join(report_items) if report_items else "No fake news detected today."
        
        return {
            "title": "CrisisLens Daily Threat Report",
            "body": report_body
        }

automation_service = AutomationService()
