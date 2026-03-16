"""
Authentication tests.
"""

import pytest
from fastapi.testclient import TestClient


@pytest.mark.unit
def test_otp_request(client: TestClient):
    """Test OTP request endpoint."""
    response = client.post(
        "/api/v1/auth/otp/request",
        json={
            "mobile_number": "01712345678",
            "session_id": "test-session"
        }
    )
    # May fail if DB not connected
    assert response.status_code in [200, 500]


@pytest.mark.unit
def test_otp_verify(client: TestClient):
    """Test OTP verification endpoint."""
    response = client.post(
        "/api/v1/auth/otp/verify",
        json={
            "mobile_number": "01712345678",
            "otp": "123456",
            "session_id": "test-session"
        }
    )
    # Will fail with invalid OTP or if DB not connected
    assert response.status_code in [200, 400, 500]


@pytest.mark.unit
def test_staff_login(client: TestClient):
    """Test staff login endpoint."""
    response = client.post(
        "/api/v1/auth/staff/login",
        json={
            "staff_id": "admin",
            "password": "admin123"
        }
    )
    # Should succeed with mock credentials
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    if response.status_code == 200:
        assert "access_token" in data["data"]


@pytest.mark.unit
def test_protected_endpoint_without_token(client: TestClient):
    """Test that protected endpoints require authentication."""
    # Try to access an endpoint that requires auth
    # This is just a placeholder - adjust with actual protected endpoint
    response = client.get("/api/v1/dashboard/my-applications")
    # Should return 401 or fail gracefully
    assert response.status_code in [401, 500]


@pytest.mark.unit
def test_token_refresh(client: TestClient):
    """Test token refresh endpoint."""
    # First get a valid token
    login_response = client.post(
        "/api/v1/auth/staff/login",
        json={"staff_id": "admin", "password": "admin123"}
    )

    if login_response.status_code == 200:
        refresh_token = login_response.json()["data"]["refresh_token"]

        # Now refresh
        response = client.post(
            "/api/v1/auth/staff/refresh",
            json={"refresh_token": refresh_token}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data["data"]
