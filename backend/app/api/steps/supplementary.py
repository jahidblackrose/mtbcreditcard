"""
Step 8: Supplementary Card API endpoints.

Corresponding Procedures: 530 (save_supplementary_card), 531 (get_supplementary_card), 532 (delete_supplementary_card)
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


class SupplementaryCardRequest(BaseModel):
    """Supplementary card request."""

    name: str = Field(..., max_length=100)
    relationship: str = Field(..., max_length=50)
    mobile_number: Optional[str] = Field(None, pattern=r"^01[3-9]\d{8}$")
    date_of_birth: Optional[str] = Field(None, description="ISO 8601 date")
    gender: Optional[str] = Field(None, pattern=r"^(MALE|FEMALE|OTHER)$")
    nid_number: Optional[str] = Field(None, max_length=17)


@router.post("/{application_id}/supplementary", response_model=ApiResponse)
async def save_supplementary_card(
    application_id: str,
    request: SupplementaryCardRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save supplementary card (Step 8).

    Calls procedure 530 (save_supplementary_card).
    """
    try:
        result = await call_procedure(
            db,
            "save_supplementary_card",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=200,
            message="Supplementary card saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving supplementary card: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/supplementary", response_model=ApiResponse)
async def get_supplementary_card(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get supplementary card details.

    Calls procedure 531 (get_supplementary_card).
    """
    try:
        result = await call_procedure(
            db,
            "get_supplementary_card",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Supplementary card retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting supplementary card: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.delete("/{application_id}/supplementary/{supp_id}", response_model=ApiResponse)
async def delete_supplementary_card(
    application_id: str,
    supp_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Delete supplementary card.

    Calls procedure 532 (delete_supplementary_card).
    """
    try:
        result = await call_procedure(
            db,
            "delete_supplementary_card",
            p_json_in={"supplementaryId": supp_id},
        )

        return ApiResponse(
            status=200,
            message="Supplementary card deleted successfully",
            data={"supp_id": supp_id},
        )

    except ProcedureError as e:
        logger.error(f"Error deleting supplementary card: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
