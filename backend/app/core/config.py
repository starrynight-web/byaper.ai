from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Supabase
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_anon_key: str = ""

    # Database
    database_url: str = ""

    # Upstash
    upstash_redis_url: str = ""
    upstash_redis_token: str = ""
    upstash_qstash_token: str = ""
    upstash_qstash_url: str = ""

    # AI
    ai_provider: str = "ollama"  # "ollama" | "groq"
    ollama_base_url: str = "http://localhost:11434"
    ollama_primary_model: str = "llama3.1:8b"
    ollama_reply_model: str = "mistral:7b"
    ollama_fast_model: str = "phi3:mini"
    groq_api_key: str = ""

    # Image Generation
    pollinations_api_url: str = "https://image.pollinations.ai/prompt/"

    # Meta
    meta_app_id: str = ""
    meta_app_secret: str = ""
    meta_verify_token: str = "byaper_webhook_verify_token"

    # Google
    google_client_id: str = ""
    google_client_secret: str = ""
    gbp_api_key: str = ""

    # App
    simulation_mode: bool = True
    app_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"
    environment: str = "development"
    sentry_dsn: str = ""

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
