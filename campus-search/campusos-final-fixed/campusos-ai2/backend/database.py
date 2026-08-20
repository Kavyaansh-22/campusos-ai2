"""
Database connection layer.

This is the ONLY module that knows how to talk to MySQL. Everything else
goes through SQLAlchemy sessions handed out by get_db().
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from backend.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,   # avoids "MySQL server has gone away" on idle connections
    pool_recycle=280,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
