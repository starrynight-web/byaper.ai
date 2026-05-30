"""Review model — Google reviews + AI reply drafts."""
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    google_review_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    reviewer_name: Mapped[str | None] = mapped_column(String(255))
    reviewer_avatar: Mapped[str | None] = mapped_column(Text)
    rating: Mapped[int | None] = mapped_column(Integer)  # 1–5
    review_text: Mapped[str | None] = mapped_column(Text)
    ai_reply_draft: Mapped[str | None] = mapped_column(Text)
    posted_reply: Mapped[str | None] = mapped_column(Text)
    reply_status: Mapped[str] = mapped_column(String(50), default="pending")  # pending/approved/posted/failed
    review_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    replied_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    business: Mapped["Business"] = relationship(back_populates="reviews")
