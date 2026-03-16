"""
Authentication and OTP API endpoints.

Corresponding Procedures:
- 511: check_existing_applicant
- 512: request_otp
- 513: verify_otp
- 514: get_otp_status
- 515: verify_otp_extended

Plus staff JWT authentication (separate from procedures).
"""

import logging
from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from oracledb import Connection

from app.api.models import ApiResponse
from app.api.models.auth import (
    CheckExistingApplicantRequest,
    CheckExistingApplicantResponse,
    OtpRequest,
    OtpResponse,
    OtpStatusResponse,
    OtpVerifyRequest,
    OtpVerifyResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    StaffLoginRequest,
    StaffLoginResponse,
    StaffUser,
    UserRole,
)
from app.config import settings
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure
from app.security.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# HTTP Bearer scheme for staff authentication
security = HTTPBearer()


@router.post("/check-existing", response_model=ApiResponse)
async def check_existing_applicant(
    request: CheckExistingApplicantRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Check if an applicant already exists in the system.

    Calls procedure 511 (check_existing_applicant).

    Args:
        request: Request with NID and mobile number
        db: Database connection

    Returns:
        ApiResponse with existence check result
    """
    try:
        result = await call_procedure(
            db,
            "check_existing_applicant",
            p_json_in={
                "nidNumber": request.nid_number,
                "mobileNumber": request.mobile_number,
            },
        )

        data = result.data or {}
        return ApiResponse(
            status=200,
            message="Applicant check completed",
            data=data,
        )

    except ProcedureError as e:
        logger.error(f"Error checking existing applicant: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/otp/request", response_model=ApiResponse)
async def request_otp(
    request: OtpRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Request OTP for mobile verification.

    Calls procedure 512 (request_otp).

    Rate limiting: 5 requests per hour per mobile number.

    Args:
        request: OTP request with mobile number
        db: Database connection

    Returns:
        ApiResponse with OTP sent confirmation
    """
    try:
        result = await call_procedure(
            db,
            "request_otp",
            p_json_in={
                "mobileNumber": request.mobile_number,
                "sessionId": request.session_id,
            },
        )

        data = result.data or {}
        # Mask mobile number in response
        masked_mobile = (
            request.mobile_number[:4] + "******" + request.mobile_number[-2:]
            if len(request.mobile_number) >= 6
            else "*******"
        )

        return ApiResponse(
            status=200,
            message="OTP sent successfully",
            data=OtpResponse(
                otp_sent=True,
                expires_in=data.get("expiresIn", settings.otp_expiry_minutes * 60),
                mobile_number=masked_mobile,
                attempts_remaining=data.get("attemptsRemaining", 5),
            ).model_dump(),
        )

    except ProcedureError as e:
        logger.error(f"Error requesting OTP: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/otp/verify", response_model=ApiResponse)
async def verify_otp(
    request: OtpVerifyRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Verify OTP code.

    Calls procedure 513 (verify_otp).

    Rate limiting: Max 5 attempts before lockout.

    Args:
        request: OTP verification request
        db: Database connection

    Returns:
        ApiResponse with verification result
    """
    try:
        result = await call_procedure(
            db,
            "verify_otp",
            p_json_in={
                "mobileNumber": request.mobile_number,
                "otp": request.otp,
                "sessionId": request.session_id,
            },
        )

        data = result.data or {}
        return ApiResponse(
            status=200,
            message="OTP verified successfully",
            data=OtpVerifyResponse(
                verified=True,
                session_id=data.get("sessionId"),
                user_exists=data.get("userExists", False),
                has_pending_applications=data.get("hasPendingApplications", False),
            ).model_dump(),
        )

    except ProcedureError as e:
        if e.code == 513:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=e.message,
            )
        logger.error(f"Error verifying OTP: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/otp/status", response_model=ApiResponse)
async def get_otp_status(
    mobile_number: str,
    session_id: Optional[str] = None,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get OTP verification status.

    Calls procedure 514 (get_otp_status).

    Args:
        mobile_number: Mobile number
        session_id: Optional session ID
        db: Database connection

    Returns:
        ApiResponse with OTP status
    """
    try:
        result = await call_procedure(
            db,
            "get_otp_status",
            p_json_in={
                "mobileNumber": mobile_number,
                "sessionId": session_id,
            },
        )

        data = result.data or {}
        # Mask mobile
        masked_mobile = (
            mobile_number[:4] + "******" + mobile_number[-2:]
            if len(mobile_number) >= 6
            else "*******"
        )

        return ApiResponse(
            status=200,
            message="OTP status retrieved",
            data={
                "mobile_number": masked_mobile,
                "is_verified": data.get("isVerified", False),
                "attempts_remaining": data.get("attemptsRemaining", 5),
                "is_locked": data.get("isLocked", False),
                "lockout_expires_at": data.get("lockoutExpiresAt"),
            },
        )

    except ProcedureError as e:
        logger.error(f"Error getting OTP status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/otp/verify-extended", response_model=ApiResponse)
async def verify_otp_extended(
    request: OtpVerifyRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Verify OTP with extended response (includes user details).

    Calls procedure 515 (verify_otp_extended).

    Args:
        request: OTP verification request
        db: Database connection

    Returns:
        ApiResponse with extended verification result
    """
    try:
        result = await call_procedure(
            db,
            "verify_otp_extended",
            p_json_in={
                "mobileNumber": request.mobile_number,
                "otp": request.otp,
                "sessionId": request.session_id,
            },
        )

        data = result.data or {}
        return ApiResponse(
            status=200,
            message="OTP verified successfully",
            data=data,
        )

    except ProcedureError as e:
        if e.code == 515:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=e.message,
            )
        logger.error(f"Error verifying OTP extended: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/otp/resend", response_model=ApiResponse)
async def resend_otp(
    request: OtpRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Resend OTP for mobile verification.

    This is a convenience endpoint that calls request_otp internally.
    Useful for "Resend OTP" buttons in the UI.

    Rate limiting: 5 requests per hour per mobile number (same as request).

    Args:
        request: OTP request with mobile number
        db: Database connection

    Returns:
        ApiResponse with OTP sent confirmation
    """
    try:
        result = await call_procedure(
            db,
            "request_otp",
            p_json_in={
                "mobileNumber": request.mobile_number,
                "sessionId": request.session_id,
            },
        )

        data = result.data or {}
        # Mask mobile number in response
        masked_mobile = (
            request.mobile_number[:4] + "******" + request.mobile_number[-2:]
            if len(request.mobile_number) >= 6
            else "*******"
        )

        return ApiResponse(
            status=200,
            message="OTP resent successfully",
            data=OtpResponse(
                otp_sent=True,
                expires_in=data.get("expiresIn", settings.otp_expiry_minutes * 60),
                mobile_number=masked_mobile,
                attempts_remaining=data.get("attemptsRemaining", 5),
            ).model_dump(),
        )

    except ProcedureError as e:
        logger.error(f"Error resending OTP: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


# Staff Authentication Endpoints (JWT-based)

@router.post("/staff/login", response_model=ApiResponse)
async def staff_login(
    request: StaffLoginRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Staff login with username/password.

    Validates credentials and returns JWT tokens.

    Args:
        request: Staff login request
        db: Database connection

    Returns:
        ApiResponse with access and refresh tokens
    """
    # TODO: Implement staff authentication
    # This will query a staff table and verify password hash
    # For now, return a mock response

    # Mock implementation - replace with actual DB query
    if request.staff_id == "admin" and request.password == "admin123":
        # Create tokens
        token_data = {
            "sub": "STAFF_001",
            "role": UserRole.ADMIN,
            "username": "Administrator",
            "branch_id": "HEAD_OFFICE",
        }

        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return ApiResponse(
            status=200,
            message="Login successful",
            data=StaffLoginResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                expires_in=settings.jwt_access_token_expire_minutes * 60,
                user=StaffUser(
                    user_id="STAFF_001",
                    staff_id=request.staff_id,
                    name="Administrator",
                    role=UserRole.ADMIN,
                    branch_id="HEAD_OFFICE",
                    branch_name="Head Office",
                ),
            ).model_dump(),
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )


@router.post("/staff/logout", response_model=ApiResponse)
async def staff_logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> ApiResponse:
    """
    Staff logout.

    In a JWT-based system, logout is handled client-side by discarding the token.
    This endpoint exists for future blacklist/revocation support.

    Args:
        credentials: Bearer token

    Returns:
        ApiResponse confirming logout
    """
    # TODO: Implement token blacklist/revocation if needed
    # For now, just return success - client should discard token

    return ApiResponse(
        status=200,
        message="Logout successful",
        data=None,
    )


@router.get("/staff/session", response_model=ApiResponse)
async def get_staff_session(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> ApiResponse:
    """
    Get current staff session information.

    Validates JWT token and returns staff user details.

    Args:
        credentials: Bearer token

    Returns:
        ApiResponse with staff session details
    """
    try:
        # Verify the access token
        payload = verify_token(credentials.credentials, token_type="access")

        return ApiResponse(
            status=200,
            message="Session retrieved successfully",
            data={
                "is_valid": True,
                "user": {
                    "user_id": payload.get("sub"),
                    "staff_id": payload.get("username"),
                    "name": payload.get("username"),
                    "role": payload.get("role"),
                    "branch_id": payload.get("branch_id"),
                },
                "expires_at": payload.get("exp"),
            },
        )

    except Exception as e:
        logger.error(f"Error getting staff session: {e}")
        return ApiResponse(
            status=200,
            message="Invalid or expired session",
            data={"is_valid": False, "user": None},
        )


@router.post("/staff/refresh", response_model=ApiResponse)
async def refresh_token(
    request: RefreshTokenRequest,
) -> ApiResponse:
    """
    Refresh access token using refresh token.

    Args:
        request: Refresh token request

    Returns:
        ApiResponse with new access token
    """
    try:
        # Verify refresh token
        payload = verify_token(request.refresh_token, token_type="refresh")

        # Create new access token
        token_data = {
            "sub": payload.get("sub"),
            "role": payload.get("role"),
            "username": payload.get("username"),
            "branch_id": payload.get("branch_id"),
        }

        access_token = create_access_token(token_data)

        return ApiResponse(
            status=200,
            message="Token refreshed successfully",
            data=RefreshTokenResponse(
                access_token=access_token,
                token_type="bearer",
                expires_in=settings.jwt_access_token_expire_minutes * 60,
            ).model_dump(),
        )

    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
