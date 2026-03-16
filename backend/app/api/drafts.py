"""
Draft management API endpoints.

Corresponding Procedures:
- 549: initialize_draft
- 550: get_draft
- 551: save_draft_step
- 552: clear_draft
- 553: get_step_versions
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from oracledb import Connection

from app.api.models import ApiResponse
from app.api.models.draft import (
    DraftState,
    DraftStepData,
    DraftVersion,
    InitializeDraftRequest,
    SaveDraftRequest,
)
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/initialize", response_model=ApiResponse)
async def initialize_draft(
    request: InitializeDraftRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Initialize a new draft for a session.

    Calls procedure 549 (initialize_draft).

    Args:
        request: Draft initialization request
        db: Database connection

    Returns:
        ApiResponse with draft details
    """
    try:
        result = await call_procedure(
            db,
            "initialize_draft",
            p_json_in={
                "sessionId": request.session_id,
                "mode": request.mode,
            },
        )

        return ApiResponse(
            status=201,
            message="Draft initialized successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error initializing draft: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{session_id}", response_model=ApiResponse)
async def get_draft(
    session_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get draft by session ID.

    Calls procedure 550 (get_draft).

    Args:
        session_id: Session ID
        db: Database connection

    Returns:
        ApiResponse with draft state
    """
    try:
        result = await call_procedure(
            db,
            "get_draft",
            p_json_in={"sessionId": session_id},
        )

        data = result.data
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Draft not found",
            )

        return ApiResponse(
            status=200,
            message="Draft retrieved successfully",
            data=data,
        )

    except ProcedureError as e:
        if e.code == 550:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=e.message,
            )
        logger.error(f"Error getting draft: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/save", response_model=ApiResponse)
async def save_draft_step(
    request: SaveDraftRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save a draft step.

    Calls procedure 551 (save_draft_step).

    Rate limiting: 10 requests per minute per session.

    Args:
        request: Draft save request
        db: Database connection

    Returns:
        ApiResponse confirming save
    """
    try:
        result = await call_procedure(
            db,
            "save_draft_step",
            p_json_in={
                "sessionId": request.session_id,
                "stepNumber": request.step_number,
                "stepName": request.step_name,
                "data": request.data,
                "isComplete": "Y" if request.is_complete else "N",
            },
        )

        return ApiResponse(
            status=200,
            message="Draft step saved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error saving draft step: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.delete("/{session_id}", response_model=ApiResponse)
async def clear_draft(
    session_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Clear/delete a draft.

    Calls procedure 552 (clear_draft).

    Args:
        session_id: Session ID
        db: Database connection

    Returns:
        ApiResponse confirming deletion
    """
    try:
        result = await call_procedure(
            db,
            "clear_draft",
            p_json_in={"sessionId": session_id},
        )

        return ApiResponse(
            status=200,
            message="Draft cleared successfully",
            data=None,
        )

    except ProcedureError as e:
        logger.error(f"Error clearing draft: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{session_id}/versions", response_model=ApiResponse)
async def get_step_versions(
    session_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get all step versions for a draft.

    Calls procedure 553 (get_step_versions).

    Args:
        session_id: Session ID
        db: Database connection

    Returns:
        ApiResponse with version history
    """
    try:
        result = await call_procedure(
            db,
            "get_step_versions",
            p_json_in={"sessionId": session_id},
        )

        return ApiResponse(
            status=200,
            message="Draft versions retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting draft versions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
