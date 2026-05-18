from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from app.api.v1.router import router as v1_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.monitoring.health import router as monitoring_router
from app.ws.manager import ConnectionManager

configure_logging()
settings = get_settings()
app = FastAPI(title=settings.app_name, debug=settings.debug)
manager = ConnectionManager()

app.include_router(v1_router, prefix=settings.api_v1_prefix)
app.include_router(monitoring_router)


@app.websocket('/ws/interviews/{session_id}')
async def interview_socket(websocket: WebSocket, session_id: int) -> None:
    await manager.connect(session_id, websocket)
    try:
        while True:
            payload = await websocket.receive_json()
            await manager.broadcast(session_id, payload)
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
