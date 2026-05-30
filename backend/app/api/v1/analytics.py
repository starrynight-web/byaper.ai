"""API Router for Analytics."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
async def get_analytics_summary(
    period: str = "7d",
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    return {
        "posts_published": 5,
        "reviews_replied": 12,
        "messages_handled": 30,
        "avg_response_time_seconds": 45
    }
