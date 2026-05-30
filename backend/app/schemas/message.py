"""Pydantic schemas for Messages."""
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MessageReplyOverride(BaseModel):
    reply_text: str


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    business_id: uuid.UUID
    sender_id: str
    sender_name: str | None = None
    message_text: str
    reply_text: str | None = None
    reply_status: str
    auto_reply: bool
    platform: str
    received_at: datetime
    replied_at: datetime | None = None
