"""AI Generation Service — local Ollama (primary) or Groq API (fallback)."""
import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.provider = settings.ai_provider
        self.ollama_url = settings.ollama_base_url

    # ─────────────────────────────────────────────────────
    # Low-level generators
    # ─────────────────────────────────────────────────────

    async def _ollama(self, prompt: str, model: str) -> str:
        """Call local Ollama /api/generate."""
        async with httpx.AsyncClient(timeout=90.0) as client:
            try:
                resp = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={"model": model, "prompt": prompt, "stream": False},
                )
                resp.raise_for_status()
                return resp.json()["response"].strip()
            except Exception as e:
                logger.error(f"Ollama error ({model}): {e}")
                return ""

    async def _groq(self, prompt: str) -> str:
        """Groq API fallback (cloud LLM, fast)."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                    json={
                        "model": "llama-3.1-8b-instant",
                        "messages": [{"role": "user", "content": prompt}],
                    },
                )
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"].strip()
            except Exception as e:
                logger.error(f"Groq error: {e}")
                return ""

    async def generate(self, prompt: str, use_fast: bool = False) -> str:
        """Route to correct provider. Falls back to mock if all fail."""
        model = settings.ollama_fast_model if use_fast else settings.ollama_primary_model

        if self.provider == "groq" and settings.groq_api_key:
            result = await self._groq(prompt)
        else:
            result = await self._ollama(prompt, model)

        if not result:
            logger.warning("AI generation produced empty output — using placeholder")
            return "[AI generation unavailable — check Ollama is running]"
        return result

    # ─────────────────────────────────────────────────────
    # Business context builder
    # ─────────────────────────────────────────────────────

    def _build_business_context(self, business: dict) -> str:
        """Converts a business dict into a natural-language context string for prompts."""
        parts = []
        if business.get("name"):
            parts.append(f"Business Name: {business['name']}")
        if business.get("category"):
            parts.append(f"Type: {business['category']}")
        if business.get("location"):
            parts.append(f"Location: {business['location']}")
        if business.get("description"):
            parts.append(f"About: {business['description']}")
        if business.get("services"):
            services = business["services"]
            if isinstance(services, list):
                parts.append(f"Products/Services: {', '.join(services)}")
            elif isinstance(services, str):
                parts.append(f"Products/Services: {services}")
        if business.get("opening_hours"):
            hours = business["opening_hours"]
            if isinstance(hours, dict):
                hours_str = ", ".join(f"{k}: {v}" for k, v in hours.items())
                parts.append(f"Opening Hours: {hours_str}")
            else:
                parts.append(f"Opening Hours: {hours}")
        if business.get("phone"):
            parts.append(f"Contact: {business['phone']}")
        return "\n".join(parts) if parts else "A local business in Bangladesh"

    # ─────────────────────────────────────────────────────
    # Post Generation
    # ─────────────────────────────────────────────────────

    async def generate_post_caption(
        self,
        business_context: dict,
        tone: str = "friendly",
        occasion: str | None = None,
    ) -> dict:
        """Generates a Facebook post caption in English + Bangla with image prompt."""
        ctx = self._build_business_context(business_context)
        occasion_str = f"Topic/Occasion: {occasion}" if occasion else "Write an engaging promotional update"

        prompt = f"""You are an expert social media manager for businesses in Bangladesh.

{ctx}
Tone: {tone}
{occasion_str}

Write a compelling Facebook post. Reply ONLY in this exact format with no extra text:

[ENGLISH]
<English caption here>

[BANGLA]
<Bangla translation here>

[HASHTAGS]
<3-5 relevant hashtags>

[IMAGE_PROMPT]
<One sentence visual description for image generation, e.g. "A warm cozy cafe interior in Dhaka at golden hour">
"""
        raw = await self.generate(prompt, use_fast=False)

        # Parse sections
        sections = {"en": "", "bn": "", "hashtags": "", "image_prompt": ""}
        current = None
        for line in raw.split("\n"):
            line = line.strip()
            if line == "[ENGLISH]":
                current = "en"
            elif line == "[BANGLA]":
                current = "bn"
            elif line == "[HASHTAGS]":
                current = "hashtags"
            elif line == "[IMAGE_PROMPT]":
                current = "image_prompt"
            elif line and current:
                sections[current] += line + "\n"

        biz_name = business_context.get("name", "the business")
        return {
            "caption_en": sections["en"].strip() or raw,
            "caption_bn": sections["bn"].strip(),
            "hashtags": sections["hashtags"].strip(),
            "image_prompt": sections["image_prompt"].strip() or f"Professional photo for {biz_name}, Bangladesh",
        }

    # ─────────────────────────────────────────────────────
    # Messenger Reply
    # ─────────────────────────────────────────────────────

    async def generate_messenger_reply(
        self,
        message_text: str,
        business_context: dict,
    ) -> str:
        """Generate a short, helpful Messenger reply using business knowledge base."""
        ctx = self._build_business_context(business_context)

        prompt = f"""You are the AI customer assistant for the following business:

{ctx}

A customer sent this message on Facebook Messenger:
"{message_text}"

Instructions:
- Detect if the customer is writing in English, Bangla, or Banglish and reply in the SAME language
- Keep your reply short (2-3 sentences max)
- Be friendly, helpful, and professional
- If asking about hours, products, or prices, use the business info above
- Do NOT make up information not given above

Your reply:"""

        reply = await self.generate(prompt, use_fast=True)
        # Trim to reasonable length for Messenger
        return reply[:500] if reply else "Thank you for your message! We'll get back to you shortly."

    # ─────────────────────────────────────────────────────
    # Google Review Reply
    # ─────────────────────────────────────────────────────

    async def generate_review_reply(
        self,
        rating: int,
        review_text: str,
        business_context: dict,
    ) -> str:
        """Generate a professional Google Review reply."""
        ctx = self._build_business_context(business_context)

        if rating >= 4:
            tone_instruction = "Thank the customer warmly. Express genuine gratitude. Invite them to come back."
        elif rating == 3:
            tone_instruction = "Acknowledge their feedback positively. Thank them. Mention you're always improving."
        else:
            tone_instruction = "Apologize sincerely. Be empathetic. Promise to do better. Offer to resolve the issue."

        prompt = f"""You are the owner of this business:

{ctx}

A customer left this Google Review:
Rating: {rating}/5 stars
Review: "{review_text}"

Write a professional reply as the business owner.
Instructions:
- {tone_instruction}
- Reply in the SAME language as the review (English or Bangla)
- Keep it under 4 sentences
- Sound human, not like a robot
- Do NOT copy-paste generic templates

Your reply:"""

        reply = await self.generate(prompt, use_fast=False)
        return reply[:600] if reply else "Thank you for your feedback! We appreciate your time."

    # ─────────────────────────────────────────────────────
    # Image Prompt for Posts
    # ─────────────────────────────────────────────────────

    async def generate_image_prompt(self, caption: str, business_name: str) -> str:
        """Generate a detailed Pollinations.ai image prompt from a post caption."""
        prompt = f"""Convert this Facebook post caption into a visual image description for AI image generation.
Post: "{caption}"
Business: {business_name}

Write ONE sentence describing the ideal marketing image for this post.
Be specific about: subject, setting, colors, mood. Style: professional marketing photo, high quality.
Reply with ONLY the image description, nothing else."""

        result = await self.generate(prompt, use_fast=True)
        return result if result else f"Professional marketing photo for {business_name}, Bangladesh, warm colors"


ai_service = AIService()
