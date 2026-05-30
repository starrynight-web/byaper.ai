"""API Router for Automations."""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.automation import Automation
from app.schemas.automation import AutomationResponse, AutomationUpdate

router = APIRouter(prefix="/automations", tags=["Automations"])

DEFAULT_AUTOMATIONS = [
    {
        "trigger_type": "facebook_webhook",
        "action_type": "ai_messenger_reply",
        "description": "Auto-generate AI replies for incoming Facebook messages.",
        "enabled": True,
        "config": {"model": "Mistral-7B", "delay_minutes": 0}
    },
    {
        "trigger_type": "gbp_webhook",
        "action_type": "ai_review_reply",
        "description": "Auto-generate AI replies for new Google Reviews.",
        "enabled": True,
        "config": {"model": "Mistral-7B"}
    },
    {
        "trigger_type": "schedule",
        "action_type": "ai_post_generation",
        "description": "Auto-generate and schedule weekly social media posts.",
        "enabled": False,
        "config": {"frequency": "weekly", "day": "Monday"}
    }
]


@router.get("", response_model=list[AutomationResponse])
async def list_automations(
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    query = select(Automation).where(Automation.business_id == ws.business_id)
    result = await db.execute(query)
    automations = result.scalars().all()
    
    # Auto-initialize defaults if none exist
    if not automations:
        for default_config in DEFAULT_AUTOMATIONS:
            auto = Automation(
                business_id=ws.business_id,
                trigger_type=default_config["trigger_type"],
                action_type=default_config["action_type"],
                description=default_config["description"],
                enabled=default_config["enabled"],
                config=default_config["config"]
            )
            db.add(auto)
            automations.append(auto)
        await db.commit()
        for auto in automations:
            await db.refresh(auto)
            
    return automations


@router.put("/{automation_id}", response_model=AutomationResponse)
async def update_automation(
    automation_id: uuid.UUID,
    req: AutomationUpdate,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    auto = await db.get(Automation, automation_id)
    if not auto or str(auto.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Automation not found")
        
    auto.enabled = req.enabled
    if req.config is not None:
        auto.config = req.config
        
    await db.commit()
    await db.refresh(auto)
    return auto
