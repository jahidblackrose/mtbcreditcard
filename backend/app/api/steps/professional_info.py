"""
Step 3: Professional Info API endpoint.

Corresponding Procedure: 520 (save_professional_info)
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


class ProfessionalInfoRequest(BaseModel):
    """Professional information request."""

    employment_type: str = Field(..., description="Employment type")
    profession: str = Field(..., description="Profession")
    employer_name: Optional[str] = Field(None, max_length=200)
    designation: Optional[str] = Field(None, max_length=100)
    employment_status: str = Field(..., description="Employment status")
    monthly_income: str = Field(..., description="Monthly income")
    work_address_line1: Optional[str] = Field(None, max_length=200)
    work_address_line2: Optional[str] = Field(None, max_length=200)
    work_city: Optional[str] = Field(None, max_length=100)
    work_district: Optional[str] = Field(None, max_length=100)
    work_phone: Optional[str] = Field(None, max_length=20)
    years_at_current_job: Optional[int] = Field(None, ge=0, le=50)
    years_at_current_profession: Optional[int] = Field(None, ge=0, le=50)


@router.post("/{application_id}/professional-info", response_model=ApiResponse)
async def save_professional_info(
    application_id: str,
    request: ProfessionalInfoRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save professional information (Step 3).

    Calls procedure 520 (save_professional_info).
    """
    try:
        result = await call_procedure(
            db,
            "save_professional_info",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=200,
            message="Professional information saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving professional info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
