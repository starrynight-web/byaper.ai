"""Pydantic schemas for Workspaces (Businesses)."""
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class BusinessCreate(BaseModel):
    name: str = Field(..., max_length=255)


class BusinessUpdate(BaseModel):
    name: str | None = Field(None, max_length=255)
    category: str | None = Field(None, max_length=100)
    description: str | None = None
    location: str | None = None
    city: str | None = Field(None, max_length=100)
    phone: str | None = Field(None, max_length=50)
    website: str | None = Field(None, max_length=255)
    tone: str | None = Field(None, max_length=50)
    services: dict | None = None
    logo_url: str | None = None


class BusinessOnboarding(BusinessUpdate):
    """Schema for the one-shot onboarding payload."""
    pass


class BusinessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    category: str | None = None
    description: str | None = None
    location: str | None = None
    city: str | None = None
    phone: str | None = None
    website: str | None = None
    tone: str | None = None
    services: dict | None = None
    logo_url: str | None = None
    plan: str
    simulation_mode: bool
    onboarding_complete: bool
    created_at: datetime
    updated_at: datetime


class WorkspaceMemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    business: BusinessResponse
    role: str
    status: str
    joined_at: datetime
