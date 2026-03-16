"""
Step 6: Credit Facilities API endpoints.

Corresponding Procedures: 525 (save_credit_facilities), 526 (get_credit_facilities), 527 (delete_credit_facility)
"""

import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from oracledb import Connection
from pydantic import BaseModel, Field

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


class CreditFacilityRequest(BaseModel):
    """Single credit facility request."""

    facility_type: str = Field(..., description="Credit facility type")
    bank_name: str = Field(..., max_length=100)
    card_type: Optional[str] = Field(None, description="Card type (if credit card)")
    limit: str = Field(..., description="Credit limit")
    outstanding: Optional[str] = Field(None, description="Outstanding amount")
    monthly_payment: Optional[str] = Field(None, description="Monthly payment amount")
    relationship_years: Optional[int] = Field(None, ge=0, le=50)


class SaveCreditFacilitiesRequest(BaseModel):
    """Request to save multiple credit facilities."""

    facilities: List[CreditFacilityRequest] = Field(..., min_items=0, max_items=10)


@router.post("/{application_id}/credit-facilities", response_model=ApiResponse)
async def save_credit_facilities(
    application_id: str,
    request: SaveCreditFacilitiesRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save credit facilities (Step 6).

    Calls procedure 525 (save_credit_facilities).
    """
    try:
        result = await call_procedure(
            db,
            "save_credit_facilities",
            p_json_in={
                "applicationId": application_id,
                "facilities": [fac.model_dump() for fac in request.facilities],
            },
        )

        return ApiResponse(
            status=200,
            message="Credit facilities saved successfully",
            data={"application_id": application_id, "count": len(request.facilities)},
        )

    except ProcedureError as e:
        logger.error(f"Error saving credit facilities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/credit-facilities", response_model=ApiResponse)
async def get_credit_facilities(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get credit facilities for an application.

    Calls procedure 526 (get_credit_facilities).
    """
    try:
        result = await call_procedure(
            db,
            "get_credit_facilities",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Credit facilities retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting credit facilities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.delete("/{application_id}/credit-facilities/{facility_id}", response_model=ApiResponse)
async def delete_credit_facility(
    application_id: str,
    facility_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Delete a credit facility.

    Calls procedure 527 (delete_credit_facility).
    """
    try:
        result = await call_procedure(
            db,
            "delete_credit_facility",
            p_json_in={"facilityId": facility_id},
        )

        return ApiResponse(
            status=200,
            message="Credit facility deleted successfully",
            data={"facility_id": facility_id},
        )

    except ProcedureError as e:
        logger.error(f"Error deleting credit facility: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
