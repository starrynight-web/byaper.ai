"""API Router for Background Workers (QStash targets)."""
import uuid
import logging
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.post import Post
from app.models.business import Business
from app.services.meta_service import meta_service
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/workers", tags=["Workers"])


class PublishPostPayload(BaseModel):
    post_id: str


@router.post("/publish-post")
async def publish_post_worker(
    payload: PublishPostPayload,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Called by QStash when it's time to publish a scheduled post.
    In a production app, verify the Upstash-Signature header here.
    """
    try:
        post_id = uuid.UUID(payload.post_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid post_id")

    post = await db.get(Post, post_id)
    if not post or post.status != "scheduled":
        logger.warning(f"Post {post_id} not found or not scheduled.")
        return {"status": "skipped", "reason": "Not scheduled"}

    business = await db.get(Business, post.business_id)
    if not business:
        return {"status": "error", "reason": "Business not found"}

    try:
        # Publish to Facebook
        # Using placeholder access token if missing, since simulation mode will catch it
        access_token = business.meta_access_token or "simulated_token"
        page_id = business.meta_page_id or "simulated_page"

        published_id = await meta_service.publish_post(
            page_id=page_id,
            access_token=access_token,
            message=post.content,
            image_url=post.image_url
        )

        post.status = "published"
        post.published_post_id = published_id
        await db.commit()
        return {"status": "success", "published_id": published_id}

    except Exception as e:
        logger.error(f"Worker failed to publish post {post_id}: {e}")
        post.status = "failed"
        post.error_message = str(e)
        await db.commit()
        raise HTTPException(status_code=500, detail="Publishing failed")
