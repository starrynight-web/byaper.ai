"""API Router for Reviews."""
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.review import Review
from app.models.business import Business
from app.schemas.review import ReviewResponse, ReviewReplyOverride
from app.services.gbp_service import gbp_service
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)
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
    """Approve AI draft and post it to Google Business Profile."""
    rev = await db.get(Review, review_id)
    if not rev or str(rev.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Review not found")
        
    business = await db.get(Business, ws.business_id)
    
    try:
        reply_text = rev.ai_reply_draft or "Thank you for your feedback!"
        
        await gbp_service.reply_to_review(
            location_id=business.gbp_location_id or "simulated_location",
            review_id=rev.google_review_id,
            reply_text=reply_text,
            access_token=business.google_access_token or "simulated_token"
        )
        
        rev.posted_reply = reply_text
        rev.reply_status = "posted"
        await db.commit()
        return {"status": "posted"}
    except Exception as e:
        logger.error(f"Failed to post review reply: {e}")
        rev.reply_status = "failed"
        await db.commit()
        raise HTTPException(status_code=500, detail="Failed to post reply")


@router.put("/{review_id}/override-reply")
async def override_review(
    review_id: uuid.UUID,
    req: ReviewReplyOverride,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    """Manually edit reply and post to Google Business Profile."""
    rev = await db.get(Review, review_id)
    if not rev or str(rev.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Review not found")
        
    business = await db.get(Business, ws.business_id)
    
    try:
        await gbp_service.reply_to_review(
            location_id=business.gbp_location_id or "simulated_location",
            review_id=rev.google_review_id,
            reply_text=req.reply_text,
            access_token=business.google_access_token or "simulated_token"
        )
        
        rev.posted_reply = req.reply_text
        rev.reply_status = "posted"
        await db.commit()
        return {"status": "posted"}
    except Exception as e:
        logger.error(f"Failed to post review reply: {e}")
        rev.reply_status = "failed"
        await db.commit()
        raise HTTPException(status_code=500, detail="Failed to post reply")


@router.post("/sync")
async def sync_reviews(
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    """Trigger a sync to fetch new reviews from GBP."""
    business = await db.get(Business, ws.business_id)
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    # In a real app this would be a background task to avoid timeout
    # For now, we await it directly for simplicity
    fetched_reviews = await gbp_service.fetch_reviews(
        location_id=business.gbp_location_id or "simulated_location",
        access_token=business.google_access_token or "simulated_token"
    )
    
    new_count = 0
    for fetched in fetched_reviews:
        # Check if exists
        exists = await db.execute(
            select(Review).where(Review.google_review_id == fetched["google_review_id"])
        )
        if exists.scalar_one_or_none():
            continue
            
        # Generate AI reply draft
        ai_reply = await ai_service.generate_review_reply(
            rating=fetched["rating"],
            review_text=fetched["review_text"],
            business_context={"name": business.name, "category": business.category}
        )
        
        new_rev = Review(
            business_id=business.id,
            google_review_id=fetched["google_review_id"],
            reviewer_name=fetched["reviewer_name"],
            rating=fetched["rating"],
            review_text=fetched["review_text"],
            ai_reply_draft=ai_reply,
            reply_status="pending",
            review_date=fetched["review_date"]
        )
        db.add(new_rev)
        new_count += 1
        
    await db.commit()
    return {"status": "synced", "new_reviews": new_count}
