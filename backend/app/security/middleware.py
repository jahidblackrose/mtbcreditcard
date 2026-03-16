"""
Rate limiting and security middleware.
"""

import logging
from typing import Callable

from fastapi import Request, Response, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings

logger = logging.getLogger(__name__)

# Initialize rate limiter
# Note: In production, use Redis storage instead of memory
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.general_rate_limit_per_minute}/minute"],
    storage_uri="",  # Will be updated to Redis in production
)


def get_rate_limit_key_from_mobile(request: Request) -> str:
    """
    Get rate limit key based on mobile number from request body.

    Used for OTP endpoints to limit per mobile number.

    Args:
        request: FastAPI request

    Returns:
        Rate limit key string
    """
    # Try to get mobile from request body
    # Note: This requires the request body to be cached
    mobile = request.state.mobile_number if hasattr(request.state, "mobile_number") else None
    if mobile:
        return f"mobile:{mobile}"
    return get_remote_address(request)


def get_rate_limit_key_from_session(request: Request) -> str:
    """
    Get rate limit key based on session ID.

    Used for draft endpoints to limit per session.

    Args:
        request: FastAPI request

    Returns:
        Rate limit key string
    """
    # Try to get session_id from path or header
    session_id = (
        request.path_params.get("session_id")
        or request.headers.get("X-Session-ID")
    )
    if session_id:
        return f"session:{session_id}"
    return get_remote_address(request)


async def rate_limit_exception_handler(
    request: Request,
    exc: RateLimitExceeded,
) -> Response:
    """
    Handle rate limit exceeded exceptions.

    Args:
        request: FastAPI request
        exc: Rate limit exception

    Returns:
        JSON response with rate limit error
    """
    logger.warning(f"Rate limit exceeded: {request.url.path} from {get_remote_address(request)}")

    return Response(
        content='{"status": 429, "message": "Too many requests. Please try again later."}',
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        media_type="application/json",
    )


# Security headers middleware
async def add_security_headers(request: Request, call_next: Callable) -> Response:
    """
    Add security headers to all responses.

    Args:
        request: FastAPI request
        call_next: Next middleware/route handler

    Returns:
        Response with security headers added
    """
    response = await call_next(request)

    # Add security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

    if not settings.debug:
        # Only add strict security headers in production
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

    return response
