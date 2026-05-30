"""Queue Service using Upstash QStash for background jobs."""
import httpx
import logging
import json
from app.core.config import settings

logger = logging.getLogger(__name__)


class QueueService:
    def __init__(self):
        self.qstash_url = settings.upstash_qstash_url
        self.token = settings.upstash_qstash_token
        self.backend_url = settings.backend_url

    async def enqueue(self, path: str, payload: dict, delay_seconds: int = 0) -> bool:
        """
        Pushes a job to QStash which will call `backend_url + path` via POST.
        """
        if not self.token:
            logger.info(f"SIMULATION: QStash skipped for {path} (no token)")
            return True

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        if delay_seconds > 0:
            headers["Upstash-Delay"] = f"{delay_seconds}s"

        target_url = f"{self.backend_url}{path}"
        
        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(
                    f"{self.qstash_url}/{target_url}",
                    headers=headers,
                    json=payload
                )
                res.raise_for_status()
                return True
            except Exception as e:
                logger.error(f"QStash enqueue failed: {e}")
                return False


queue_service = QueueService()
