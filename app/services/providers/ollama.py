import httpx

from app.core.config import get_settings
from app.services.providers.base import AIProvider


class OllamaProvider(AIProvider):
    def __init__(self) -> None:
        self.settings = get_settings()

    async def _call(self, prompt: str) -> str:
        async with httpx.AsyncClient(base_url=self.settings.ollama_base_url, timeout=60.0) as client:
            response = await client.post(
                '/api/generate',
                json={'model': self.settings.ollama_model, 'prompt': prompt, 'stream': False},
            )
            response.raise_for_status()
            payload = response.json()
            return payload['response'].strip()

    async def generate_question(self, prompt: str, context: list[str]) -> str:
        contextual_prompt = f"You are an interviewer. Context: {' | '.join(context)}\nCreate next question for: {prompt}"
        return await self._call(contextual_prompt)

    async def evaluate_answer(self, question: str, answer: str) -> str:
        prompt = f'Evaluate candidate answer quality. Question: {question}. Answer: {answer}. Provide concise rubric score and feedback.'
        return await self._call(prompt)
