"""Business workspace model — the core multi-tenant entity."""
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100))  # Restaurant/Clinic/Salon/Retail/Hotel
    description: Mapped[str | None] = mapped_column(Text)
    location: Mapped[str | None] = mapped_column(Text)
    city: Mapped[str | None] = mapped_column(String(100))
    phone: Mapped[str | None] = mapped_column(String(50))
    website: Mapped[str | None] = mapped_column(String(255))
    tone: Mapped[str | None] = mapped_column(String(50))  # friendly / formal / casual
    services: Mapped[dict | None] = mapped_column(JSONB)   # {items: [...], menu: [...]}
    logo_url: Mapped[str | None] = mapped_column(Text)

    # Facebook / Meta
    facebook_page_id: Mapped[str | None] = mapped_column(String(255))
    facebook_access_token: Mapped[str | None] = mapped_column(Text)

    # Google Business Profile
    gbp_account_id: Mapped[str | None] = mapped_column(String(255))
    gbp_location_id: Mapped[str | None] = mapped_column(String(255))
    gbp_access_token: Mapped[str | None] = mapped_column(Text)

    # Plan & settings
    plan: Mapped[str] = mapped_column(String(50), default="starter")  # starter/growth/pro/business
    simulation_mode: Mapped[bool] = mapped_column(Boolean, default=True)
    onboarding_complete: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    members: Mapped[list["WorkspaceMember"]] = relationship(back_populates="business")
    posts: Mapped[list["Post"]] = relationship(back_populates="business")
    messages: Mapped[list["Message"]] = relationship(back_populates="business")
    reviews: Mapped[list["Review"]] = relationship(back_populates="business")
    automations: Mapped[list["Automation"]] = relationship(back_populates="business")
