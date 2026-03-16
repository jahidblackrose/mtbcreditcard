"""
Application-related models and schemas.
"""

from datetime import datetime
from enum import Enum
from typing import Optional, Any

from pydantic import BaseModel, Field


class ApplicationStatus(str, Enum):
    """Application status values."""

    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    DOCUMENTS_REQUIRED = "DOCUMENTS_REQUIRED"
    VERIFICATION_PENDING = "VERIFICATION_PENDING"


class ApplicationMode(str, Enum):
    """Application mode."""

    SELF = "SELF"
    ASSISTED = "ASSISTED"


class CreateApplicationRequest(BaseModel):
    """Request to create a new application."""

    mode: ApplicationMode = Field(..., description="Application mode")
    card_id: Optional[str] = Field(None, description="Card product ID")


class CreateApplicationResponse(BaseModel):
    """Response after creating an application."""

    application_id: str = Field(..., description="Application ID")
    reference_number: Optional[str] = Field(None, description="Reference number (if generated)")
    status: ApplicationStatus = Field(..., description="Application status")
    created_at: str = Field(..., description="Creation timestamp")


class ApplicationDetails(BaseModel):
    """Full application details."""

    application_id: str = Field(..., description="Application ID")
    reference_number: Optional[str] = Field(None, description="Reference number")
    mode: ApplicationMode = Field(..., description="Application mode")
    status: ApplicationStatus = Field(..., description="Application status")
    card_id: Optional[str] = Field(None, description="Selected card ID")

    # Applicant info
    applicant_name: Optional[str] = Field(None, description="Applicant full name")
    mobile_number: Optional[str] = Field(None, description="Mobile number")
    email: Optional[str] = Field(None, description="Email address")
    nid_number: Optional[str] = Field(None, description="NID number")

    # Metadata
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Last update timestamp")
    submitted_at: Optional[str] = Field(None, description="Submission timestamp")

    # RM-assisted fields
    rm_id: Optional[str] = Field(None, description="RM user ID")
    branch_id: Optional[str] = Field(None, description="Branch ID")


class UpdateApplicationStatusRequest(BaseModel):
    """Request to update application status."""

    status: ApplicationStatus = Field(..., description="New status")
    reason: Optional[str] = Field(None, description="Reason for status change")


class SubmitApplicationRequest(BaseModel):
    """Request to submit an application."""

    session_id: Optional[str] = Field(None, description="Associated session ID")


class SubmitApplicationResponse(BaseModel):
    """Response after submitting an application."""

    application_id: str = Field(..., description="Application ID")
    reference_number: str = Field(..., description="Generated reference number")
    status: ApplicationStatus = Field(..., description="Application status")
    submitted_at: str = Field(..., description="Submission timestamp")


class ApplicationListItem(BaseModel):
    """Application in list view."""

    application_id: str = Field(..., description="Application ID")
    reference_number: Optional[str] = Field(None, description="Reference number")
    status: ApplicationStatus = Field(..., description="Application status")
    applicant_name: Optional[str] = Field(None, description="Applicant name")
    mobile_number: Optional[str] = Field(None, description="Mobile number")
    card_name: Optional[str] = Field(None, description="Card product name")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Last update timestamp")
