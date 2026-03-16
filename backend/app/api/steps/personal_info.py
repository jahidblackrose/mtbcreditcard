"""
Step 2: Personal Info & Addresses API endpoints.

Corresponding Procedures: 518 (save_personal_info), 519 (save_addresses)
"""

import logging
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from oracledb import Connection
from pydantic import BaseModel, Field, EmailStr

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


class PersonalInfoRequest(BaseModel):
    """Personal information request."""

    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    date_of_birth: str = Field(..., description="ISO 8601 date")
    gender: str = Field(..., pattern=r"^(MALE|FEMALE|OTHER)$")
    marital_status: str = Field(..., description="Marital status")
    education: str = Field(..., description="Education level")
    nationality: str = Field(default="Bangladeshi", max_length=50)
    nid_number: str = Field(..., min_length=10, max_length=17)
    nid_type: str = Field(..., description="NID type")
    mobile_number: str = Field(..., pattern=r"^01[3-9]\d{8}$")
    email_address: Optional[EmailStr] = Field(None)
    fathers_name: Optional[str] = Field(None, max_length=100)
    mothers_name: Optional[str] = Field(None, max_length=100)


class AddressRequest(BaseModel):
    """Address request."""

    address_type: str = Field(..., pattern=r"^(PRESENT|PERMANENT)$")
    address_line1: str = Field(..., max_length=200)
    address_line2: Optional[str] = Field(None, max_length=200)
    city: str = Field(..., max_length=100)
    district: str = Field(..., max_length=100)
    division: str = Field(..., max_length=100)
    post_code: Optional[str] = Field(None, max_length=10)
    country: str = Field(default="Bangladesh", max_length=50)
    ownership_type: str = Field(..., description="RENTED/OWNED/FAMILY")
    years_at_address: Optional[int] = Field(None, ge=0, le=100)


class AddressesRequest(BaseModel):
    """Addresses request (present and permanent)."""

    present_address: AddressRequest = Field(..., description="Present address")
    permanent_address: Optional[AddressRequest] = Field(None, description="Permanent address")
    same_as_permanent: bool = Field(default=False, description="Same as present address")


@router.post("/{application_id}/personal-info", response_model=ApiResponse)
async def save_personal_info(
    application_id: str,
    request: PersonalInfoRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save personal information (Step 2a).

    Calls procedure 518 (save_personal_info).
    """
    try:
        result = await call_procedure(
            db,
            "save_personal_info",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=200,
            message="Personal information saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving personal info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/{application_id}/addresses", response_model=ApiResponse)
async def save_addresses(
    application_id: str,
    request: AddressesRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save addresses (Step 2b).

    Calls procedure 519 (save_addresses).
    """
    try:
        result = await call_procedure(
            db,
            "save_addresses",
            p_json_in={
                "applicationId": application_id,
                "presentAddress": request.present_address.model_dump(),
                "permanentAddress": request.permanent_address.model_dump() if request.permanent_address else None,
                "sameAsPermanent": request.same_as_permanent,
            },
        )

        return ApiResponse(
            status=200,
            message="Addresses saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving addresses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
