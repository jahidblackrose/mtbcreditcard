"""
Step 5: Bank Accounts API endpoints.

Corresponding Procedures: 522 (save_bank_accounts), 523 (get_bank_accounts), 524 (delete_bank_account)
"""

import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from oracledb import Connection
from pydantic import BaseModel, Field

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


class BankAccountRequest(BaseModel):
    """Single bank account request."""

    bank_id: str = Field(..., description="Bank ID")
    account_number: str = Field(..., min_length=10, max_length=20)
    account_type: str = Field(..., description="Savings/Current")
    account_holder_name: str = Field(..., max_length=100)
    branch_name: Optional[str] = Field(None, max_length=100)
    ownership_type: str = Field(..., description="SINGLE/JOINT")


class SaveBankAccountsRequest(BaseModel):
    """Request to save multiple bank accounts."""

    accounts: List[BankAccountRequest] = Field(..., min_items=1, max_items=5)


@router.post("/{application_id}/bank-accounts", response_model=ApiResponse)
async def save_bank_accounts(
    application_id: str,
    request: SaveBankAccountsRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save bank accounts (Step 5).

    Calls procedure 522 (save_bank_accounts).
    """
    try:
        result = await call_procedure(
            db,
            "save_bank_accounts",
            p_json_in={
                "applicationId": application_id,
                "accounts": [acc.model_dump() for acc in request.accounts],
            },
        )

        return ApiResponse(
            status=200,
            message="Bank accounts saved successfully",
            data={"application_id": application_id, "count": len(request.accounts)},
        )

    except ProcedureError as e:
        logger.error(f"Error saving bank accounts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/bank-accounts", response_model=ApiResponse)
async def get_bank_accounts(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get bank accounts for an application.

    Calls procedure 523 (get_bank_accounts).
    """
    try:
        result = await call_procedure(
            db,
            "get_bank_accounts",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Bank accounts retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting bank accounts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.delete("/{application_id}/bank-accounts/{account_id}", response_model=ApiResponse)
async def delete_bank_account(
    application_id: str,
    account_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Delete a bank account.

    Calls procedure 524 (delete_bank_account).
    """
    try:
        result = await call_procedure(
            db,
            "delete_bank_account",
            p_json_in={"bankAccountId": account_id},
        )

        return ApiResponse(
            status=200,
            message="Bank account deleted successfully",
            data={"account_id": account_id},
        )

    except ProcedureError as e:
        logger.error(f"Error deleting bank account: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
