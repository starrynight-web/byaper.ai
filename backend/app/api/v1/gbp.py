"""API Router for GBP (Google Business Profile)."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context
from app.services.gbp_service import gbp_service

router = APIRouter(prefix="/gbp", tags=["GBP"])

@router.get("/profile")
async def get_gbp_profile(
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    # Simplified for now
    return await gbp_service.get_completeness_score("location_id", "token")

@router.get("/insights")
async def get_gbp_insights(
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    return {"views": 1500, "searches": 400, "clicks": 85}
