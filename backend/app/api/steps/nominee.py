"""
Step 7: Nominee (MPP) API endpoints.

Corresponding Procedures: 528 (save_nominee_details), 529 (get_nominee_details)
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from oracledb import Connection
from pydantic import BaseModel, Field

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


class NomineeRequest(BaseModel):
    """Nominee information request."""

    nominee_name: str = Field(..., max_length=100)
    nominee_relationship: str = Field(..., max_length=50)
    nominee_mobile: Optional[str] = Field(None, pattern=r"^01[3-9]\d{8}$")
    nominee_nid: Optional[str] = Field(None, max_length=17)
    nominee_address: Optional[str] = Field(None, max_length=200)
    nominee_dob: Optional[str] = Field(None, description="ISO 8601 date")
    nomination_percentage: Optional[int] = Field(None, ge=1, le=100)
    guardian_name: Optional[str] = Field(None, max_length=100)
    guardian_nid: Optional[str] = Field(None, max_length=17)
    guardian_relationship: Optional[str] = Field(None, max_length=50)


@router.post("/{application_id}/nominee", response_model=ApiResponse)
async def save_nominee_details(
    application_id: str,
    request: NomineeRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save nominee details (Step 7).

    Calls procedure 528 (save_nominee_details).
    """
    try:
        result = await call_procedure(
            db,
            "save_nominee_details",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=200,
            message="Nominee details saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving nominee details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/nominee", response_model=ApiResponse)
async def get_nominee_details(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get nominee details.

    Calls procedure 529 (get_nominee_details).
    """
    try:
        result = await call_procedure(
            db,
            "get_nominee_details",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Nominee details retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting nominee details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
