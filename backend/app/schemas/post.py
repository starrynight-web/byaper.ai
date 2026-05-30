"""Pydantic schemas for Posts."""
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PostGenerateRequest(BaseModel):
    occasion: str | None = None
    tone_override: str | None = None


class PostGenerateResponse(BaseModel):
    caption_en: str
    caption_bn: str | None = None
    hashtags: str | None = None
    image_url: str | None = None
    image_prompt: str | None = None


class PostCreate(BaseModel):
    content: str
    image_url: str | None = None
    image_prompt: str | None = None
    platform: str = "facebook"


class PostUpdate(BaseModel):
    content: str | None = None
    image_url: str | None = None
    status: str | None = None
    scheduled_time: datetime | None = None


class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    business_id: uuid.UUID
    content: str
    image_url: str | None = None
    image_prompt: str | None = None
    platform: str
    status: str
    scheduled_time: datetime | None = None
    published_post_id: str | None = None
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime
