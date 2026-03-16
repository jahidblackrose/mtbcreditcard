"""
Draft-related models and schemas.
"""

from datetime import datetime
from typing import Optional, Any

from pydantic import BaseModel, Field


class DraftStepData(BaseModel):
    """Data for a single draft step."""

    step_number: int = Field(..., ge=1, le=12, description="Step number (1-12)")
    step_name: str = Field(..., description="Step name")
    data: dict = Field(..., description="Step data")
    is_complete: bool = Field(default=False, description="Whether step is complete")


class DraftState(BaseModel):
    """Complete draft state."""

    session_id: str = Field(..., description="Session ID")
    mode: str = Field(..., description="Application mode")
    application_id: Optional[str] = Field(None, description="Associated application ID")
    created_at: str = Field(..., description="Draft creation timestamp")
    updated_at: str = Field(..., description="Last update timestamp")
    expires_at: str = Field(..., description="Expiration timestamp")
    steps: dict[str, Any] = Field(default_factory=dict, description="All step data")
    current_step: Optional[int] = Field(None, description="Current step number")


class DraftVersion(BaseModel):
    """Single draft version."""

    version_id: str = Field(..., description="Version ID")
    step_number: int = Field(..., description="Step number")
    step_name: str = Field(..., description="Step name")
    saved_at: str = Field(..., description="Save timestamp")
    is_complete: bool = Field(..., description="Whether step was complete")


class InitializeDraftRequest(BaseModel):
    """Request to initialize a draft."""

    session_id: str = Field(..., description="Session ID")
    mode: str = Field(..., description="Application mode")


class SaveDraftRequest(BaseModel):
    """Request to save draft step."""

    session_id: str = Field(..., description="Session ID")
    step_number: int = Field(..., ge=1, le=12, description="Step number")
    step_name: str = Field(..., description="Step name")
    data: dict = Field(..., description="Step data")
    is_complete: bool = Field(default=False, description="Whether step is complete")
