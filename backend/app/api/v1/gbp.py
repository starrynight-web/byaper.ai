"""API Router for GBP (Google Business Profile)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context
from app.services.gbp_service import gbp_service
from app.services.ai_service import ai_service
from app.models.business import Business

router = APIRouter(prefix="/gbp", tags=["GBP"])

@router.get("/profile")
async def get_gbp_profile(
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    business = await db.get(Business, ws.business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    score_data = await gbp_service.get_completeness_score(
        location_id=business.gbp_location_id or "simulated_location",
        access_token=business.google_access_token or "simulated_token"
    )
    
    # Generate AI recommendations based on missing fields
    recommendations = []
    if "website" in score_data["missing_fields"]:
        recommendations.append("Add a website link to drive direct bookings/sales.")
    if "hours" in score_data["missing_fields"]:
        recommendations.append("Update your business hours to prevent customer frustration.")
    if "attributes" in score_data["missing_fields"]:
        recommendations.append("Add attributes like 'Free Wi-Fi' or 'Wheelchair accessible' to stand out.")
        
    if not recommendations:
        recommendations.append("Your profile is fully optimized! Keep posting updates to maintain engagement.")

    return {
        "score": score_data["score"],
        "missing_fields": score_data["missing_fields"],
        "recommendations": recommendations,
        "is_connected": bool(business.gbp_location_id)
    }

@router.get("/insights")
async def get_gbp_insights(
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    business = await db.get(Business, ws.business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    # In a real app, this fetches metrics from Google Business Profile Performance API
    # We return simulated data for the demo
    return {
        "views": 2450,
        "searches": 840,
        "clicks": 125,
        "calls": 32,
        "directions": 45,
        "trend_percentage": 12.5  # Positive trend
    }
