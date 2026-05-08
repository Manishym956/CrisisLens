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
    document = await news_service.store_news(
        news_text=request.news_text, 
        virality_score=request.source_virality_score,
        user_id=current_user["id"]
    )
    return document

@router.get("/user/count", response_model=dict)
async def get_user_verified_count(current_user=Depends(get_current_user)):
    """
    Gets the total number of news articles verified by the current user.
    """
    count = await news_service.collection.count_documents({"user_id": current_user["id"]})
    return {"verified_count": count}

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


@router.get("/live-feed", response_model=list[dict])
async def get_live_feed(
    limit: int = Query(5, ge=1, le=20),
    query: str = Query("fake news OR misinformation"),
):
    """
    Runtime-only Google News feed for live dashboard (no DB storage).
    """
    return await news_service.get_live_google_feed(limit=limit, query=query)
