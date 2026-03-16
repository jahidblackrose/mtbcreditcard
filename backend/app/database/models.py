"""
Database response models.
"""

from typing import Any, Generic, TypeVar, Optional

from pydantic import BaseModel, Field


T = TypeVar("T")


class BaseResponse(BaseModel, Generic[T]):
    """Base API response with status, message, and optional data."""

    status: int = Field(..., description="HTTP status code")
    message: str = Field(..., description="Response message")
    data: Optional[T] = Field(None, description="Response data")

    model_config = {"json_encoders": {int: lambda v: str(v)}}


class ErrorResponse(BaseModel):
    """Error response model."""

    status: int = Field(..., description="Error code (e.g., 501-560)")
    message: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")


class SuccessResponse(BaseResponse[T]):
    """Success response with data."""

    status: int = Field(default=200, description="Success status code")
    message: str = Field(default="Success", description="Success message")
    data: Optional[T] = Field(None, description="Response data")


class ProcedureResponse(BaseModel):
    """Response from Oracle procedure execution."""

    status: str = Field(..., description="'S' for success or error code")
    message: str = Field(..., description="Procedure message")
    data: Optional[Any] = Field(None, alias="json_out", description="JSON output from procedure")

    model_config = {"populate_by_name": True}

    @property
    def is_success(self) -> bool:
        """Check if procedure execution was successful."""
        return self.status == "S"

    @property
    def error_code(self) -> Optional[int]:
        """Get error code if failed."""
        if self.is_success:
            return None
        try:
            return int(self.status)
        except (ValueError, TypeError):
            return None
