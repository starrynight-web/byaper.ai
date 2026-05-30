"""
RBAC middleware + workspace-scoped request context.

Usage in route handlers:
    workspace = Depends(get_workspace_context)
    # workspace.business_id, workspace.role, workspace.user_id
"""
from enum import Enum
from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.workspace import WorkspaceMember


class Role(str, Enum):
    OWNER = "owner"
    MANAGER = "manager"
    VIEWER = "viewer"


ROLE_HIERARCHY = {Role.OWNER: 3, Role.MANAGER: 2, Role.VIEWER: 1}


@dataclass
class WorkspaceContext:
    user_id: str
    business_id: str
    role: Role


async def get_workspace_context(
    x_business_id: str = Header(..., alias="X-Business-ID"),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> WorkspaceContext:
    """
    FastAPI dependency — validates that the authenticated user belongs to the
    requested business workspace and returns their role.

    Frontend must send `X-Business-ID: <uuid>` on every dashboard request.
    """
    result = await db.execute(
        select(WorkspaceMember).where(
            and_(
                WorkspaceMember.business_id == x_business_id,
                WorkspaceMember.user_id == user_id,
                WorkspaceMember.status == "active",
            )
        )
    )
    member = result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this workspace.",
        )

    return WorkspaceContext(
        user_id=user_id,
        business_id=x_business_id,
        role=Role(member.role),
    )


def require_role(*allowed_roles: Role):
    """
    Dependency factory — raises 403 if the user's role is insufficient.

    Example:
        @router.post("/team/invite")
        async def invite(ws: WorkspaceContext = Depends(require_role(Role.OWNER))):
            ...
    """
    async def _check(workspace: WorkspaceContext = Depends(get_workspace_context)) -> WorkspaceContext:
        if workspace.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This action requires one of: {[r.value for r in allowed_roles]}",
            )
        return workspace

    return _check
