"""
Step 1: Card Selection API endpoint.

Corresponding Procedure: 517 (save_card_selection)
"""

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from oracledb import Connection
from pydantic import BaseModel, Field

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


class CardSelectionRequest(BaseModel):
    """Card selection request."""

    card_id: str = Field(..., description="Selected card ID")
    network: str = Field(..., description="Card network (VISA, MASTER)")
    tier: str = Field(..., description="Card tier (CLASSIC, GOLD, PLATINUM)")
    category: str = Field(..., description="Card category")
    requested_limit: str = Field(..., description="Requested credit limit")


@router.post("/{application_id}/card-selection", response_model=ApiResponse)
async def save_card_selection(
    application_id: str,
    request: CardSelectionRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save card selection (Step 1).

    Calls procedure 517 (save_card_selection).

    Args:
        application_id: Application ID
        request: Card selection data
        db: Database connection

    Returns:
        ApiResponse confirming save
    """
    try:
        result = await call_procedure(
            db,
            "save_card_selection",
            p_json_in={
                "applicationId": application_id,
                "cardId": request.card_id,
                "network": request.network,
                "tier": request.tier,
                "category": request.category,
                "requestedLimit": request.requested_limit,
            },
        )

        return ApiResponse(
            status=200,
            message="Card selection saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving card selection: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
