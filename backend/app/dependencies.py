"""
Dependency injection for FastAPI routes.
"""

from typing import AsyncGenerator

from oracledb import Connection


async def get_db_connection() -> AsyncGenerator[Connection, None]:
    """
    Get database connection from pool.

    Yields:
        Connection: Oracle database connection

    Note:
        This is a placeholder. Actual implementation will be in
        app/database/connection.py
    """
    # Will be implemented in database connection module
    raise NotImplementedError("Use get_db from app.database.connection instead")
