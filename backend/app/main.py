"""FastAPI entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import (
    auth, workspaces, posts, messages, reviews, 
    gbp, automations, team, analytics
)

app = FastAPI(
    title="Byapar AI Backend",
    version="1.0.0",
    description="Multi-tenant AI Automation SaaS",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.app_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,  # CRITICAL: allows cookies to be sent cross-origin
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(workspaces.router, prefix="/api/v1")
app.include_router(posts.router, prefix="/api/v1")
app.include_router(messages.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(gbp.router, prefix="/api/v1")
app.include_router(automations.router, prefix="/api/v1")
app.include_router(team.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.environment}

