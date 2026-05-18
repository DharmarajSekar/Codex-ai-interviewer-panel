from datetime import datetime

from pydantic import BaseModel


class InterviewCreate(BaseModel):
    candidate_id: int
    position: str


class InterviewResponse(BaseModel):
    id: int
    candidate_id: int
    recruiter_id: int
    position: str
    status: str
    current_question: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class AnswerPayload(BaseModel):
    answer: str
