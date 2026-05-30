"""API Router for Workspaces (Businesses)."""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.business import Business
from app.models.workspace import WorkspaceMember
from app.schemas.workspace import BusinessCreate, BusinessUpdate, BusinessResponse, BusinessOnboarding

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.get("", response_model=list[dict])
async def list_workspaces(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """List all workspaces the current user is a member of."""
    query = (
        select(WorkspaceMember, Business)
        .join(Business)
        .where(WorkspaceMember.user_id == user_id)
        .where(WorkspaceMember.status == "active")
    )
    result = await db.execute(query)
    
    workspaces = []
    for member, business in result.all():
        workspaces.append({
            "business": business,
            "role": member.role,
        })
    return workspaces


@router.post("", response_model=BusinessResponse)
async def create_workspace(
    req: BusinessCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Create a new business workspace and make the user the Owner."""
    new_business = Business(name=req.name)
    db.add(new_business)
    await db.flush()  # To get the ID
    
    owner_member = WorkspaceMember(
        business_id=new_business.id,
        user_id=user_id,
        role=Role.OWNER.value
    )
    db.add(owner_member)
    await db.commit()
    await db.refresh(new_business)
    return new_business


@router.get("/{business_id}", response_model=BusinessResponse)
async def get_workspace(
    business_id: uuid.UUID,
    ws: WorkspaceContext = Depends(get_workspace_context),
    db: AsyncSession = Depends(get_db)
):
    business = await db.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return business


@router.put("/{business_id}", response_model=BusinessResponse)
async def update_workspace(
    business_id: uuid.UUID,
    req: BusinessUpdate,
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER)),
    db: AsyncSession = Depends(get_db)
):
    business = await db.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    for key, value in req.model_dump(exclude_unset=True).items():
        setattr(business, key, value)
        
    await db.commit()
    await db.refresh(business)
    return business


@router.post("/{business_id}/setup", response_model=BusinessResponse)
async def setup_workspace(
    business_id: uuid.UUID,
    req: BusinessOnboarding,
    ws: WorkspaceContext = Depends(require_role(Role.OWNER)),
    db: AsyncSession = Depends(get_db)
):
    """Full onboarding one-shot save."""
    business = await db.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    for key, value in req.model_dump(exclude_unset=True).items():
        setattr(business, key, value)
        
    business.onboarding_complete = True
    await db.commit()
    await db.refresh(business)
    return business
