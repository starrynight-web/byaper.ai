"""Pydantic schemas for Auth and Users."""
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserSyncRequest(BaseModel):
    email: str
    name: str | None = None
    avatar_url: str | None = None
    google_id: str | None = None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    name: str | None = None
    avatar_url: str | None = None
    created_at: datetime
    last_login: datetime | None = None
