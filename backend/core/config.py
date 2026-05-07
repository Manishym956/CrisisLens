from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CrisisLens API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    MONGO_URI: str
    MONGO_DB_NAME: str = "crisislens"

    # AI API Keys
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None

    # OAuth & Security
    GOOGLE_CLIENT_ID: Optional[str] = None
    JWT_SECRET_KEY: str = "default_insecure_secret_key"
    JWT_ALGORITHM: str = "HS256"

    # Email Dispatch (Ranks 1-2)
    SMTP_EMAIL: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None          # Gmail App Password
    ALERT_EMAIL_RECIPIENTS: Optional[str] = None  # Comma-separated

    # Reddit Dispatch (Ranks 3-6) — pending API approval
    REDDIT_CLIENT_ID: Optional[str] = None
    REDDIT_CLIENT_SECRET: Optional[str] = None
    REDDIT_USERNAME: Optional[str] = None
    REDDIT_PASSWORD: Optional[str] = None
    REDDIT_SUBREDDIT: str = "CrisisLensAlerts"

    # Discord Dispatch (Ranks 3-6) — active fallback
    DISCORD_WEBHOOK_URL: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
