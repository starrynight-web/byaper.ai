"""AI Generation Service — uses local Ollama or Groq API as fallback."""
import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.provider = settings.ai_provider
        self.ollama_url = settings.ollama_base_url
        self.groq_api_key = settings.groq_api_key

    async def _generate_ollama(self, prompt: str, model: str) -> str:
        """Call local Ollama."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={"model": model, "prompt": prompt, "stream": False},
                    timeout=60.0
                )
                response.raise_for_status()
                return response.json()["response"]
            except Exception as e:
                logger.error(f"Ollama generation failed: {e}")
                return "AI Generation currently unavailable. (Offline Mode)"

    async def _generate_groq(self, prompt: str, model: str) -> str:
        """Call Groq API (fallback)."""
        # Map ollama model names to groq model names
        groq_model = "llama-3.1-8b-instant" if "llama" in model else "mixtral-8x7b-32768"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.groq_api_key}"},
                    json={
                        "model": groq_model,
                        "messages": [{"role": "user", "content": prompt}],
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except Exception as e:
                logger.error(f"Groq generation failed: {e}")
                return "AI Generation currently unavailable. (Offline Mode)"

    async def generate_text(self, prompt: str, use_fast: bool = False) -> str:
        model = settings.ollama_primary_model if not use_fast else settings.ollama_fast_model
        if self.provider == "groq" and self.groq_api_key:
            return await self._generate_groq(prompt, model)
        return await self._generate_ollama(prompt, model)

    async def generate_post_caption(self, business_context: dict, tone: str, occasion: str | None = None) -> dict:
        """Generates a Facebook post caption in English and Bangla."""
        context_str = f"Name: {business_context.get('name')}, Category: {business_context.get('category')}, Services: {business_context.get('services')}"
        occasion_str = f"Occasion/Topic: {occasion}" if occasion else "Topic: Engaging general update"
        
        prompt = f"""
        You are an expert social media manager for a business in Bangladesh.
        Business Details: {context_str}
        Tone: {tone}
        {occasion_str}
        
        Generate a catchy Facebook post caption. 
        Format your response EXACTLY like this:
        [ENGLISH]
        (The english caption here)
        [BANGLA]
        (The bangla translation here)
        [HASHTAGS]
        (3-5 relevant hashtags)
        [IMAGE_PROMPT]
        (A short visual description to generate an accompanying image, e.g., "A cozy interior of a coffee shop in Dhaka")
        """
        
        raw_output = await self.generate_text(prompt)
        
        # Simple parser
        caption_en = ""
        caption_bn = ""
        hashtags = ""
        image_prompt = ""
        
        current_section = None
        for line in raw_output.split('\n'):
            line = line.strip()
            if line == "[ENGLISH]":
                current_section = "en"
            elif line == "[BANGLA]":
                current_section = "bn"
            elif line == "[HASHTAGS]":
                current_section = "hash"
            elif line == "[IMAGE_PROMPT]":
                current_section = "img"
            elif line:
                if current_section == "en": caption_en += line + "\n"
                elif current_section == "bn": caption_bn += line + "\n"
                elif current_section == "hash": hashtags += line + " "
                elif current_section == "img": image_prompt += line + " "
                
        return {
            "caption_en": caption_en.strip() or raw_output,
            "caption_bn": caption_bn.strip(),
            "hashtags": hashtags.strip(),
            "image_prompt": image_prompt.strip() or f"A photo representing {business_context.get('name')}"
        }

    async def generate_messenger_reply(self, message_text: str, business_context: dict) -> str:
        prompt = f"""
        You are an AI assistant managing Facebook Messenger for {business_context.get('name')}.
        Business Context: {business_context.get('services')}
        
        User Message: "{message_text}"
        
        Write a short, helpful, and polite reply. Detect if the user is writing in English, Bangla, or Banglish, and reply in the same language. Keep it under 3 sentences.
        """
        return await self.generate_text(prompt, use_fast=True)

    async def generate_review_reply(self, rating: int, review_text: str, business_context: dict) -> str:
        prompt = f"""
        You are an AI assistant managing Google Reviews for {business_context.get('name')}.
        Rating: {rating} / 5
        Review Text: "{review_text}"
        
        Write a professional reply from the owner. 
        If 5 stars, thank them warmly.
        If 1-3 stars, apologize, be empathetic, and offer to make it right.
        Reply in the same language as the review.
        """
        return await self.generate_text(prompt, use_fast=True)


ai_service = AIService()
