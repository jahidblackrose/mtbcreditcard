"""
Step 11: Auto Debit API endpoints.

Corresponding Procedures: 539 (save_auto_debit), 540 (get_auto_debit)
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


class AutoDebitRequest(BaseModel):
    """Auto debit request."""

    is_enabled: bool = Field(..., description="Enable auto debit")
    bank_account_id: Optional[str] = Field(None, description="Bank account ID for debit")
    debit_day_of_month: Optional[int] = Field(None, ge=1, le=28, description="Day of month for debit")
    minimum_payment_due: Optional[str] = Field(None, description="Minimum payment amount")
    full_payment: Optional[bool] = Field(None, description="Debit full amount")


@router.post("/{application_id}/auto-debit", response_model=ApiResponse)
async def save_auto_debit(
    application_id: str,
    request: AutoDebitRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save auto debit preferences (Step 11).

    Calls procedure 539 (save_auto_debit).
    """
    try:
        result = await call_procedure(
            db,
            "save_auto_debit",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=200,
            message="Auto debit preferences saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving auto debit: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/auto-debit", response_model=ApiResponse)
async def get_auto_debit(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get auto debit preferences.

    Calls procedure 540 (get_auto_debit).
    """
    try:
        result = await call_procedure(
            db,
            "get_auto_debit",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Auto debit preferences retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting auto debit: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
