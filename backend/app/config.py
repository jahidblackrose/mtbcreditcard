"""
Application configuration management using Pydantic Settings.
"""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "MTB Credit Card API"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Database
    db_user: str = "mtb_credit"
    db_password: str = ""
    db_host: str = "localhost"
    db_port: int = 1521
    db_service_name: str = "XE"
    db_pool_min: int = 2
    db_pool_max: int = 10
    db_pool_increment: int = 1

    @property
    def db_dsn(self) -> str:
        """Construct database DSN."""
        return f"{self.db_user}/{self.db_password}@{self.db_host}:{self.db_port}/{self.db_service_name}"

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""
    redis_db: int = 0
    redis_session_ttl: int = 1800  # 30 minutes

    @property
    def redis_url(self) -> str:
        """Construct Redis URL."""
        if self.redis_password:
            return f"redis://:{self.redis_password}@{self.redis_host}:{self.redis_port}/{self.redis_db}"
        return f"redis://{self.redis_host}:{self.redis_port}/{self.redis_db}"

    # JWT
    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 7

    # CORS
    frontend_url: str = "http://localhost:5173"
    allowed_origins: List[str] = Field(
        default=["http://localhost:5173", "https://mtb.com.bd"]
    )

    # Rate Limiting
    otp_rate_limit_per_hour: int = 5
    draft_rate_limit_per_minute: int = 10
    general_rate_limit_per_minute: int = 100

    # File Upload
    max_file_size_mb: int = 5
    allowed_file_extensions: List[str] = Field(
        default=["jpg", "jpeg", "png", "pdf"]
    )

    # Logging
    log_level: str = "INFO"
    log_format: str = "json"

    # OTP
    otp_length: int = 6
    otp_expiry_minutes: int = 5
    otp_max_attempts: int = 5
    otp_lockout_minutes: int = 30


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
