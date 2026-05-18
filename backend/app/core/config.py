from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str
    REDIS_URL: str
    CHROMA_HOST: str = "chromadb"
    CHROMA_PORT: int = 8000
    LLM_PROVIDER: str = "openai"
    STT_PROVIDER: str = "whisper"
    TTS_PROVIDER: str = "elevenlabs"
    AVATAR_PROVIDER: str = "d-id"


settings = Settings()
