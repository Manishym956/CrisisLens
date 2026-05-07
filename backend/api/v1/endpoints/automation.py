from fastapi import APIRouter, BackgroundTasks
from api.v1.schemas.automation import AlertRequest
from services.automation import automation_service

router = APIRouter()

@router.post("/trigger-alert")
async def trigger_alert(request: AlertRequest, background_tasks: BackgroundTasks):
    """
    Triggers an external automation workflow (like Node-RED or Activepieces),
    sends a Discord/Slack webhook, or sends an email based on the threat level.
    Uses BackgroundTasks so the API returns instantly.
    """
    results = {}
    
    # 1. Trigger Generic Webhook (e.g. to Node-RED)
    if request.webhook_url:
        # Run in background to avoid blocking
        background_tasks.add_task(automation_service.send_discord_slack_alert, request.webhook_url, request.message)
        results["webhook"] = "Queued in background"
        
    # 2. Trigger Email
    if request.email_address:
        background_tasks.add_task(automation_service.send_email_alert, request.email_address, request.message)
        results["email"] = "Queued in background"
        
    return {"status": "Automation triggers queued", "tasks": results}

@router.get("/daily-report")
async def get_daily_report():
    """
    Generates a daily report payload that can be fetched by a cron job or automation tool.
    """
    report = await automation_service.generate_daily_report()
    return report
