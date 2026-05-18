from langchain_chroma import Chroma
from langchain_community.embeddings import OllamaEmbeddings

from app.core.config import get_settings


class InterviewVectorMemory:
    def __init__(self) -> None:
        settings = get_settings()
        embeddings = OllamaEmbeddings(base_url=settings.ollama_base_url, model=settings.ollama_model)
        self.store = Chroma(
            collection_name='interview_memory',
            embedding_function=embeddings,
            persist_directory=settings.chroma_persist_dir,
        )

    async def add_turn(self, session_id: int, content: str) -> None:
        self.store.add_texts([content], metadatas=[{'session_id': session_id}])

    async def recent_context(self, session_id: int, query: str, limit: int = 4) -> list[str]:
        docs = self.store.similarity_search(query, k=limit, filter={'session_id': session_id})
        return [d.page_content for d in docs]
