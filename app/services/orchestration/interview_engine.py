from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.interview import InterviewSession, InterviewStatus, InterviewTurn
from app.services.memory.vector_store import InterviewVectorMemory
from app.services.providers.base import AIProvider
from app.services.session_cache import SessionCache


class InterviewEngine:
    def __init__(self, provider: AIProvider, memory: InterviewVectorMemory, cache: SessionCache) -> None:
        self.provider = provider
        self.memory = memory
        self.cache = cache

    async def start_session(self, db: AsyncSession, session: InterviewSession) -> InterviewSession:
        session.status = InterviewStatus.IN_PROGRESS
        session.started_at = datetime.utcnow()
        question = await self.provider.generate_question(f'{session.position} interview opening', [])
        session.current_question = question
        db.add(InterviewTurn(session_id=session.id, actor='ai', content=question))
        await self.memory.add_turn(session.id, question)
        await self.cache.set_state(session.id, {'status': session.status.value, 'current_question': question})
        await db.commit()
        await db.refresh(session)
        return session

    async def submit_answer(self, db: AsyncSession, session_id: int, answer: str) -> InterviewSession:
        session = await db.scalar(select(InterviewSession).where(InterviewSession.id == session_id))
        if not session:
            raise ValueError('session not found')
        db.add(InterviewTurn(session_id=session.id, actor='candidate', content=answer))
        await self.memory.add_turn(session.id, answer)
        feedback = await self.provider.evaluate_answer(session.current_question or '', answer)
        await self.memory.add_turn(session.id, feedback)
        context = await self.memory.recent_context(session.id, answer)
        next_question = await self.provider.generate_question(f'position: {session.position}', context)
        session.current_question = next_question
        db.add(InterviewTurn(session_id=session.id, actor='ai', content=next_question))
        await self.cache.set_state(session.id, {'status': session.status.value, 'current_question': next_question})
        await db.commit()
        await db.refresh(session)
        return session
