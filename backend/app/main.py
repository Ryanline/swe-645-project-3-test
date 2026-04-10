"""FastAPI entrypoint for the SWE 645 student survey backend."""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .database import create_db_and_tables, get_session
from .models import Survey, SurveyFormData, from_form_data, to_form_data, update_from_form_data


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Initialize database tables when the app starts."""

    create_db_and_tables()
    yield


app = FastAPI(
    title="SWE 645 Student Survey API",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@app.get("/api/health")
def health_check() -> dict[str, str]:
    """Return a simple health response for tests and deployment checks."""

    return {"status": "ok"}


@app.get("/api/surveys", response_model=list[SurveyFormData])
def list_surveys(
    session: SessionDep,
    limit: int = Query(default=100, ge=1, le=500),
) -> list[SurveyFormData]:
    """Return all stored surveys."""

    surveys = session.exec(select(Survey).order_by(Survey.id.desc()).limit(limit)).all()
    return [to_form_data(survey) for survey in surveys]


@app.post("/api/surveys", response_model=SurveyFormData, status_code=status.HTTP_201_CREATED)
def create_survey(payload: SurveyFormData, session: SessionDep) -> SurveyFormData:
    """Create and store a new survey."""

    survey = Survey.model_validate(from_form_data(payload))
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return to_form_data(survey)


@app.get("/api/surveys/{survey_id}", response_model=SurveyFormData)
def get_survey(survey_id: int, session: SessionDep) -> SurveyFormData:
    """Return one survey by identifier."""

    survey = session.get(Survey, survey_id)
    if survey is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
    return to_form_data(survey)


@app.put("/api/surveys/{survey_id}", response_model=SurveyFormData)
def update_survey(survey_id: int, payload: SurveyFormData, session: SessionDep) -> SurveyFormData:
    """Replace an existing survey with new values."""

    survey = session.get(Survey, survey_id)
    if survey is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")

    update_data = update_from_form_data(payload)
    survey.sqlmodel_update(update_data.model_dump())
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return to_form_data(survey)


@app.delete("/api/surveys/{survey_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_survey(survey_id: int, session: SessionDep) -> Response:
    """Delete a survey by identifier."""

    survey = session.get(Survey, survey_id)
    if survey is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")

    session.delete(survey)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
