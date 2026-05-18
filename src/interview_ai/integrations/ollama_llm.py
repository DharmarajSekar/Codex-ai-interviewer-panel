from langchain_community.chat_models import ChatOllama

from interview_ai.config.settings import ModelSettings


def build_ollama_llm(settings: ModelSettings) -> ChatOllama:
    return ChatOllama(
        model=settings.ollama_model,
        temperature=settings.temperature,
        top_p=settings.top_p,
    )
