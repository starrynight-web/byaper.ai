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

@router.get("", response_model=list[AutomationResponse])
async def list_automations(
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    query = select(Automation).where(Automation.business_id == ws.business_id)
    result = await db.execute(query)
    return result.scalars().all()


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
