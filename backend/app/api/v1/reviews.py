"""API Router for Reviews."""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.review import Review
from app.schemas.review import ReviewResponse, ReviewReplyOverride

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("", response_model=list[ReviewResponse])
async def list_reviews(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    query = select(Review).where(Review.business_id == ws.business_id).order_by(Review.review_date.desc())
    if status:
        query = query.where(Review.reply_status == status)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.put("/{review_id}/approve")
async def approve_review(
    review_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    rev = await db.get(Review, review_id)
    if not rev or str(rev.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Review not found")
        
    rev.posted_reply = rev.ai_reply_draft
    rev.reply_status = "posted"
    await db.commit()
    return {"status": "posted"}
