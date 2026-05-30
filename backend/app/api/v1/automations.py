"""API Router for Automations."""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.automation import Automation
from app.models.business import Business
from app.schemas.automation import AutomationResponse, AutomationUpdate

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/automations", tags=["Automations"])

# Default automations created for every new business
DEFAULT_AUTOMATIONS = [
    {
        "type": "messenger_reply",
        "enabled": True,
        "full_auto_mode": False,
        "config": {
            "model": "deepseek-coder:6.7b",
            "delay_seconds": 0,
            "max_length": 200,
        },
        "description": "Automatically reply to Facebook Messenger messages using AI.",
    },
    {
        "type": "review_reply",
        "enabled": True,
        "full_auto_mode": False,
        "config": {
            "model": "llama3.1:8b",
            "check_interval_hours": 1,
        },
        "description": "Automatically generate and post replies to Google Reviews.",
    },
    {
        "type": "post_scheduler",
        "enabled": False,
        "full_auto_mode": False,
        "config": {
            "model": "llama3.1:8b",
            "frequency": "every_3_days",
            "post_time": "10:00",
            "include_image": True,
            "topics": [],
        },
        "description": "Automatically generate and publish Facebook posts on a schedule.",
    },
]


@router.get("", response_model=list[AutomationResponse])
async def list_automations(
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context),
):
    query = select(Automation).where(Automation.business_id == ws.business_id).order_by(Automation.created_at)
    result = await db.execute(query)
    automations = result.scalars().all()

    # Auto-initialize defaults if this business has no automations yet
    if not automations:
        created = []
        for default in DEFAULT_AUTOMATIONS:
            auto = Automation(
                business_id=ws.business_id,
                type=default["type"],
                enabled=default["enabled"],
                full_auto_mode=default["full_auto_mode"],
                config=default["config"],
            )
            db.add(auto)
            created.append(auto)
        await db.commit()
        for auto in created:
            await db.refresh(auto)
        return created

    return automations


@router.put("/{automation_id}", response_model=AutomationResponse)
async def update_automation(
    automation_id: uuid.UUID,
    req: AutomationUpdate,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER)),
):
    auto = await db.get(Automation, automation_id)
    if not auto or str(auto.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Automation not found")

    auto.enabled = req.enabled
    auto.full_auto_mode = req.full_auto_mode
    if req.config is not None:
        auto.config = {**(auto.config or {}), **req.config}

    await db.commit()
    await db.refresh(auto)
    return auto


@router.put("/business-context", response_model=dict)
async def update_business_context(
    req: dict,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER)),
):
    """Save AI knowledge base — used by all automation agents."""
    business = await db.get(Business, ws.business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    allowed_fields = {"name", "category", "location", "services", "description", "opening_hours", "tone", "phone", "website"}
    for key, value in req.items():
        if key in allowed_fields:
            setattr(business, key, value)

    await db.commit()
    return {"status": "saved", "message": "Business knowledge base updated. AI will use this context for all automated responses."}


@router.post("/run-now/{automation_type}", response_model=dict)
async def trigger_automation_now(
    automation_type: str,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER)),
):
    """Manually trigger a single automation cycle for testing."""
    from app.workers.auto_runner import run_automation_for_business
    try:
        result = await run_automation_for_business(
            business_id=ws.business_id,
            automation_type=automation_type,
            db=db,
        )
        return {"status": "completed", "result": result}
    except Exception as e:
        logger.error(f"Manual automation trigger failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
