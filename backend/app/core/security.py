"""
JWT Security Module — Byapar AI owns the entire auth flow.
Google OAuth is handled directly by FastAPI backend.
Supabase is used only as a database.
"""
from datetime import datetime, timedelta, timezone

from fastapi import Cookie, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from typing import Optional

from app.core.config import settings

_bearer = HTTPBearer(auto_error=False)


def create_access_token(user_id: str, email: str, name: str | None = None) -> str:
    """Create a signed JWT for the authenticated user."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": user_id,
        "email": email,
        "name": name or "",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    """Decode and verify a JWT. Raises 401 on failure."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        if not payload.get("sub"):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {exc}",
        ) from exc


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(_bearer),
    access_token: Optional[str] = Cookie(default=None),
) -> dict:
    """
    FastAPI dependency — accepts token from:
    1. Authorization: Bearer <token> header (API clients)
    2. access_token httpOnly cookie (browser)
    """
    token = None

    if credentials and credentials.credentials:
        token = credentials.credentials
    elif access_token:
        token = access_token

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return decode_token(token)


def get_current_user_id(user: dict = Security(get_current_user)) -> str:
    """FastAPI dependency — returns the authenticated user's UUID string."""
    return user["sub"]
