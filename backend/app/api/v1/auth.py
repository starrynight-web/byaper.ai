"""
Auth Router — Google OAuth 2.0 (Direct, no Supabase Auth).
Flow:
  1. GET /auth/google/login  → redirects browser to Google consent screen
  2. GET /auth/google/callback → Google redirects here with ?code=
                               → exchange code for tokens
                               → upsert user in DB
                               → issue our own JWT
                               → redirect to frontend with httpOnly cookie set
"""
import httpx
import urllib.parse
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@router.get("/google/login")
async def google_login():
    """Redirect browser to Google OAuth consent screen."""
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }
    url = f"{GOOGLE_AUTH_URL}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=url)


@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    """
    Google redirects here after user consents.
    Exchange code → access token → user info → upsert user → set JWT cookie.
    """
    # 1. Exchange authorization code for tokens
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": settings.google_redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange code for token")
        token_data = token_resp.json()
        google_access_token = token_data.get("access_token")

        # 2. Fetch user info from Google
        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {google_access_token}"},
        )
        if userinfo_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user info from Google")
        userinfo = userinfo_resp.json()

    google_id = userinfo.get("sub")
    email = userinfo.get("email")
    name = userinfo.get("name")
    avatar_url = userinfo.get("picture")

    if not email:
        raise HTTPException(status_code=400, detail="No email returned from Google")

    # 3. Upsert user in database
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        # New user — create profile
        user = User(
            email=email,
            name=name,
            avatar_url=avatar_url,
            google_id=google_id,
            last_login=datetime.now(timezone.utc),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        # Existing user — update info
        user.last_login = datetime.now(timezone.utc)
        user.name = name or user.name
        user.avatar_url = avatar_url or user.avatar_url
        user.google_id = google_id or user.google_id
        await db.commit()
        await db.refresh(user)

    # 4. Create our own JWT
    jwt_token = create_access_token(
        user_id=str(user.id),
        email=user.email,
        name=user.name,
    )

    # 5. Redirect to frontend, set httpOnly cookie
    frontend_url = f"{settings.app_url}/auth/callback"
    response = RedirectResponse(url=frontend_url, status_code=302)
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
        path="/",
    )
    return response


@router.get("/me")
async def get_me(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the authenticated user's profile."""
    result = await db.execute(select(User).where(User.id == user["sub"]))
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(db_user.id),
        "email": db_user.email,
        "name": db_user.name,
        "avatar_url": db_user.avatar_url,
    }


@router.post("/logout")
async def logout():
    """Clear the JWT cookie."""
    response = Response(content='{"status": "logged out"}', media_type="application/json")
    response.delete_cookie(key="access_token", path="/")
    return response
