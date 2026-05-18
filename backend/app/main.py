from fastapi import FastAPI
from app.api.v1.router import api_router
from app.core.config import settings
from app.websocket.routes import ws_router

app = FastAPI(title="AI Interviewer Backend", version="0.1.0")
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
app.include_router(ws_router)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
