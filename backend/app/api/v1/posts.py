"""API Router for Posts."""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.middleware import WorkspaceContext, get_workspace_context, require_role, Role
from app.models.post import Post
from app.models.business import Business
from app.schemas.post import PostResponse, PostGenerateRequest, PostGenerateResponse, PostCreate, PostUpdate
from app.services.ai_service import ai_service
from app.services.image_service import image_service
from app.services.queue_service import queue_service

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/generate", response_model=PostGenerateResponse)
async def generate_post(
    req: PostGenerateRequest,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    business = await db.get(Business, ws.business_id)
    business_context = {
        "name": business.name,
        "category": business.category,
        "services": business.services
    }
    tone = req.tone_override or business.tone or "friendly"
    
    # 1. Generate text
    ai_result = await ai_service.generate_post_caption(business_context, tone, req.occasion)
    
    # 2. Generate image URL
    image_url = None
    if ai_result["image_prompt"]:
        image_url = await image_service.generate_image_url(ai_result["image_prompt"])
        ai_result["image_url"] = image_url

    return ai_result


@router.post("", response_model=PostResponse)
async def create_post(
    req: PostCreate,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    new_post = Post(
        business_id=ws.business_id,
        content=req.content,
        image_url=req.image_url,
        image_prompt=req.image_prompt,
        platform=req.platform,
        status="draft"
    )
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    return new_post


@router.get("", response_model=list[PostResponse])
async def list_posts(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(get_workspace_context)
):
    query = select(Post).where(Post.business_id == ws.business_id).order_by(Post.created_at.desc())
    if status:
        query = query.where(Post.status == status)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/{post_id}/schedule")
async def schedule_post(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    ws: WorkspaceContext = Depends(require_role(Role.OWNER, Role.MANAGER))
):
    post = await db.get(Post, post_id)
    if not post or str(post.business_id) != ws.business_id:
        raise HTTPException(status_code=404, detail="Post not found")

    post.status = "scheduled"
    await db.commit()
    
    # Enqueue background job (immediate for demo purposes)
    await queue_service.enqueue("/workers/publish-post", {"post_id": str(post_id)})
    
    return {"status": "scheduled"}
