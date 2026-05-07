from google.oauth2 import id_token
from google.auth.transport import requests
from core.config import settings
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class AuthService:
    def verify_google_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verifies the Google OAuth token and returns user info if valid.
        """
        try:
            # Specify the CLIENT_ID of the app that accesses the backend
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), settings.GOOGLE_CLIENT_ID
            )
            
            # Additional check: you can check if idinfo['iss'] is in ['accounts.google.com', 'https://accounts.google.com']
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            return idinfo
            
        except ValueError as e:
            # Invalid token
            print(f"Token verification failed: {e}")
            return None

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Creates a JWT access token for the backend session.
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=7) # Default 7 days
            
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.JWT_SECRET_KEY, 
            algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt
        
    def decode_access_token(self, token: str) -> Optional[dict]:
        """
        Decodes and verifies a JWT token.
        """
        try:
            decoded_token = jwt.decode(
                token, 
                settings.JWT_SECRET_KEY, 
                algorithms=[settings.JWT_ALGORITHM]
            )
            return decoded_token
        except jwt.PyJWTError:
            return None

auth_service = AuthService()
