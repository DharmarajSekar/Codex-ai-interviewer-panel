from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import current_user
from app.db.session import get_db
from app.models.interview import InterviewSession
from app.models.user import User, UserRole
from app.schemas.interview import AnswerPayload, InterviewCreate, InterviewResponse
from app.services.memory.vector_store import InterviewVectorMemory
from app.services.orchestration.interview_engine import InterviewEngine
from app.services.providers.ollama import OllamaProvider
from app.services.session_cache import SessionCache

router = APIRouter(prefix='/interviews', tags=['interviews'])

engine = InterviewEngine(OllamaProvider(), InterviewVectorMemory(), SessionCache())


@router.post('', response_model=InterviewResponse)
async def create_interview(payload: InterviewCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_user)) -> InterviewSession:
    if user.role not in {UserRole.RECRUITER, UserRole.ADMIN}:
        raise HTTPException(status_code=403, detail='Forbidden')
    session = InterviewSession(candidate_id=payload.candidate_id, recruiter_id=user.id, position=payload.position)
    db.add(session)
    await db.flush()
    session = await engine.start_session(db, session)
    return session


@router.post('/{session_id}/answer', response_model=InterviewResponse)
async def submit_answer(session_id: int, payload: AnswerPayload, db: AsyncSession = Depends(get_db), user: User = Depends(current_user)) -> InterviewSession:
    session = await db.scalar(select(InterviewSession).where(InterviewSession.id == session_id))
    if not session:
        raise HTTPException(status_code=404, detail='Session not found')
    if user.id != session.candidate_id:
        raise HTTPException(status_code=403, detail='Forbidden')
    return await engine.submit_answer(db, session_id, payload.answer)
