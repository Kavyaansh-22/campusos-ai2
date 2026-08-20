"""
CampusOS AI Assistant — FastAPI entrypoint.

Built incrementally per project plan:
  1. MySQL connection -> FastAPI -> simple query -> API response   [this file, /health and /debug/buildings]
  2. AI + database retrieval                                       [routes/chat.py]
  3. Chat UI                                                       [frontend/]
  4. Conversation context                                          [services/chat_service.py]
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.config import settings
from backend.database import get_db
from backend.models import Building

app = FastAPI(title="CampusOS AI Assistant", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health(db: Session = Depends(get_db)):
    """Basic liveness + DB connectivity check."""
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": settings.DB_NAME}


@app.get("/debug/buildings")
def debug_buildings(db: Session = Depends(get_db)):
    """
    Step-1 sanity check: MySQL -> FastAPI -> simple query -> API response.
    Not part of the final chat API — just here to prove the plumbing works
    before layering the AI on top.
    """
    buildings = db.query(Building).all()
    return [
        {"id": b.id, "name": b.name, "floors": b.floors}
        for b in buildings
    ]


# Chat router is added once the AI layer (step 2) is wired up.
from backend.routes.chat import router as chat_router  # noqa: E402
app.include_router(chat_router, prefix="/api")
