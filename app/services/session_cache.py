import json

from redis.asyncio import Redis

from app.core.config import get_settings


class SessionCache:
    def __init__(self) -> None:
        self.redis = Redis.from_url(get_settings().redis_url, decode_responses=True)

    async def set_state(self, session_id: int, payload: dict, ttl_sec: int = 3600) -> None:
        await self.redis.setex(f'interview:session:{session_id}', ttl_sec, json.dumps(payload))

    async def get_state(self, session_id: int) -> dict | None:
        raw = await self.redis.get(f'interview:session:{session_id}')
        return json.loads(raw) if raw else None
