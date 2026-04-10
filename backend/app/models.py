"""Data models for student surveys."""

from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field as PydanticField
from sqlmodel import Field, SQLModel


class SurveyBase(SQLModel):
    """Shared survey fields used by create, update, and database models."""

    first_name: str = Field(index=True, min_length=1, max_length=100)
    last_name: str = Field(index=True, min_length=1, max_length=100)
    street_address: str = Field(min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    zip_code: str = Field(min_length=1, max_length=20)
    telephone: str = Field(min_length=1, max_length=30)
    email: EmailStr
    survey_date: date
    liked_most: str = Field(default="", max_length=255)
    interest_source: str = Field(default="", max_length=255)
    recommendation_likelihood: str = Field(min_length=1, max_length=50)


class Survey(SurveyBase, table=True):
    """Database table for stored surveys."""

    id: Optional[int] = Field(default=None, primary_key=True)


class SurveyCreate(SurveyBase):
    """Request body for creating a survey."""


class SurveyUpdate(SQLModel):
    """Request body for updating a survey."""

    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    street_address: str = Field(min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    zip_code: str = Field(min_length=1, max_length=20)
    telephone: str = Field(min_length=1, max_length=30)
    email: EmailStr
    survey_date: date
    liked_most: str = Field(default="", max_length=255)
    interest_source: str = Field(default="", max_length=255)
    recommendation_likelihood: str = Field(min_length=1, max_length=50)


class SurveyRead(SurveyBase):
    """API response model for reading surveys."""

    id: int


class SurveyFormData(BaseModel):
    """Frontend-friendly survey payload with list fields for checkbox groups."""

    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    first_name: str
    last_name: str
    street_address: str
    city: str
    state: str
    zip_code: str
    telephone: str
    email: EmailStr
    survey_date: date
    liked_most: list[str] = PydanticField(default_factory=list)
    interest_source: list[str] = PydanticField(default_factory=list)
    recommendation_likelihood: str


def to_form_data(survey: Survey | SurveyRead) -> SurveyFormData:
    """Convert database storage strings into list-based API data."""

    liked = [item for item in survey.liked_most.split(",") if item]
    interests = [item for item in survey.interest_source.split(",") if item]
    return SurveyFormData(
        id=survey.id,
        first_name=survey.first_name,
        last_name=survey.last_name,
        street_address=survey.street_address,
        city=survey.city,
        state=survey.state,
        zip_code=survey.zip_code,
        telephone=survey.telephone,
        email=survey.email,
        survey_date=survey.survey_date,
        liked_most=liked,
        interest_source=interests,
        recommendation_likelihood=survey.recommendation_likelihood,
    )


def from_form_data(payload: SurveyFormData) -> SurveyCreate:
    """Convert list-based API payloads into database storage strings."""

    return SurveyCreate(
        first_name=payload.first_name,
        last_name=payload.last_name,
        street_address=payload.street_address,
        city=payload.city,
        state=payload.state,
        zip_code=payload.zip_code,
        telephone=payload.telephone,
        email=payload.email,
        survey_date=payload.survey_date,
        liked_most=",".join(payload.liked_most),
        interest_source=",".join(payload.interest_source),
        recommendation_likelihood=payload.recommendation_likelihood,
    )


def update_from_form_data(payload: SurveyFormData) -> SurveyUpdate:
    """Convert list-based API payloads into update payloads."""

    return SurveyUpdate(
        first_name=payload.first_name,
        last_name=payload.last_name,
        street_address=payload.street_address,
        city=payload.city,
        state=payload.state,
        zip_code=payload.zip_code,
        telephone=payload.telephone,
        email=payload.email,
        survey_date=payload.survey_date,
        liked_most=",".join(payload.liked_most),
        interest_source=",".join(payload.interest_source),
        recommendation_likelihood=payload.recommendation_likelihood,
    )
