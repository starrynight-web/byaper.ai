"""Meta Graph API Service for Facebook Pages and Messenger."""
import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class MetaService:
    def __init__(self):
        self.base_url = "https://graph.facebook.com/v18.0"
        self.simulation_mode = settings.simulation_mode

    async def publish_post(self, page_id: str, access_token: str, message: str, image_url: str | None = None) -> str:
        if self.simulation_mode or not access_token:
            logger.info(f"SIMULATION: Publishing post to page {page_id}")
            return "simulated_fb_post_12345"

        endpoint = f"{self.base_url}/{page_id}/photos" if image_url else f"{self.base_url}/{page_id}/feed"
        payload = {"message": message, "access_token": access_token}
        if image_url:
            payload["url"] = image_url

        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(endpoint, data=payload)
                res.raise_for_status()
                return res.json().get("id", "")
            except Exception as e:
                logger.error(f"Meta API error: {e}")
                raise

    async def send_messenger_reply(self, page_id: str, access_token: str, recipient_id: str, text: str) -> bool:
        if self.simulation_mode or not access_token:
            logger.info(f"SIMULATION: Sending message to {recipient_id} via page {page_id}")
            return True

        endpoint = f"{self.base_url}/{page_id}/messages"
        payload = {
            "recipient": {"id": recipient_id},
            "message": {"text": text},
            "messaging_type": "RESPONSE",
            "access_token": access_token
        }

        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(endpoint, json=payload)
                res.raise_for_status()
                return True
            except Exception as e:
                logger.error(f"Meta Messenger API error: {e}")
                raise


meta_service = MetaService()
