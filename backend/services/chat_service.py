"""
Conversation context, kept deliberately simple per the project brief:
just the last few turns of a session, held in memory. No persistence,
no long-term user memory system.

Sessions are identified by a client-generated session_id (the standalone
chat UI creates a random one per browser tab). If none is provided, a
single shared "default" session is used, which is fine for quick testing
via curl/Swagger but not meant for multi-user production use.
"""
from collections import defaultdict
from typing import Any

from sqlalchemy.orm import Session as DBSession

from backend.services.ai_service import ai_service

MAX_TURNS_REMEMBERED = 6  # user+assistant pairs

# session_id -> list of {"role": "user"|"assistant", "content": str}
_conversations: dict[str, list[dict[str, str]]] = defaultdict(list)


def _history_for(session_id: str) -> list[dict[str, str]]:
    return _conversations[session_id][-(MAX_TURNS_REMEMBERED * 2):]


def handle_message(db: DBSession, session_id: str, message: str) -> dict[str, Any]:
    history = _history_for(session_id)

    result = ai_service.answer(db, message, history)

    # Only remember the plain text turns, not tool-call internals — keeps
    # this genuinely simple, per the "no complex memory system" rule.
    _conversations[session_id].append({"role": "user", "content": message})
    _conversations[session_id].append({"role": "assistant", "content": result["answer"]})

    return result


def reset_session(session_id: str) -> None:
    _conversations.pop(session_id, None)
