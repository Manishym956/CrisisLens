from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
from core.logger import logger

class Database:
    client: AsyncIOMotorClient = None
    
db = Database()

async def connect_to_mongo():
    try:
        logger.info("Connecting to MongoDB...")
        db.client = AsyncIOMotorClient(settings.MONGO_URI)
        # Verify connection
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB!")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    if db.client:
        logger.info("Closing MongoDB connection...")
        db.client.close()
        logger.info("MongoDB connection closed.")
