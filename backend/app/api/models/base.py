"""
Base API models and schemas.
"""

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response format matching frontend expectations."""

    status: int = Field(..., description="HTTP status code", examples=[200])
    message: str = Field(..., description="Response message", examples=["Success"])
    data: Optional[T] = Field(None, description="Response payload")


class ErrorDetail(BaseModel):
    """Error detail model."""

    field: Optional[str] = Field(None, description="Field name that caused the error")
    message: str = Field(..., description="Error message")


class ErrorResponse(BaseModel):
    """Error response model."""

    status: int = Field(..., description="Error code", examples=[400])
    message: str = Field(..., description="Error message", examples=["Bad request"])
    errors: Optional[list[ErrorDetail]] = Field(None, description="Detailed error list")


class PaginationParams(BaseModel):
    """Pagination parameters."""

    page: int = Field(1, ge=1, description="Page number (1-indexed)")
    limit: int = Field(10, ge=1, le=100, description="Items per page")


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response model."""

    items: list[T] = Field(..., description="List of items")
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Items per page")
    pages: int = Field(..., description="Total number of pages")

    @classmethod
    def create(
        cls,
        items: list[T],
        total: int,
        page: int,
        limit: int,
    ) -> "PaginatedResponse[T]":
        """
        Create paginated response.

        Args:
            items: List of items for current page
            total: Total number of items
            page: Current page number
            limit: Items per page

        Returns:
            PaginatedResponse instance
        """
        pages = (total + limit - 1) // limit  # Ceiling division
        return cls(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=pages,
        )
