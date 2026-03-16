"""
Step 9: References API endpoints.

Corresponding Procedures: 533 (save_references), 534 (get_references)
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


class ReferenceContact(BaseModel):
    """Reference contact request."""

    name: str = Field(..., max_length=100)
    relationship: str = Field(..., max_length=50)
    mobile_number: str = Field(..., pattern=r"^01[3-9]\d{8}$")
    address: Optional[str] = Field(None, max_length=200)


class ReferencesRequest(BaseModel):
    """Request to save both references."""

    reference1: ReferenceContact = Field(..., description="First reference")
    reference2: Optional[ReferenceContact] = Field(None, description="Second reference")


@router.post("/{application_id}/references", response_model=ApiResponse)
async def save_references(
    application_id: str,
    request: ReferencesRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save references (Step 9).

    Calls procedure 533 (save_references).
    """
    try:
        result = await call_procedure(
            db,
            "save_references",
            p_json_in={
                "applicationId": application_id,
                "reference1": request.reference1.model_dump(),
                "reference2": request.reference2.model_dump() if request.reference2 else None,
            },
        )

        return ApiResponse(
            status=200,
            message="References saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving references: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/references", response_model=ApiResponse)
async def get_references(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get references.

    Calls procedure 534 (get_references).
    """
    try:
        result = await call_procedure(
            db,
            "get_references",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="References retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting references: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
