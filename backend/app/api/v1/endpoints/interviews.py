from fastapi import APIRouter
from app.schemas.interview import CreateInterviewSessionRequest, CreateInterviewSessionResponse

router = APIRouter()


@router.post("/sessions", response_model=CreateInterviewSessionResponse)
def create_interview_session(payload: CreateInterviewSessionRequest) -> CreateInterviewSessionResponse:
    return CreateInterviewSessionResponse(session_id="placeholder-session-id", status="initialized")
