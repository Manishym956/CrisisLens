from pydantic import BaseModel
from typing import Optional

class AlertRequest(BaseModel):
    news_id: Optional[str] = None
    threat_level: str
    message: str
    webhook_url: Optional[str] = None
    email_address: Optional[str] = None
