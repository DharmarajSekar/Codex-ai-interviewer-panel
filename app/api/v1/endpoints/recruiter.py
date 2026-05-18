from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import current_user
from app.db.session import get_db
from app.models.interview import InterviewSession
from app.models.user import User, UserRole

router = APIRouter(prefix='/recruiter', tags=['recruiter'])


@router.get('/dashboard')
async def dashboard(db: AsyncSession = Depends(get_db), user: User = Depends(current_user)) -> dict:
    if user.role not in {UserRole.RECRUITER, UserRole.ADMIN}:
        raise HTTPException(status_code=403, detail='Forbidden')
    total = await db.scalar(select(func.count(InterviewSession.id)).where(InterviewSession.recruiter_id == user.id))
    active = await db.scalar(
        select(func.count(InterviewSession.id)).where(
            InterviewSession.recruiter_id == user.id, InterviewSession.status == 'in_progress'
        )
    )
    return {'recruiter_id': user.id, 'total_sessions': total or 0, 'active_sessions': active or 0}
