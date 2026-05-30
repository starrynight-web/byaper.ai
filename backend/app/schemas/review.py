"""Pydantic schemas for Reviews."""
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ReviewReplyOverride(BaseModel):
    reply_text: str


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    business_id: uuid.UUID
    google_review_id: str | None = None
    reviewer_name: str | None = None
    reviewer_avatar: str | None = None
    rating: int | None = None
    review_text: str | None = None
    ai_reply_draft: str | None = None
    posted_reply: str | None = None
    reply_status: str
    review_date: datetime | None = None
    replied_at: datetime | None = None
    created_at: datetime
