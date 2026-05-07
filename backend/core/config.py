from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CrisisLens API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    MONGO_URI: str
    MONGO_DB_NAME: str = "crisislens"
    
    class Config:
        env_file = ".env"

settings = Settings()
