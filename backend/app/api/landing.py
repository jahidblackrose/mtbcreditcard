"""
Landing page API endpoints.

Provides mock data for landing page features and eligibility form.
This endpoint doesn't call database procedures as it serves static content.
"""

import logging
from typing import Any

from fastapi import APIRouter

from app.api.models import ApiResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/features", response_model=ApiResponse)
async def get_card_features() -> ApiResponse:
    """
    Get card features for landing page.

    Returns static mock data about card features and benefits.

    Returns:
        ApiResponse with card features

    Example:
        >>> response = await get_card_features()
        >>> response.data["features"][0]["title"]
        "Zero Annual Fee"
    """
    features = {
        "features": [
            {
                "id": "1",
                "title": "Zero Annual Fee",
                "description": "No annual fee for the first year",
                "icon": "fee-free",
            },
            {
                "id": "2",
                "title": "Instant Approval",
                "description": "Get approved within 24 hours",
                "icon": "fast-approval",
            },
            {
                "id": "3",
                "title": "Worldwide Acceptance",
                "description": "Accepted at millions of locations globally",
                "icon": "global",
            },
            {
                "id": "4",
                "title": "Contactless Payment",
                "description": "Tap to pay with NFC technology",
                "icon": "nfc",
            },
            {
                "id": "5",
                "title": "Mobile Banking",
                "description": "Manage your card with our mobile app",
                "icon": "mobile",
            },
            {
                "id": "6",
                "title": "EMI Facility",
                "description": "Convert purchases to easy EMIs",
                "icon": "emi",
            },
        ],
        "benefits": [
            {
                "id": "1",
                "title": "Travel Benefits",
                "description": "Free travel insurance and lounge access",
                "tier": "platinum",
            },
            {
                "id": "2",
                "title": "Cashback Rewards",
                "description": "Up to 5% cashback on purchases",
                "tier": "gold",
            },
            {
                "id": "3",
                "title": "Welcome Bonus",
                "description": "Get bonus points on first purchase",
                "tier": "all",
            },
        ],
    }

    return ApiResponse(
        status=200,
        message="Card features retrieved successfully",
        data=features,
    )


@router.get("/eligibility", response_model=ApiResponse)
async def get_eligibility_form() -> ApiResponse:
    """
    Get eligibility form configuration.

    Returns the form structure and validation rules for the eligibility check form.

    Returns:
        ApiResponse with form configuration

    Example:
        >>> response = await get_eligibility_form()
        >>> response.data["fields"][0]["name"]
        "monthlyIncome"
    """
    form_config = {
        "title": "Check Your Eligibility",
        "description": "Find out which credit cards you're eligible for",
        "fields": [
            {
                "name": "monthlyIncome",
                "label": "Monthly Income (BDT)",
                "type": "number",
                "required": True,
                "placeholder": "Enter your monthly income",
                "validation": {
                    "min": 10000,
                    "max": 9999999,
                },
            },
        ],
        "submitButton": "Check Eligibility",
        "successMessage": "Congratulations! You're eligible for our credit cards.",
    }

    return ApiResponse(
        status=200,
        message="Eligibility form configuration retrieved",
        data=form_config,
    )
