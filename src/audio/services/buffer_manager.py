from __future__ import annotations

import asyncio
from collections import deque

from audio.models.types import AudioChunk


class AudioBufferManager:
    def __init__(self, max_chunks: int = 256) -> None:
        self.max_chunks = max_chunks
        self._buffers: dict[str, deque[AudioChunk]] = {}
        self._locks: dict[str, asyncio.Lock] = {}

    async def append(self, chunk: AudioChunk) -> None:
        lock = self._locks.setdefault(chunk.session_id, asyncio.Lock())
        async with lock:
            buf = self._buffers.setdefault(chunk.session_id, deque(maxlen=self.max_chunks))
            buf.append(chunk)

    async def drain(self, session_id: str):
        lock = self._locks.setdefault(session_id, asyncio.Lock())
        async with lock:
            buf = self._buffers.setdefault(session_id, deque(maxlen=self.max_chunks))
            while buf:
                yield buf.popleft()

    async def clear(self, session_id: str) -> None:
        lock = self._locks.setdefault(session_id, asyncio.Lock())
        async with lock:
            self._buffers.pop(session_id, None)
