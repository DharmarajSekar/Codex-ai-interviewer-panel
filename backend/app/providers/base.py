from abc import ABC, abstractmethod


class LLMProvider(ABC):
    @abstractmethod
    async def generate_response(self, prompt: str) -> str: ...


class STTProvider(ABC):
    @abstractmethod
    async def transcribe(self, audio_bytes: bytes) -> str: ...


class TTSProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str) -> bytes: ...


class AvatarProvider(ABC):
    @abstractmethod
    async def render_stream(self, text: str) -> str: ...
