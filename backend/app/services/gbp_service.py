"""Google Business Profile (GBP) Service."""
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class GBPService:
    def __init__(self):
        self.simulation_mode = settings.simulation_mode

    async def fetch_reviews(self, location_id: str, access_token: str) -> list[dict]:
        if self.simulation_mode or not access_token:
            logger.info("SIMULATION: Fetching mock GBP reviews")
            return [
                {
                    "google_review_id": "mock_rev_1",
                    "reviewer_name": "Rahim Khan",
                    "rating": 5,
                    "review_text": "Excellent service and food!",
                    "review_date": "2026-05-30T10:00:00Z"
                },
                {
                    "google_review_id": "mock_rev_2",
                    "reviewer_name": "Sadia Islam",
                    "rating": 3,
                    "review_text": "It was okay, but wait time was long.",
                    "review_date": "2026-05-29T14:30:00Z"
                }
            ]
        # Real API implementation goes here using httpx
        return []

    async def reply_to_review(self, location_id: str, review_id: str, reply_text: str, access_token: str) -> bool:
        if self.simulation_mode or not access_token:
            logger.info(f"SIMULATION: Replying to GBP review {review_id}")
            return True
        # Real API implementation
        return True

    async def get_completeness_score(self, location_id: str, access_token: str) -> dict:
        if self.simulation_mode or not access_token:
            return {
                "score": 65,
                "missing_fields": ["website", "hours", "attributes"]
            }
        return {"score": 0, "missing_fields": []}


gbp_service = GBPService()
