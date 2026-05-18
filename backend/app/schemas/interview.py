from pydantic import BaseModel


class CreateInterviewSessionRequest(BaseModel):
    candidate_id: str
    role_id: str


class CreateInterviewSessionResponse(BaseModel):
    session_id: str
    status: str
