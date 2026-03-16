"""
Dashboard API endpoints.

Corresponding Procedures: 557 (get_my_applications), 558 (track_by_reference), 559 (get_dashboard_stats), 560 (get_application_details)
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from oracledb import Connection

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/my-applications", response_model=ApiResponse)
async def get_my_applications(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get my applications (dashboard).

    Calls procedure 557 (get_my_applications).

    Note: This requires user_id from JWT auth context.
    For now, it returns all applications - update with auth in production.

    Args:
        page: Page number (1-indexed)
        limit: Items per page
        db: Database connection

    Returns:
        ApiResponse with paginated application list
    """
    try:
        # TODO: Get user_id from auth context
        user_id = None

        result = await call_procedure(
            db,
            "get_my_applications",
            p_json_in={
                "userId": user_id,
                "page": page,
                "limit": limit,
            },
        )

        return ApiResponse(
            status=200,
            message="Applications retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting my applications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/track/{reference_number}", response_model=ApiResponse)
async def track_by_reference(
    reference_number: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Track application by reference number (public endpoint).

    Calls procedure 558 (track_by_reference).

    Args:
        reference_number: Application reference number
        db: Database connection

    Returns:
        ApiResponse with application tracking details
    """
    try:
        result = await call_procedure(
            db,
            "track_by_reference",
            p_json_in={"referenceNumber": reference_number},
        )

        data = result.data
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

        return ApiResponse(
            status=200,
            message="Application tracking retrieved successfully",
            data=data,
        )

    except ProcedureError as e:
        if e.code == 558:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=e.message,
            )
        logger.error(f"Error tracking application: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/stats", response_model=ApiResponse)
async def get_dashboard_stats(
    branch_id: Optional[str] = Query(None, description="Branch ID filter"),
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get dashboard statistics.

    Calls procedure 559 (get_dashboard_stats).

    Args:
        branch_id: Optional branch ID filter
        db: Database connection

    Returns:
        ApiResponse with dashboard statistics
    """
    try:
        result = await call_procedure(
            db,
            "get_dashboard_stats",
            p_json_in={"branchId": branch_id},
        )

        return ApiResponse(
            status=200,
            message="Dashboard statistics retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting dashboard stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/application/{application_id}", response_model=ApiResponse)
async def get_application_details(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get detailed application information (for dashboard).

    Calls procedure 560 (get_application_details).

    Args:
        application_id: Application ID
        db: Database connection

    Returns:
        ApiResponse with detailed application information
    """
    try:
        result = await call_procedure(
            db,
            "get_application_details",
            p_json_in={"applicationId": application_id},
        )

        data = result.data
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

        return ApiResponse(
            status=200,
            message="Application details retrieved successfully",
            data=data,
        )

    except ProcedureError as e:
        if e.code == 560:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=e.message,
            )
        logger.error(f"Error getting application details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


# RM Dashboard Endpoints (additional functionality)

@router.get("/rm/pending", response_model=ApiResponse)
async def get_pending_applications(
    branch_id: Optional[str] = Query(None, description="Filter by branch"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get pending applications for RM review.

    Args:
        branch_id: Optional branch filter
        page: Page number
        limit: Items per page
        db: Database connection

    Returns:
        ApiResponse with pending applications
    """
    try:
        # Reuse get_my_applications with status filter
        result = await call_procedure(
            db,
            "get_my_applications",
            p_json_in={
                "status": "SUBMITTED",
                "branchId": branch_id,
                "page": page,
                "limit": limit,
            },
        )

        return ApiResponse(
            status=200,
            message="Pending applications retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting pending applications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
