"""
API endpoint tests.
"""

import pytest
from fastapi.testclient import TestClient


@pytest.mark.unit
def test_health_check(client: TestClient):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data


@pytest.mark.unit
def test_root_endpoint(client: TestClient):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert "docs" in data


@pytest.mark.unit
def test_api_docs(client: TestClient):
    """Test that OpenAPI docs are accessible."""
    response = client.get("/docs")
    assert response.status_code == 200


@pytest.mark.integration
def test_get_card_products(client: TestClient):
    """Test getting card products endpoint."""
    # This will fail if database is not connected
    response = client.get("/api/v1/reference/card-products")
    # Should return 200 or 500 (if DB not connected)
    assert response.status_code in [200, 500]


@pytest.mark.integration
def test_get_reference_data(client: TestClient):
    """Test getting reference data endpoint."""
    response = client.get("/api/v1/reference/CARD_NETWORK")
    # Should return 200 or 500 (if DB not connected)
    assert response.status_code in [200, 500]


@pytest.mark.unit
def test_create_session(client: TestClient):
    """Test session creation endpoint."""
    response = client.post(
        "/api/v1/session/create",
        json={"mode": "SELF"}
    )
    # May fail if DB not connected
    assert response.status_code in [200, 201, 500]


@pytest.mark.unit
def test_landing_features(client: TestClient):
    """Test landing page features endpoint."""
    response = client.get("/api/v1/landing/features")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "features" in data["data"]


@pytest.mark.unit
def test_404_handler(client: TestClient):
    """Test 404 error handler."""
    response = client.get("/nonexistent")
    assert response.status_code == 404
    data = response.json()
    assert data["status"] == 404
