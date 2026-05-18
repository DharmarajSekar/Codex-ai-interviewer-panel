from fastapi import APIRouter

from app.api.v1.endpoints import auth, interviews, recruiter

router = APIRouter()
router.include_router(auth.router)
router.include_router(interviews.router)
router.include_router(recruiter.router)
