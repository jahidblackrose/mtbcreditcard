"""
Application CRUD API endpoints.

Corresponding Procedures:
- 505: create_application
- 506: get_application
- 507: get_application_by_reference
- 508: get_application_by_mobile
- 509: update_application_status
- 510: submit_application
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from oracledb import Connection

from app.api.models import ApiResponse
from app.api.models.application import (
    ApplicationDetails,
    ApplicationListItem,
    ApplicationMode,
    ApplicationStatus,
    CreateApplicationRequest,
    CreateApplicationResponse,
    SubmitApplicationRequest,
    SubmitApplicationResponse,
    UpdateApplicationStatusRequest,
)
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    request: CreateApplicationRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Create a new credit card application.

    Calls procedure 505 (create_application).

    Args:
        request: Application creation request
        db: Database connection

    Returns:
        ApiResponse with created application details
    """
    try:
        result = await call_procedure(
            db,
            "create_application",
            p_json_in={
                "mode": request.mode.value,
                "cardId": request.card_id,
            },
        )

        data = result.data or {}
        return ApiResponse(
            status=201,
            message="Application created successfully",
            data=CreateApplicationResponse(
                application_id=data.get("applicationId"),
                reference_number=data.get("referenceNumber"),
                status=ApplicationStatus(data.get("status", "DRAFT")),
                created_at=data.get("createdAt"),
            ).model_dump(),
        )

    except ProcedureError as e:
        logger.error(f"Error creating application: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}", response_model=ApiResponse)
async def get_application(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get application by ID.

    Calls procedure 506 (get_application).

    Args:
        application_id: Application ID
        db: Database connection

    Returns:
        ApiResponse with application details
    """
    try:
        result = await call_procedure(
            db,
            "get_application",
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
            message="Application retrieved successfully",
            data=data,
        )

    except ProcedureError as e:
        if e.code == 506:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=e.message,
            )
        logger.error(f"Error getting application: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/reference/{reference_number}", response_model=ApiResponse)
async def get_application_by_reference(
    reference_number: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get application by reference number.

    Calls procedure 507 (get_application_by_reference).

    Args:
        reference_number: Application reference number
        db: Database connection

    Returns:
        ApiResponse with application details
    """
    try:
        result = await call_procedure(
            db,
            "get_application_by_reference",
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
            message="Application retrieved successfully",
            data=data,
        )

    except ProcedureError as e:
        if e.code == 507:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=e.message,
            )
        logger.error(f"Error getting application by reference: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/mobile/{mobile_number}", response_model=ApiResponse)
async def get_application_by_mobile(
    mobile_number: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get applications by mobile number.

    Calls procedure 508 (get_application_by_mobile).

    Args:
        mobile_number: Mobile number
        page: Page number (1-indexed)
        limit: Items per page
        db: Database connection

    Returns:
        ApiResponse with paginated application list
    """
    try:
        result = await call_procedure(
            db,
            "get_application_by_mobile",
            p_json_in={
                "mobileNumber": mobile_number,
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
        logger.error(f"Error getting applications by mobile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.patch("/{application_id}/status", response_model=ApiResponse)
async def update_application_status(
    application_id: str,
    request: UpdateApplicationStatusRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Update application status.

    Calls procedure 509 (update_application_status).

    Args:
        application_id: Application ID
        request: Status update request
        db: Database connection

    Returns:
        ApiResponse confirming update
    """
    try:
        result = await call_procedure(
            db,
            "update_application_status",
            p_json_in={
                "applicationId": application_id,
                "newStatus": request.status.value,
                "reason": request.reason,
            },
        )

        return ApiResponse(
            status=200,
            message="Application status updated successfully",
            data={"application_id": application_id, "status": request.status.value},
        )

    except ProcedureError as e:
        if e.code == 509:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=e.message,
            )
        logger.error(f"Error updating application status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/{application_id}/submit", response_model=ApiResponse)
