"""
Submission API endpoints.

Corresponding Procedures: 543 (save_full_application), 554 (submit_by_session), 555 (submit_full_application), 556 (get_submission_status)
"""

import logging
from typing import Optional, Any

from fastapi import APIRouter, Depends, HTTPException, status, Query
from oracledb import Connection
from pydantic import BaseModel, Field

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


class SubmitBySessionRequest(BaseModel):
    """Submit application by session ID."""

    session_id: str = Field(..., description="Session ID")


class SubmitFullApplicationRequest(BaseModel):
    """Submit full application with all data."""

    # All form data would be included here
    # This is a placeholder for the complete application data structure
    application_data: dict = Field(..., description="Complete application data")


class SubmissionStatusResponse(BaseModel):
    """Submission status response."""

    application_id: str = Field(..., description="Application ID")
    reference_number: Optional[str] = Field(None, description="Reference number")
    status: str = Field(..., description="Application status")
    submitted_at: Optional[str] = Field(None, description="Submission timestamp")
    is_complete: bool = Field(..., description="Whether application is complete")


@router.post("/by-session", response_model=ApiResponse)
async def submit_by_session(
    request: SubmitBySessionRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Submit application by session ID.

    Calls procedure 554 (submit_by_session).

    Args:
        request: Submission request with session ID
        db: Database connection

    Returns:
        ApiResponse with submission result
    """
    try:
        result = await call_procedure(
            db,
            "submit_by_session",
            p_json_in={"sessionId": request.session_id},
        )

        return ApiResponse(
            status=200,
            message="Application submitted successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error submitting by session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/full", response_model=ApiResponse)
async def submit_full_application(
    request: SubmitFullApplicationRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Submit full application with all data at once.

    Calls procedure 555 (submit_full_application).

    Args:
        request: Full application data
        db: Database connection

    Returns:
        ApiResponse with submission result
    """
    try:
        result = await call_procedure(
            db,
            "submit_full_application",
            p_json_in=request.application_data,
        )

        return ApiResponse(
            status=200,
            message="Application submitted successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error submitting full application: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/status/{application_id}", response_model=ApiResponse)
async def get_submission_status(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get submission status for an application.

    Calls procedure 556 (get_submission_status).

    Args:
        application_id: Application ID
        db: Database connection

    Returns:
        ApiResponse with submission status
    """
    try:
        result = await call_procedure(
            db,
            "get_submission_status",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Submission status retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting submission status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/save-full", response_model=ApiResponse)
async def save_full_application(
    request: SubmitFullApplicationRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save full application (without submitting).

    Calls procedure 543 (save_full_application).

    Args:
        request: Full application data
        db: Database connection

    Returns:
        ApiResponse confirming save
    """
    try:
        result = await call_procedure(
            db,
            "save_full_application",
            p_json_in=request.application_data,
        )

        return ApiResponse(
            status=200,
            message="Application saved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error saving full application: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
