"""
Reference data API endpoints.

Corresponding Procedures:
- 501: get_card_products
- 502: get_reference_data
- 503: check_eligibility
- 504: get_bank_list
"""

import logging
from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.models import ApiResponse, ErrorResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure
from oracledb import Connection

logger = logging.getLogger(__name__)

router = APIRouter()

# Valid reference types matching database procedures
ReferenceType = Literal[
    "CARD_NETWORK",
    "CARD_TIER",
    "CARD_CATEGORY",
    "CUSTOMER_SEGMENT",
    "EMPLOYMENT_TYPE",
    "PROFESSION",
    "NID_TYPE",
    "MARITAL_STATUS",
    "GENDER",
    "EDUCATION",
    "ADDRESS_TYPE",
    "BANK",
    "DOCUMENT_TYPE",
]


@router.get("/card-products", response_model=ApiResponse)
async def get_card_products(db: Connection = Depends(get_db)) -> ApiResponse:
    """
    Get available credit card products.

    Calls procedure 501 (get_card_products).

    Returns:
        ApiResponse with list of card products

    Example:
        >>> response = await get_card_products(db)
        >>> response.status
        200
        >>> response.data[0]["name"]
        "MTB Platinum Card"
    """
    try:
        result = await call_procedure(db, "get_card_products")

        return ApiResponse(
            status=200,
            message="Card products retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting card products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/reference/{type}", response_model=ApiResponse)
async def get_reference_data(
    type: ReferenceType,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get reference data by type.

    Calls procedure 502 (get_reference_data).

    Args:
        type: Reference data type (e.g., 'CARD_NETWORK', 'CARD_TIER')

    Returns:
        ApiResponse with reference data list

    Example:
        >>> response = await get_reference_data("CARD_NETWORK", db)
        >>> response.data
        [{"value": "VISA", "label": "Visa"}, {"value": "MASTER", "label": "Mastercard"}]
    """
    try:
        result = await call_procedure(
            db,
            "get_reference_data",
            p_json_in={"type": type},
        )

        return ApiResponse(
            status=200,
            message=f"Reference data for {type} retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting reference data for {type}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/check-eligibility", response_model=ApiResponse)
async def check_eligibility(
    monthly_income: str = Query(..., description="Monthly income amount"),
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Check credit card eligibility based on monthly income.

    Calls procedure 503 (check_eligibility).

    Args:
        monthly_income: Monthly income as string

    Returns:
        ApiResponse with eligibility status and eligible cards

    Example:
        >>> response = await check_eligibility("50000", db)
        >>> response.data["eligible"]
        true
        >>> response.data["eligibleCards"][0]["name"]
        "MTB Classic Card"
    """
    try:
        result = await call_procedure(
            db,
            "check_eligibility",
            p_json_in={"monthlyIncome": monthly_income},
        )

        return ApiResponse(
            status=200,
            message="Eligibility check completed",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error checking eligibility: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/banks", response_model=ApiResponse)
async def get_banks(db: Connection = Depends(get_db)) -> ApiResponse:
    """
    Get list of banks for bank account selection.

    Calls procedure 504 (get_bank_list).

    Returns:
        ApiResponse with list of banks

    Example:
        >>> response = await get_banks(db)
        >>> response.data[0]
        {"code": "MTB", "name": "Mutual Trust Bank"}
    """
    try:
        result = await call_procedure(db, "get_bank_list")

        return ApiResponse(
            status=200,
            message="Bank list retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting bank list: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
