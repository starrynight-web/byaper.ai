"""Pydantic schemas for Automations."""
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AutomationUpdate(BaseModel):
    enabled: bool
    config: dict | None = None


class AutomationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    business_id: uuid.UUID
    type: str
    enabled: bool
    config: dict | None = None
    last_run_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
