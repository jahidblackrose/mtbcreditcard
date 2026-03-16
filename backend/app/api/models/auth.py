"""
Authentication-related models and schemas.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, EmailStr, field_validator


class UserRole(str, Enum):
    """User roles for staff authentication."""

    APPLICANT = "APPLICANT"
    RM = "RM"  # Relationship Manager
    BRANCH_MANAGER = "BRANCH_MANAGER"
    ADMIN = "ADMIN"


class OtpRequest(BaseModel):
    """OTP request model."""

    mobile_number: str = Field(
        ...,
        pattern=r"^01[3-9]\d{8}$",
        description="Bangladeshi mobile number (017xxxxxxxx)",
    )
    session_id: Optional[str] = Field(None, description="Optional session ID")


class OtpVerifyRequest(BaseModel):
    """OTP verification request."""

    mobile_number: str = Field(
        ...,
        pattern=r"^01[3-9]\d{8}$",
        description="Bangladeshi mobile number",
    )
    otp: str = Field(..., min_length=4, max_length=8, description="OTP code")
    session_id: Optional[str] = Field(None, description="Optional session ID")


class OtpResponse(BaseModel):
    """OTP response after requesting OTP."""

    otp_sent: bool = Field(..., description="Whether OTP was sent successfully")
    expires_in: int = Field(..., description="OTP expiry time in seconds")
    mobile_number: str = Field(..., description="Mobile number (partially masked)")
    attempts_remaining: Optional[int] = Field(None, description="Remaining attempts")


class OtpStatusResponse(BaseModel):
    """OTP status response."""

    mobile_number: str = Field(..., description="Mobile number (masked)")
    is_verified: bool = Field(..., description="Whether OTP has been verified")
    attempts_remaining: int = Field(..., description="Remaining verification attempts")
    is_locked: bool = Field(..., description="Whether account is locked")
    lockout_expires_at: Optional[str] = Field(None, description="Lockout expiry time")


class OtpVerifyResponse(BaseModel):
    """Response after successful OTP verification."""

    verified: bool = Field(..., description="Whether verification was successful")
    session_id: Optional[str] = Field(None, description="Associated session ID")
    user_exists: bool = Field(..., description="Whether user account exists")
    has_pending_applications: bool = Field(
        False,
        description="Whether user has pending applications",
    )


class CheckExistingApplicantRequest(BaseModel):
    """Request to check if applicant exists."""

    nid_number: str = Field(..., min_length=10, max_length=17, description="NID number")
    mobile_number: str = Field(
        ...,
        pattern=r"^01[3-9]\d{8}$",
        description="Bangladeshi mobile number",
    )


class CheckExistingApplicantResponse(BaseModel):
    """Response indicating if applicant already exists."""

    exists: bool = Field(..., description="Whether applicant exists")
    application_count: int = Field(..., description="Number of existing applications")
    can_apply: bool = Field(..., description="Whether user can submit new application")


class StaffLoginRequest(BaseModel):
    """Staff login request."""

    staff_id: str = Field(..., description="Staff ID")
    password: str = Field(..., min_length=6, description="Password")


class StaffLoginResponse(BaseModel):
    """Response after successful staff login."""

    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiry in seconds")
    user: "StaffUser" = Field(..., description="User information")


class StaffUser(BaseModel):
    """Staff user information."""

    user_id: str = Field(..., description="User ID")
    staff_id: str = Field(..., description="Staff ID")
    name: str = Field(..., description="Full name")
    role: UserRole = Field(..., description="User role")
    branch_id: Optional[str] = Field(None, description="Branch ID")
    branch_name: Optional[str] = Field(None, description="Branch name")


class RefreshTokenRequest(BaseModel):
    """Request to refresh access token."""

    refresh_token: str = Field(..., description="Refresh token")


class RefreshTokenResponse(BaseModel):
    """Response with new access token."""

    access_token: str = Field(..., description="New access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiry in seconds")
