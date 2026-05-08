from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from database.mongodb import db
from core.config import settings
from api.deps import get_current_user
from services.automation import automation_service

router = APIRouter()


class ProfileSettingsUpdate(BaseModel):
    threat_push_notifications: bool
    automated_report_dispatch: bool


@router.get("/analytics")
async def get_profile_analytics(current_user=Depends(get_current_user)):
    collection = db.client[settings.MONGO_DB_NAME]["analyzed_news"]
    uid = current_user["id"]

    verified_count = await collection.count_documents({"user_id": uid})
    threats_flagged = await collection.count_documents(
        {"user_id": uid, "verification_result.consensus.is_fake": True}
    )

    # Dynamic "accuracy": average consensus confidence for user verifications
    pipeline = [
        {"$match": {"user_id": uid}},
        {"$group": {"_id": None, "avg_confidence": {"$avg": "$verification_result.confidence"}}},
    ]
    agg = await collection.aggregate(pipeline).to_list(length=1)
    avg_conf = float(agg[0]["avg_confidence"]) if agg and agg[0].get("avg_confidence") is not None else 0.0
    accuracy_rate = round(avg_conf * 100)

    # Active days from account creation to now
    created_at = current_user.get("created_at")
    if isinstance(created_at, datetime):
        active_days = max(1, (datetime.utcnow() - created_at).days + 1)
    else:
        active_days = 1

    settings_obj = current_user.get("settings", {})

    return {
        "verified_count": verified_count,
        "threats_flagged": threats_flagged,
        "accuracy_rate": accuracy_rate,
        "active_days": active_days,
        "settings": {
            "threat_push_notifications": bool(settings_obj.get("threat_push_notifications", True)),
            "automated_report_dispatch": bool(settings_obj.get("automated_report_dispatch", False)),
        },
    }


@router.patch("/settings")
async def update_profile_settings(payload: ProfileSettingsUpdate, current_user=Depends(get_current_user)):
    users_collection = db.client[settings.MONGO_DB_NAME]["users"]
    email = current_user["email"]

    settings_doc = {
        "threat_push_notifications": payload.threat_push_notifications,
        "automated_report_dispatch": payload.automated_report_dispatch,
    }

    await users_collection.update_one(
        {"email": email},
        {"$set": {"settings": settings_doc, "updated_at": datetime.utcnow()}},
    )

    # Requirement: when enabling automated dispatch, send low-threat (7-10) export email
    dispatch_result = None
    if payload.automated_report_dispatch:
        dispatch_result = await automation_service.send_low_threat_export_email(email)

    return {"status": "ok", "settings": settings_doc, "dispatch": dispatch_result}

