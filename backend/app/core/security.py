"""
JWT validation using Supabase-issued tokens.
Verifies that incoming requests carry a valid Supabase session JWT.
"""
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings

_bearer = HTTPBearer(auto_error=True)


def _get_jwt_secret() -> str:
    """
    Supabase JWTs are signed with the project JWT secret.
    For local validation we use the anon key's base secret.
    In production, use SUPABASE_JWT_SECRET env var (from Supabase dashboard).
    """
    return settings.supabase_anon_key


def verify_supabase_token(
    credentials: HTTPAuthorizationCredentials = Security(_bearer),
) -> dict:
    """
    FastAPI dependency. Returns the decoded JWT payload (claims).
    Raises 401 if token is invalid or expired.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            _get_jwt_secret(),
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
            )
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {exc}",
        ) from exc


def get_current_user_id(payload: dict = Security(verify_supabase_token)) -> str:
    """FastAPI dependency — returns the authenticated user's UUID string."""
    return payload["sub"]
