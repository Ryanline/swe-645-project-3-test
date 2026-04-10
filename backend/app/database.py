"""Database configuration for the survey backend."""

from __future__ import annotations

import os

from sqlmodel import Session, SQLModel, create_engine


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./surveys.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def create_db_and_tables() -> None:
    """Create database tables during local startup."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    """Provide a request-scoped SQLModel session."""
    with Session(engine) as session:
        yield session
