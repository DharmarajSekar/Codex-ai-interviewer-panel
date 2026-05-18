from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: dict[int, set[WebSocket]] = defaultdict(set)

    async def connect(self, session_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections[session_id].add(websocket)

    def disconnect(self, session_id: int, websocket: WebSocket) -> None:
        self.connections[session_id].discard(websocket)

    async def broadcast(self, session_id: int, payload: dict) -> None:
        for socket in list(self.connections[session_id]):
            await socket.send_json(payload)
