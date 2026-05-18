from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings

from interview_ai.config.settings import MemorySettings, ModelSettings


class SessionMemoryStore:
    def __init__(self, memory: MemorySettings, model: ModelSettings) -> None:
        self._vectorstore = Chroma(
            collection_name=memory.chroma_collection,
            persist_directory=memory.persist_directory,
            embedding_function=OllamaEmbeddings(model=model.ollama_model),
        )
        self._k = memory.retrieval_k

    def save_turn(self, session_id: str, question: str, answer: str, topic: str) -> None:
        content = f"Q: {question}\nA: {answer}"
        self._vectorstore.add_documents(
            [
                Document(
                    page_content=content,
                    metadata={"session_id": session_id, "topic": topic},
                )
            ]
        )

    def retrieve_context(self, session_id: str, topic: str) -> list[Document]:
        return self._vectorstore.similarity_search(
            query=f"session={session_id} topic={topic}",
            k=self._k,
            filter={"session_id": session_id},
        )
