"""
Step 12: MID Declarations API endpoints.

Corresponding Procedures: 541 (save_mid_declarations), 542 (get_mid_declarations)
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from oracledb import Connection
from pydantic import BaseModel, Field, field_validator

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


class DeclarationsRequest(BaseModel):
    """MID declarations request."""

    terms_accepted: bool = Field(..., description="Terms and conditions accepted")
    privacy_accepted: bool = Field(..., description="Privacy policy accepted")
    consent_marketing: Optional[bool] = Field(None, description="Consent to marketing communications")
    consent_data_sharing: Optional[bool] = Field(None, description="Consent to data sharing with partners")
    declared_correct: bool = Field(..., description="Declared all information is correct")
    understands_terms: bool = Field(..., description="Understands terms and conditions")
    declaration_timestamp: Optional[str] = Field(None, description="Declaration timestamp")

    @field_validator("terms_accepted", "privacy_accepted", "declared_correct", "understands_terms")
    @classmethod
    def must_accept(cls, v: bool) -> bool:
        """Validate that required declarations are accepted."""
        if not v:
            raise ValueError("Required declarations must be accepted")
        return v


@router.post("/{application_id}/declarations", response_model=ApiResponse)
async def save_mid_declarations(
    application_id: str,
    request: DeclarationsRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save MID declarations (Step 12).

    Calls procedure 541 (save_mid_declarations).
    """
    try:
        result = await call_procedure(
            db,
            "save_mid_declarations",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=200,
            message="Declarations saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving declarations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/declarations", response_model=ApiResponse)
async def get_mid_declarations(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get MID declarations.

    Calls procedure 542 (get_mid_declarations).
    """
    try:
        result = await call_procedure(
            db,
            "get_mid_declarations",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Declarations retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting declarations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
