from fastapi import APIRouter, Query, Depends
from typing import List
from api.v1.schemas.news import NewsStoreRequest, NewsItem
from services.news_service import news_service
from api.deps import get_current_user

router = APIRouter()

@router.post("/store-news", response_model=NewsItem)
async def store_news(request: NewsStoreRequest, current_user=Depends(get_current_user)):
    """
    Analyzes the news (verification & threat ranking) and stores it in MongoDB.
    """
    document = await news_service.store_news(request.news_text, request.source_virality_score)
    return document

@router.get("/top-fake-news", response_model=List[NewsItem])
async def get_top_fake_news(limit: int = Query(10, ge=1, le=100)):
    """
    Retrieves the most threatening fake news from the database.
    """
    results = await news_service.get_top_fake_news(limit=limit)
    return results

@router.get("/search-news", response_model=List[NewsItem])
async def search_news(query: str, limit: int = Query(10, ge=1, le=100)):
    """
    Searches stored news by text.
    """
    results = await news_service.search_news(query=query, limit=limit)
    return results
