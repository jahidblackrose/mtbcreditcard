"""
Step 10: Documents & Media API endpoints.

Corresponding Procedures: 535 (save_applicant_media), 536 (get_applicant_media), 537 (upload_document), 538 (get_documents)
"""

import logging
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from oracledb import Connection
from pydantic import BaseModel, Field

from app.api.models import ApiResponse
from app.database.connection import get_db
from app.database.procedures import ProcedureError, call_procedure

logger = logging.getLogger(__name__)

router = APIRouter()


class ApplicantMediaRequest(BaseModel):
    """Applicant photo and signature request."""

    photo_url: Optional[str] = Field(None, description="Photo URL")
    signature_url: Optional[str] = Field(None, description="Signature URL")
    photo_type: Optional[str] = Field(None, description="Photo document type ID")
    signature_type: Optional[str] = Field(None, description="Signature document type ID")


class DocumentRequest(BaseModel):
    """Document upload request."""

    document_type: str = Field(..., description="Document type")
    document_url: str = Field(..., description="Document URL (from cloud storage)")
    file_name: str = Field(..., description="Original file name")
    file_size: Optional[int] = Field(None, description="File size in bytes")
    mime_type: Optional[str] = Field(None, description="MIME type")


@router.post("/{application_id}/media", response_model=ApiResponse)
async def save_applicant_media(
    application_id: str,
    request: ApplicantMediaRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Save applicant photo and signature (Step 10a).

    Calls procedure 535 (save_applicant_media).
    """
    try:
        result = await call_procedure(
            db,
            "save_applicant_media",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=200,
            message="Applicant media saved successfully",
            data={"application_id": application_id},
        )

    except ProcedureError as e:
        logger.error(f"Error saving applicant media: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/media", response_model=ApiResponse)
async def get_applicant_media(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get applicant photo and signature.

    Calls procedure 536 (get_applicant_media).
    """
    try:
        result = await call_procedure(
            db,
            "get_applicant_media",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Applicant media retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting applicant media: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.post("/{application_id}/documents", response_model=ApiResponse)
async def upload_document(
    application_id: str,
    request: DocumentRequest,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Upload a document (Step 10b).

    Calls procedure 537 (upload_document).
    """
    try:
        result = await call_procedure(
            db,
            "upload_document",
            p_json_in={
                "applicationId": application_id,
                **request.model_dump(),
            },
        )

        return ApiResponse(
            status=201,
            message="Document uploaded successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )


@router.get("/{application_id}/documents", response_model=ApiResponse)
async def get_documents(
    application_id: str,
    db: Connection = Depends(get_db),
) -> ApiResponse:
    """
    Get all documents for an application.

    Calls procedure 538 (get_documents).
    """
    try:
        result = await call_procedure(
            db,
            "get_documents",
            p_json_in={"applicationId": application_id},
        )

        return ApiResponse(
            status=200,
            message="Documents retrieved successfully",
            data=result.data,
        )

    except ProcedureError as e:
        logger.error(f"Error getting documents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
        )
