"""
Step 4: Monthly Income API endpoint.

Corresponding Procedure: 521 (save_monthly_income)
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


class MonthlyIncomeRequest(BaseModel):
    """Monthly income breakdown request."""

    basic_salary: Optional[str] = Field(None, description="Basic salary")
    house_rent: Optional[str] = Field(None, description="House rent allowance")
    medical_allowance: Optional[str] = Field(None, description="Medical allowance")
    transport_allowance: Optional[str] = Field(None, description="Transport allowance")
    other_allowance: Optional[str] = Field(None, description="Other allowances")
    total_income: str = Field(..., description="Total monthly income")
    other_income_source: Optional[str] = Field(None, description="Other income source")
    other_income_amount: Optional[str] = Field(None, description="Other income amount")


@router.post("/{application_id}/monthly-income", response_model=ApiResponse)
async def save_monthly_income(
    application_id: str,
    request: MonthlyIncomeRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save monthly income breakdown (Step 4).

    Calls procedure 521 (save_monthly_income).
    """
    try:
        result = await call_procedure(
            db,
            "save_monthly_income",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=200,
            message="Monthly income saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving monthly income: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
