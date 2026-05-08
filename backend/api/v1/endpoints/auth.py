from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from database.mongodb import db
from core.config import settings
from services.auth_service import auth_service
from models.user import UserInDB
from datetime import datetime

router = APIRouter()

class GoogleAuthRequest(BaseModel):
    token: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/google", response_model=AuthResponse)
async def google_auth(request: GoogleAuthRequest):
    """
    Authenticate user with Google OAuth token.
    If the user doesn't exist in our DB, create them.
    Return a local JWT for session management.
    """
    # 1. Verify Google Token
    google_user_info = auth_service.verify_google_token(request.token)
    if not google_user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = google_user_info.get("email")
    name = google_user_info.get("name")
    picture = google_user_info.get("picture")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token missing email",
        )

    users_collection = db.client[settings.MONGO_DB_NAME]["users"]
    
    # 2. Check if user exists in our DB
    user_doc = await users_collection.find_one({"email": email})
    
    if not user_doc:
        # Create new user
        new_user = UserInDB(
            email=email,
            name=name,
            picture=picture,
            role="user"
        )
        payload = new_user.model_dump(by_alias=True, exclude_none=True)
        payload["settings"] = {
            "threat_push_notifications": True,
            "automated_report_dispatch": False,
        }
        result = await users_collection.insert_one(payload)
        user_doc = await users_collection.find_one({"_id": result.inserted_id})
    else:
        # Optionally update user info if changed (like picture)
        await users_collection.update_one(
            {"email": email},
            {"$set": {"name": name, "picture": picture, "last_login": datetime.utcnow()}}
        )
        user_doc["name"] = name
        user_doc["picture"] = picture
        if "settings" not in user_doc:
            default_settings = {
                "threat_push_notifications": True,
                "automated_report_dispatch": False,
            }
            await users_collection.update_one({"email": email}, {"$set": {"settings": default_settings}})
            user_doc["settings"] = default_settings

    # Convert ObjectId to string for JWT and response
    user_id = str(user_doc.get("_id"))
    
    # 3. Create local JWT
    access_token = auth_service.create_access_token(
        data={"sub": email, "user_id": user_id, "role": user_doc.get("role", "user")}
    )
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": user_doc.get("role", "user")
        }
    )
