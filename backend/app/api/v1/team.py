"""API Router for Team (RBAC)."""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.workspace import WorkspaceMember
from app.models.analytics import Invitation
from app.schemas.team import TeamInviteRequest, TeamRoleUpdate, InvitationResponse

router = APIRouter(prefix="/team", tags=["Team"])

@router.get("", response_model=list[dict])
async def list_team(
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER))
):
    # Would join with User table to return names/emails
    return []


@router.post("/invite", response_model=InvitationResponse)
async def invite_member(
    req: TeamInviteRequest,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER))
):
    invitation = Invitation(
        business_id=ws.business_id,
        email=req.email,
        role=req.role,
        token=str(uuid.uuid4()), # basic token
        invited_by=ws.user_id
    )
    db.add(invitation)
    await db.commit()
    await db.refresh(invitation)
    return invitation


@router.put("/members/{member_id}")
async def update_member_role(
    member_id: uuid.UUID,
    req: TeamRoleUpdate,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER))
):
    member = await db.get(WorkspaceMember, member_id)
    if not member or str(member.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Member not found")
    
    if str(member.user_id) == ws.user_id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
        
    member.role = req.role
    await db.commit()
    return {"status": "success"}


@router.delete("/members/{member_id}")
async def remove_member(
    member_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER))
):
    member = await db.get(WorkspaceMember, member_id)
    if not member or str(member.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Member not found")
        
    if str(member.user_id) == ws.user_id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")
        
    await db.delete(member)
    await db.commit()
    return {"status": "removed"}
