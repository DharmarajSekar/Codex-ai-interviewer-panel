from fastapi import APIRouter, WebSocket

ws_router = APIRouter()


@ws_router.websocket("/ws/interviews/{session_id}")
async def interview_ws(websocket: WebSocket, session_id: str) -> None:
    await websocket.accept()
    await websocket.send_json({"event": "connected", "session_id": session_id})
    await websocket.close()
