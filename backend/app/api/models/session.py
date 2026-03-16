"""
Session-related models and schemas.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ApplicationMode(str, Enum):
    """Application mode (self-service vs assisted)."""

    SELF = "SELF"
    ASSISTED = "ASSISTED"


class SessionState(BaseModel):
    """Session state model."""

    session_id: str = Field(..., description="Unique session identifier")
    mode: ApplicationMode = Field(..., description="Application mode")
    created_at: str = Field(..., description="Session creation timestamp (ISO 8601)")
    expires_at: str = Field(..., description="Session expiration timestamp (ISO 8601)")
    ttl_seconds: int = Field(..., description="Time to live in seconds")
    is_active: bool = Field(..., description="Whether session is active")

    # Optional session data
    application_id: Optional[str] = Field(None, description="Associated application ID")
    mobile_number: Optional[str] = Field(None, description="Verified mobile number")
    current_step: Optional[str] = Field(None, description="Current form step")


class CreateSessionRequest(BaseModel):
    """Request to create a new session."""

    mode: ApplicationMode = Field(..., description="Application mode")


class CreateSessionResponse(BaseModel):
    """Response after creating a session."""

    session_id: str = Field(..., description="Session ID")
    mode: ApplicationMode = Field(..., description="Application mode")
    expires_at: str = Field(..., description="Expiration timestamp")
    ttl_seconds: int = Field(..., description="Time to live in seconds")


class ExtendSessionRequest(BaseModel):
    """Request to extend a session."""

    extension_minutes: int = Field(
        default=30,
        ge=5,
        le=120,
        description="Extension duration in minutes",
    )


class SessionValidationResponse(BaseModel):
    """Session validation response."""

    session_id: str = Field(..., description="Session ID")
    is_valid: bool = Field(..., description="Whether session is valid")
    is_expired: bool = Field(..., description="Whether session is expired")
    ttl_seconds: int = Field(..., description="Remaining time in seconds")
    mode: Optional[ApplicationMode] = Field(None, description="Application mode")
