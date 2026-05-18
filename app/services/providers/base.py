from abc import ABC, abstractmethod


class AIProvider(ABC):
    @abstractmethod
    async def generate_question(self, prompt: str, context: list[str]) -> str:
        raise NotImplementedError

    @abstractmethod
    async def evaluate_answer(self, question: str, answer: str) -> str:
        raise NotImplementedError
