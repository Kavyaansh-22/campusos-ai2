from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.services import chat_service

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"


class SourceItem(BaseModel):
    type: str
    id: int
    name: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceItem]


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    """
    Stable contract for the future CampusOS frontend integration:
      POST /api/chat  { "message": "..." }
      -> { "answer": "...", "sources": [...] }

    session_id is optional and only used to keep short conversational
    context (e.g. resolving "it" in a follow-up question) - omit it and
    every request is treated as a fresh conversation.
    """
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="message must not be empty")

    result = chat_service.handle_message(db, payload.session_id or "default", message)
    return result
