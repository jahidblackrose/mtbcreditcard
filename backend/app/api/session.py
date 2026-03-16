"""
Session management API endpoints.

Corresponding Procedures:
- 544: create_session
- 545: get_session
- 546: extend_session
- 547: end_session
- 548: validate_session
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from oracledb import Connection

from app.api.models import ApiResponse
from app.api.models.session import (
    ApplicationMode,
    CreateSessionRequest,
    CreateSessionResponse,
    ExtendSessionRequest,
    SessionState,
    SessionValidationResponse,
)
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/create", response_model=ApiResponse)
async def create_session(
    request: CreateSessionRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Create a new application session.

    Calls procedure 544 (create_session).

    Args:
        request: Session creation request with mode
        db: Database connection

    Returns:
        ApiResponse with new session details

    Example:
        >>> request = CreateSessionRequest(mode=ApplicationMode.SELF)
        >>> response = await create_session(request, db)
        >>> response.data["session_id"]
        "abc123..."
    """
    try:
        result = await call_procedure(
            db,
            "create_session",
            p_json_in={"mode": request.mode.value},
        )

        # Extract session data from response
        session_data = result.data or {}
        session_id = session_data.get("sessionId")
        expires_at = session_data.get("expiresAt")
        ttl_seconds = session_data.get("ttlSeconds", 1800)

        if not session_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Session ID not returned from database",
            )

        return ApiResponse(
            status=200,
            message="Session created successfully",
            data=CreateSessionResponse(
                session_id=session_id,
                mode=request.mode,
                expires_at=expires_at,
                ttl_seconds=ttl_seconds,
            ).model_dump(),
        )

    except ProcedureError as e:
        logger.error(f"Error creating session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{session_id}", response_model=ApiResponse)
async def get_session(
    session_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get session details by session ID.

    Calls procedure 545 (get_session).

    Args:
        session_id: Session ID
        db: Database connection

    Returns:
        ApiResponse with session details

    Example:
        >>> response = await get_session("abc123", db)
        >>> response.data["is_active"]
        true
    """
    try:
        result = await call_procedure(
            db,
            "get_session",
            p_json_in={"sessionId": session_id},
        )

        session_data = result.data or {}
        return ApiResponse(
            status=200,
            message="Session retrieved successfully",
            data=session_data,
        )

    except ProcedureError as e:
        if e.code == 545:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found",
            )
        logger.error(f"Error getting session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/{session_id}/extend", response_model=ApiResponse)
async def extend_session(
    session_id: str,
    request: Optional[ExtendSessionRequest] = None,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Extend session TTL.

    Calls procedure 546 (extend_session).

    Args:
        session_id: Session ID
        request: Optional extension request (defaults to 30 minutes)
        db: Database connection

    Returns:
        ApiResponse with updated session details

    Example:
        >>> response = await extend_session("abc123", ExtendSessionRequest(extension_minutes=30), db)
        >>> response.data["ttl_seconds"]
        1800
    """
    extension_minutes = request.extension_minutes if request else 30

    try:
        result = await call_procedure(
            db,
            "extend_session",
            p_json_in={
                "sessionId": session_id,
                "extensionMinutes": extension_minutes,
            },
        )

        session_data = result.data or {}
        return ApiResponse(
            status=200,
            message="Session extended successfully",
            data=session_data,
        )

    except ProcedureError as e:
        if e.code == 545:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found",
            )
        logger.error(f"Error extending session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.delete("/{session_id}", response_model=ApiResponse)
async def end_session(
    session_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    End/delete a session.

    Calls procedure 547 (end_session).

    Args:
        session_id: Session ID
        db: Database connection

    Returns:
        ApiResponse confirming deletion

    Example:
        >>> response = await end_session("abc123", db)
        >>> response.message
        "Session ended successfully"
    """
    try:
        result = await call_procedure(
            db,
            "end_session",
            p_json_in={"sessionId": session_id},
        )

        return ApiResponse(
            status=200,
            message="Session ended successfully",
            data=None,
        )

    except ProcedureError as e:
        logger.error(f"Error ending session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{session_id}/validate", response_model=ApiResponse)
async def validate_session(
    session_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Validate a session (check if active and not expired).

    Calls procedure 548 (validate_session).

    Args:
        session_id: Session ID
        db: Database connection

    Returns:
        ApiResponse with validation result

    Example:
        >>> response = await validate_session("abc123", db)
        >>> response.data["is_valid"]
        true
        >>> response.data["is_expired"]
        false
    """
    try:
        result = await call_procedure(
            db,
            "validate_session",
            p_json_in={"sessionId": session_id},
        )

        validation_data = result.data or {}
        return ApiResponse(
            status=200,
            message="Session validation completed",
            data=validation_data,
        )

    except ProcedureError as e:
        logger.error(f"Error validating session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
