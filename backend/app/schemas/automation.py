"""Pydantic schemas for Automations."""
import uuid
from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict


class AutomationUpdate(BaseModel):
    enabled: bool
    full_auto_mode: bool = False  # True = AI sends without owner approval (24/7)
    config: dict[str, Any] | None = None


class AutomationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    business_id: uuid.UUID
    type: str
    enabled: bool
    full_auto_mode: bool = False
    config: dict[str, Any] | None = None
    last_run_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
