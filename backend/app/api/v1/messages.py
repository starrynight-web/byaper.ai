"""API Router for Messages (Messenger)."""
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.message import Message
from app.models.business import Business
from app.schemas.message import MessageResponse, MessageReplyOverride
from app.services.meta_service import meta_service
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("", response_model=list[MessageResponse])
async def list_messages(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    query = select(Message).where(Message.business_id == ws.business_id).order_by(Message.received_at.desc())
    if status:
        query = query.where(Message.reply_status == status)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.put("/{message_id}/approve")
async def approve_message(
    message_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    """Owner approves the AI draft and sends it via Meta Graph API."""
    msg = await db.get(Message, message_id)
    if not msg or str(msg.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Message not found")
        
    business = await db.get(Business, ws.business_id)
    
    try:
        # Use AI draft as the reply
        reply = msg.ai_reply_draft or "Thank you for your message."
        
        await meta_service.send_messenger_reply(
            page_id=business.meta_page_id or "simulated_page",
            access_token=business.meta_access_token or "simulated_token",
            recipient_id=msg.sender_id,
            text=reply
        )
        
        msg.reply_text = reply
        msg.reply_status = "sent"
        msg.is_read = True
        await db.commit()
        return {"status": "sent"}
    except Exception as e:
        logger.error(f"Failed to send message: {e}")
        msg.reply_status = "failed"
        await db.commit()
        raise HTTPException(status_code=500, detail="Failed to send message")


@router.put("/{message_id}/override-reply")
async def override_message(
    message_id: uuid.UUID,
    req: MessageReplyOverride,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    """Owner manually edits the reply before sending."""
    msg = await db.get(Message, message_id)
    if not msg or str(msg.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Message not found")
        
    business = await db.get(Business, ws.business_id)
    
    try:
        await meta_service.send_messenger_reply(
            page_id=business.meta_page_id or "simulated_page",
            access_token=business.meta_access_token or "simulated_token",
            recipient_id=msg.sender_id,
            text=req.reply_text
        )
        
        msg.reply_text = req.reply_text
        msg.reply_status = "sent"
        msg.is_read = True
        await db.commit()
        return {"status": "sent"}
    except Exception as e:
        logger.error(f"Failed to send message: {e}")
        msg.reply_status = "failed"
        await db.commit()
        raise HTTPException(status_code=500, detail="Failed to send message")


@router.get("/webhook")
async def verify_webhook(request: Request):
    """Facebook Messenger Webhook Verification"""
    # Meta sends hub.mode, hub.verify_token, hub.challenge
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")
    
    from app.core.config import settings
    if mode == "subscribe" and token == settings.meta_verify_token:
        return Response(content=challenge, media_type="text/plain")
    raise HTTPException(status_code=403, detail="Invalid verify token")


@router.post("/webhook")
async def handle_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Receive messages from Facebook Messenger."""
    body = await request.json()
    
    if body.get("object") != "page":
        return Response(status_code=404)
        
    for entry in body.get("entry", []):
        page_id = entry.get("id")
        
        # Find business by page_id
        result = await db.execute(select(Business).where(Business.meta_page_id == page_id))
        business = result.scalar_one_or_none()
        
        if not business:
            logger.warning(f"Webhook received for unknown page_id: {page_id}")
            continue
            
        for messaging_event in entry.get("messaging", []):
            if "message" in messaging_event and not messaging_event["message"].get("is_echo"):
                sender_id = messaging_event["sender"]["id"]
                message_text = messaging_event["message"].get("text", "")
                
                if not message_text:
                    continue
                    
                # 1. Generate AI Reply asynchronously (in a real app, use background tasks)
                ai_reply = await ai_service.generate_messenger_reply(
                    message_text=message_text,
                    business_context={"name": business.name, "services": business.services}
                )
                
                # 2. Save message to DB
                new_msg = Message(
                    business_id=business.id,
                    platform="messenger",
                    sender_id=sender_id,
                    sender_name=f"User {sender_id[-4:]}",  # Ideally fetch from FB Profile API
                    message_text=message_text,
                    ai_reply_draft=ai_reply,
                    reply_status="pending",
                    is_read=False
                )
                db.add(new_msg)
                
    await db.commit()
    return Response(content="EVENT_RECEIVED", media_type="text/plain")
