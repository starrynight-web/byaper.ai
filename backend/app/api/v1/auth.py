"""API Router for Auth (Sync)."""
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user_id, verify_supabase_token
from app.models.user import User
from app.schemas.auth import UserSyncRequest, UserResponse
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/sync-user", response_model=UserResponse)
async def sync_user(
    req: UserSyncRequest,
    payload: dict = Depends(verify_supabase_token),
    db: AsyncSession = Depends(get_db)
):
    """
    Called by frontend after Supabase OAuth login.
    Ensures user exists in our local DB and updates last_login.
    """
    user_id_str = payload["sub"]
    
    result = await db.execute(select(User).where(User.id == user_id_str))
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(
            id=user_id_str,
            email=req.email,
            name=req.name,
            avatar_url=req.avatar_url,
            google_id=req.google_id,
            last_login=datetime.now(timezone.utc)
        )
        db.add(user)
    else:
        user.last_login = datetime.now(timezone.utc)
        if req.name: user.name = req.name
        if req.avatar_url: user.avatar_url = req.avatar_url
        
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one()
