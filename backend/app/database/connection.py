"""
Oracle database connection pool management.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional

import oracledb
from oracledb import Connection

from app.config import settings

logger = logging.getLogger(__name__)

# Global connection pool
_pool: Optional[oracledb.Pool] = None


async def init_db_pool() -> None:
    """
    Initialize Oracle database connection pool.

    Raises:
        oracledb.DatabaseError: If connection fails
    """
    global _pool

    if _pool is not None:
        logger.warning("Database pool already initialized")
        return

    try:
        logger.info(
            f"Connecting to Oracle at {settings.db_host}:{settings.db_port}/{settings.db_service_name}"
        )

        # Create connection pool
        _pool = oracledb.create_pool(
            user=settings.db_user,
            password=settings.db_password,
            host=settings.db_host,
            port=settings.db_port,
            service_name=settings.db_service_name,
            min=settings.db_pool_min,
            max=settings.db_pool_max,
            increment=settings.db_pool_increment,
            threaded=True,
        )

        logger.info(f"Database connection pool created (min={settings.db_pool_min}, max={settings.db_pool_max})")

        # Test connection
        with _pool.acquire() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM DUAL")
            result = cursor.fetchone()
            if result and result[0] == 1:
                logger.info("Database connection test successful")

    except oracledb.DatabaseError as e:
        logger.error(f"Failed to initialize database pool: {e}")
        raise


async def close_db_pool() -> None:
    """Close database connection pool."""
    global _pool

    if _pool is None:
        return

    try:
        _pool.close()
        logger.info("Database connection pool closed")
    except oracledb.DatabaseError as e:
        logger.error(f"Error closing database pool: {e}")
    finally:
        _pool = None


@asynccontextmanager
async def get_db() -> AsyncGenerator[Connection, None]:
    """
    Get database connection from pool.

    Yields:
        Connection: Oracle database connection

    Raises:
        RuntimeError: If pool is not initialized
    """
    global _pool

    if _pool is None:
        raise RuntimeError("Database pool not initialized. Call init_db_pool() first.")

    conn = None
    try:
        conn = _pool.acquire()
        yield conn
    except oracledb.DatabaseError as e:
        logger.error(f"Database error: {e}")
        raise
    finally:
        if conn is not None:
            _pool.release(conn)


def get_pool() -> Optional[oracledb.Pool]:
    """
    Get the connection pool instance.

    Returns:
        Optional[Pool]: Connection pool or None if not initialized
    """
    return _pool


async def health_check() -> bool:
    """
    Check database connection health.

    Returns:
        bool: True if connection is healthy, False otherwise
    """
    try:
        async with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM DUAL")
            result = cursor.fetchone()
            return result is not None and result[0] == 1
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False
