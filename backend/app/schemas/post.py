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
    caption: str
    caption_bn: str | None = None
    hashtags: str | None = None
    image_url: str | None = None
    image_prompt: str | None = None
    platform: str = "facebook"


class PostUpdate(BaseModel):
    caption: str | None = None
    caption_bn: str | None = None
    hashtags: str | None = None
    status: str | None = None
    scheduled_at: datetime | None = None


class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    business_id: uuid.UUID
    title: str | None = None
    caption: str
    caption_bn: str | None = None
    hashtags: str | None = None
    image_url: str | None = None
    image_prompt: str | None = None
    platform: str
    status: str
    scheduled_at: datetime | None = None
    published_at: datetime | None = None
    facebook_post_id: str | None = None
    reach: int
    likes: int
    created_at: datetime
    updated_at: datetime
