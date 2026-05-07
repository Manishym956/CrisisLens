from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from services.auth_service import auth_service
from database.mongodb import db
from core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/google")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency to get the current authenticated user from the JWT token.
    Protects the route it is injected into.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = auth_service.decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
        
    users_collection = db.client[settings.MONGO_DB_NAME]["users"]
    user = await users_collection.find_one({"email": email})
    
    if user is None:
        raise credentials_exception
        
    # Inject user ID as a string
    user["id"] = str(user["_id"])
    return user
