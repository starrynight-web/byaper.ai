"""24/7 Automation Runner for Byapar AI MVP.
Runs in the background and processes messages, reviews, and posts automatically
for businesses that have full_auto_mode enabled.
"""
import asyncio
import logging
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from app.core.database import AsyncSessionLocal
from app.models.automation import Automation
from app.models.business import Business
from app.models.message import Message
from app.models.review import Review
from app.models.post import Post
from app.services.ai_service import ai_service
from app.services.meta_service import meta_service
# Note: For MVP we might skip real GBP service calls if they are not fully implemented
# but we'll simulate the state updates.

logger = logging.getLogger(__name__)

async def process_messenger_auto_replies(db: AsyncSession, business: Business, automation: Automation):
    """Finds pending messages and auto-replies to them."""
    if not automation.enabled or not automation.full_auto_mode:
        return

    # Find pending messages
    query = select(Message).where(
        and_(
            Message.business_id == business.id,
            Message.reply_status == 'pending'
        )
    )
    result = await db.execute(query)
    pending_messages = result.scalars().all()

    if not pending_messages:
        return

    # Convert business to dict for AI context
    business_context = {
        "name": business.name,
        "category": business.category,
        "location": business.location,
        "description": getattr(business, 'description', ''),
        "services": business.services,
        "opening_hours": getattr(business, 'opening_hours', ''),
        "phone": business.phone,
    }

    for msg in pending_messages:
        logger.info(f"[AutoRunner] Generating Messenger reply for msg: {msg.id} (Business: {business.name})")
        reply_text = await ai_service.generate_messenger_reply(msg.message_text, business_context)
        
        try:
            # Try to send via Meta Service
            access_token = business.meta_access_token or getattr(settings, 'meta_page_access_token', '')
            page_id = business.meta_page_id or "default_page_id"
            
            await meta_service.send_messenger_reply(
                page_id=page_id,
                access_token=access_token,
                recipient_id=msg.sender_id,
                text=reply_text
            )
            
            # Update message status
            msg.reply_text = reply_text
            msg.ai_reply_draft = reply_text
            msg.reply_status = 'sent'
            
        except Exception as e:
            logger.error(f"[AutoRunner] Failed to send Messenger reply: {e}")
            msg.ai_reply_draft = reply_text
            msg.reply_status = 'failed'
            
    await db.commit()
    automation.last_run_at = datetime.now(timezone.utc)
    await db.commit()


async def process_review_auto_replies(db: AsyncSession, business: Business, automation: Automation):
    """Finds pending reviews and auto-replies to them."""
    if not automation.enabled or not automation.full_auto_mode:
        return

    query = select(Review).where(
        and_(
            Review.business_id == business.id,
            Review.reply_status == 'pending'
        )
    )
    result = await db.execute(query)
    pending_reviews = result.scalars().all()

    if not pending_reviews:
        return

    business_context = {
        "name": business.name,
        "category": business.category,
        "location": business.location,
        "description": getattr(business, 'description', ''),
    }

    for review in pending_reviews:
        logger.info(f"[AutoRunner] Generating Review reply for review: {review.id} (Business: {business.name})")
        reply_text = await ai_service.generate_review_reply(
            rating=review.rating,
            review_text=review.review_text or "",
            business_context=business_context
        )
        
        # In MVP, we might simulate GBP post if GBP service isn't fully implemented
        review.posted_reply = reply_text
        review.ai_reply_draft = reply_text
        review.reply_status = 'posted'
        
    await db.commit()
    automation.last_run_at = datetime.now(timezone.utc)
    await db.commit()


async def run_automation_for_business(business_id: str, automation_type: str, db: AsyncSession):
    """Manually run a specific automation for a business."""
    business = await db.get(Business, business_id)
    if not business:
        return {"error": "Business not found"}
        
    query = select(Automation).where(
        and_(
            Automation.business_id == business_id,
            Automation.type == automation_type
        )
    )
    result = await db.execute(query)
    automation = result.scalars().first()
    
    if not automation:
        return {"error": f"Automation {automation_type} not configured for this business"}
        
    # Temporarily set to true for manual run
    original_mode = automation.full_auto_mode
    automation.full_auto_mode = True
    
    try:
        if automation_type == 'messenger_reply':
            await process_messenger_auto_replies(db, business, automation)
        elif automation_type == 'review_reply':
            await process_review_auto_replies(db, business, automation)
        return {"status": "success"}
    finally:
        automation.full_auto_mode = original_mode
        await db.commit()


async def auto_runner_loop():
    """Main background loop that checks all businesses."""
    from app.core.config import settings
    interval = getattr(settings, 'auto_runner_interval_seconds', 300)
    
    logger.info(f"Starting Byapar AI AutoRunner. Interval: {interval}s")
    
    while True:
        try:
            async with AsyncSessionLocal() as db:
                # Find all enabled automations that are in full auto mode
                query = select(Automation).where(
                    and_(
                        Automation.enabled == True,
                        Automation.full_auto_mode == True
                    )
                )
                result = await db.execute(query)
                active_automations = result.scalars().all()
                
                # Group by business
                business_ids = list(set([str(a.business_id) for a in active_automations]))
                
                for bid in business_ids:
                    business = await db.get(Business, bid)
                    if not business:
                        continue
                        
                    autos = [a for a in active_automations if str(a.business_id) == str(bid)]
                    for auto in autos:
                        if auto.type == 'messenger_reply':
                            await process_messenger_auto_replies(db, business, auto)
                        elif auto.type == 'review_reply':
                            await process_review_auto_replies(db, business, auto)
                        # posts and gbp can be added here
                        
        except Exception as e:
            logger.error(f"Error in auto_runner_loop: {e}")
            
        await asyncio.sleep(interval)
