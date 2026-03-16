"""
Pytest configuration and fixtures.
"""

import os
import pytest
from typing import AsyncGenerator, Generator

from fastapi.testclient import TestClient
from httpx import AsyncClient

from app.main import app


@pytest.fixture
def client() -> Generator:
    """
    Create test client for FastAPI app.

    Yields:
        TestClient: FastAPI test client
    """
    with TestClient(app) as c:
        yield c


@pytest.fixture
async def async_client() -> AsyncGenerator:
    """
    Create async test client.

    Yields:
        AsyncClient: Async HTTP client
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def test_env():
    """Set test environment variables."""
    os.environ["ENVIRONMENT"] = "testing"
    os.environ["DEBUG"] = "true"
    os.environ["DB_HOST"] = "localhost"
    os.environ["REDIS_HOST"] = "localhost"
    yield
    # Cleanup
    del os.environ["ENVIRONMENT"]
    del os.environ["DEBUG"]


# Skip database tests if no connection
def pytest_configure(config):
    """Configure pytest markers."""
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )
    config.addinivalue_line(
        "markers", "unit: mark test as unit test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running"
    )
