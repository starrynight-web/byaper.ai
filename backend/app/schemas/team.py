"""Pydantic schemas for Team & Invitations."""
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class TeamInviteRequest(BaseModel):
    email: EmailStr
    role: str


class TeamRoleUpdate(BaseModel):
    role: str


class InvitationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    role: str
    status: str = "invited"
    created_at: datetime