async def submit_application(
    application_id: str,
    request: Optional[SubmitApplicationRequest] = None,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Submit a credit card application.

    Calls procedure 510 (submit_application).

    Args:
        application_id: Application ID
        request: Optional submission request
        db: Database connection

    Returns:
        ApiResponse with submission confirmation
    """
    try:
        result = await call_procedure(
            db,
            "submit_application",
            p_json_in={
                "applicationId": application_id,
                "sessionId": request.session_id if request else None,
            },
        )

        data = result.data or {}
        return ApiResponse(
            status=200,
            message="Application submitted successfully",
            data=SubmitApplicationResponse(
                application_id=application_id,
                reference_number=data.get("referenceNumber", ""),
                status=ApplicationStatus(data.get("status", "SUBMITTED")),
                submitted_at=data.get("submittedAt", ""),
            ).model_dump(),
        )

    except ProcedureError as e:
        if e.code == 510:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=e.message,
            )
        logger.error(f"Error submitting application: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/all", response_model=ApiResponse)
async def get_all_applications(
    status: Optional[str] = Query(None, description="Filter by status"),
    date_from: Optional[str] = Query(None, description="Filter from date (ISO format)"),
    date_to: Optional[str] = Query(None, description="Filter to date (ISO format)"),
    branch_code: Optional[str] = Query(None, description="Filter by branch code"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get all applications with optional filters.

    This endpoint is used by RM dashboard to retrieve and filter applications.

    Args:
        status: Optional status filter (DRAFT, SUBMITTED, UNDER_REVIEW, etc.)
        date_from: Optional start date filter
        date_to: Optional end date filter
        branch_code: Optional branch code filter
        page: Page number (1-indexed)
        limit: Items per page
        db: Database connection

    Returns:
        ApiResponse with paginated and filtered application list
    """
    try:
        # Build filter parameters
        filters = {"page": page, "limit": limit}
        if status:
            filters["status"] = status
        if date_from:
            filters["dateFrom"] = date_from
        if date_to:
            filters["dateTo"] = date_to
        if branch_code:
            filters["branchCode"] = branch_code

        result = await call_procedure(
            db,
            "get_all_applications",
            p_json_in=filters,
        )

        return ApiResponse(
            status=200,
            message=f"Applications retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting all applications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/reference/{reference_number}/timeline", response_model=ApiResponse)
async def get_application_timeline(
    reference_number: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get application status timeline by reference number.

    This endpoint retrieves the audit trail/timeline for an application,
    showing all status changes and events.

    Args:
        reference_number: Application reference number
        db: Database connection

    Returns:
        ApiResponse with timeline events

    Timeline events structure:
        [
            {
                "timestamp": "2026-01-30T10:00:00Z",
                "event": "Application Submitted",
                "status": "completed",
                "description": "Application submitted successfully",
                "actor": "APPLICANT"
            },
            ...
        ]
    """
    try:
        result = await call_procedure(
            db,
            "get_application_timeline",
            p_json_in={"referenceNumber": reference_number},
        )

        data = result.data or []
        if not data:
            # Return empty timeline instead of 404
            return ApiResponse(
                status=200,
                message="No timeline found for this application",
                data=[],
            )

        return ApiResponse(
            status=200,
            message="Timeline retrieved successfully",
            data=data,
        )

    except ProcedureError as e:
        # If procedure doesn't exist yet, return mock data based on application
        if e.code == 560:  # Procedure not found
            # Get application details first
            try:
                app_result = await call_procedure(
                    db,
                    "get_application_by_reference",
                    p_json_in={"referenceNumber": reference_number},
                )
                app_data = app_result.data

                # Build basic timeline from application data
                timeline = [
                    {
                        "timestamp": app_data.get("created_at", ""),
                        "event": "Application Submitted",
                        "status": "completed",
                        "description": "Application submitted successfully",
                        "actor": "APPLICANT"
                    }
                ]

                if app_data.get("submitted_at"):
                    timeline.append({
                        "timestamp": app_data.get("submitted_at", ""),
                        "event": "Application Submitted",
                        "status": "completed",
                        "description": "Application submitted for review",
                        "actor": "APPLICANT"
                    })

                if app_data.get("status") in ["UNDER_REVIEW", "APPROVED", "REJECTED"]:
                    timeline.append({
                        "timestamp": app_data.get("last_updated_at", ""),
                        "event": "Status Update",
                        "status": "completed",
                        "description": f"Application status updated to {app_data.get('status')}",
                        "actor": "SYSTEM"
                    })

                return ApiResponse(
                    status=200,
                    message="Timeline retrieved successfully",
                    data=timeline,
                )
            except:
                pass

        logger.error(f"Error getting application timeline: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
