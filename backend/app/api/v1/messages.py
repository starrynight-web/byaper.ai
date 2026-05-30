"""API Router for Messages (Messenger)."""
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.message import Message
from app.schemas.message import MessageResponse, MessageReplyOverride
from app.services.meta_service import meta_service

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
        
    # TODO: Fetch business page_id and access_token to send via meta_service
    # For now, just mark as sent
    msg.reply_status = "sent"
    await db.commit()
    return {"status": "sent"}

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
        
    msg.reply_text = req.reply_text
    msg.reply_status = "sent"
    await db.commit()
    return {"status": "sent"}
