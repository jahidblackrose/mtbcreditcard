"""
Authentication dependencies for FastAPI routes.
"""

import logging
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.security.jwt import verify_token

logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer(auto_error=False)


# User models (will be expanded when we have user tables)
class User:
    """Minimal user model for JWT authentication."""

    def __init__(
        self,
        user_id: str,
        role: str,
        username: Optional[str] = None,
        branch_id: Optional[str] = None,
    ):
        self.user_id = user_id
        self.role = role
        self.username = username
        self.branch_id = branch_id

    def __repr__(self):
        return f"User(id={self.user_id}, role={self.role})"


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> User:
    """
    Get authenticated user from JWT token.

    Args:
        credentials: HTTP Bearer credentials

    Returns:
        User: Authenticated user object

    Raises:
        HTTPException: If token is missing or invalid
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Verify access token
        payload = verify_token(credentials.credentials, token_type="access")

        # Extract user info
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        role = payload.get("role", "APPLICANT")
        username = payload.get("username")
        branch_id = payload.get("branch_id")

        return User(
            user_id=user_id,
            role=role,
            username=username,
            branch_id=branch_id,
        )

    except Exception as e:
        logger.warning(f"Authentication failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_rm_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get authenticated RM (Relationship Manager) user.

    Args:
        current_user: Current authenticated user

    Returns:
        User: RM user object

    Raises:
        HTTPException: If user is not an RM or Branch Manager
    """
    allowed_roles = {"RM", "BRANCH_MANAGER", "ADMIN"}

    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. RM or Branch Manager access required.",
        )

    return current_user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Optional[User]:
    """
    Get user from token if provided, without requiring authentication.

    Args:
        credentials: HTTP Bearer credentials (optional)

    Returns:
        Optional[User]: User object if token valid, None otherwise
    """
    if credentials is None:
        return None

    try:
        payload = verify_token(credentials.credentials, token_type="access")
        user_id = payload.get("sub")

        if user_id is None:
            return None

        return User(
            user_id=user_id,
            role=payload.get("role", "APPLICANT"),
            username=payload.get("username"),
            branch_id=payload.get("branch_id"),
        )

    except Exception:
        return None


def require_role(*allowed_roles: str):
    """
    Create dependency that requires specific user roles.

    Args:
        *allowed_roles: Allowed role names

    Returns:
        Dependency function that checks user role

    Example:
        @app.get("/admin/dashboard")
        async def admin_dashboard(
            user: User = Depends(require_role("ADMIN"))
        ):
            ...
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required roles: {', '.join(allowed_roles)}",
            )
        return current_user

    return role_checker
