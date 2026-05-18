from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_name: str = 'AI Interviewer Backend'
    environment: str = Field(default='development')
    debug: bool = False
    log_level: str = 'INFO'

    api_v1_prefix: str = '/api/v1'

    postgres_dsn: str = Field(default='postgresql+asyncpg://postgres:postgres@localhost:5432/interviewer')
    redis_url: str = Field(default='redis://localhost:6379/0')
    chroma_persist_dir: str = Field(default='./.chroma')

    jwt_secret_key: str = Field(default='change-me', min_length=8)
    jwt_algorithm: str = 'HS256'
    access_token_expire_minutes: int = 60

    ollama_base_url: str = 'http://localhost:11434'
    ollama_model: str = 'llama3.1'


@lru_cache
def get_settings() -> Settings:
    return Settings()
