"""Image Generation Service using Pollinations.ai (Free/No-Key API)."""
import urllib.parse
from app.core.config import settings


class ImageService:
    def __init__(self):
        self.base_url = settings.pollinations_api_url

    async def generate_image_url(self, prompt: str, width: int = 1024, height: int = 1024) -> str:
        """
        Pollinations.ai is a free URL-based API. 
        Returns the formatted URL that can be directly embedded in frontend 
        or downloaded and saved to Supabase Storage.
        """
        encoded_prompt = urllib.parse.quote(prompt)
        # Using a fixed seed for testing, or could randomise it
        url = f"{self.base_url}{encoded_prompt}?width={width}&height={height}&nologo=true"
        return url


image_service = ImageService()
