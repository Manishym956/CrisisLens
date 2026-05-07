from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.websocket_manager import manager
from core.logger import logger

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for realtime threat feed.
    Frontend clients connect here to receive instant updates when new 
    fake news is detected or when threat levels spike.
    """
    await manager.connect(websocket)
    try:
        while True:
            # We keep the connection open and listen for any incoming messages (like ping/pong)
            data = await websocket.receive_text()
            logger.info(f"Received WS message from client: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
