"""
Verify new backend endpoints syntax and structure.
This script validates the newly added endpoints without running the server.
"""

import sys
import os
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def test_imports():
    """Test that all modules can be imported."""
    print("Testing imports...")

    try:
        from app.api import applications
        print("✅ applications module imports successfully")
    except Exception as e:
        print(f"❌ applications module import failed: {e}")
        return False

    try:
        from app.api import auth
        print("✅ auth module imports successfully")
    except Exception as e:
        print(f"❌ auth module import failed: {e}")
        return False

    return True

def test_applications_endpoints():
    """Test applications.py endpoints exist."""
    print("\nTesting applications endpoints...")

    from app.api import applications
    router = applications.router

    routes = [route.path for route in router.routes]

    # Check for new endpoints
    expected_endpoints = [
        "/all",
        "/reference/{reference_number}/timeline"
    ]

    for endpoint in expected_endpoints:
        if any(endpoint in route for route in routes):
            print(f"✅ Endpoint {endpoint} exists")
        else:
            print(f"❌ Endpoint {endpoint} NOT FOUND")
            return False

    return True

def test_auth_endpoints():
    """Test auth.py endpoints exist."""
    print("\nTesting auth endpoints...")

    from app.api import auth
    router = auth.router

    routes = [(route.path, route.methods) for route in router.routes]

    # Check for new endpoints
    expected_endpoints = [
        ("/otp/resend", {"POST"}),
        ("/staff/logout", {"POST"}),
        ("/staff/session", {"GET"})
    ]

    for endpoint_path, methods in expected_endpoints:
        found = False
        for route_path, route_methods in routes:
            if endpoint_path in route_path and methods.intersection(route_methods):
                print(f"✅ Endpoint {endpoint_path} [{list(methods)[0]}] exists")
                found = True
                break

        if not found:
            print(f"❌ Endpoint {endpoint_path} [{list(methods)[0]}] NOT FOUND")
            return False

    return True

def test_endpoint_signatures():
    """Test endpoint function signatures."""
    print("\nTesting endpoint function signatures...")

    from app.api import applications, auth
    import inspect

    # Test get_all_applications signature
    sig = inspect.signature(applications.get_all_applications)
    params = list(sig.parameters.keys())
    expected_params = ['status', 'date_from', 'date_to', 'branch_code', 'page', 'limit', 'db']

    if all(p in params for p in expected_params):
        print("✅ get_all_applications has correct parameters")
    else:
        print(f"❌ get_all_applications missing parameters. Has: {params}")
        return False

    # Test get_application_timeline signature
    sig = inspect.signature(applications.get_application_timeline)
    params = list(sig.parameters.keys())

    if 'reference_number' in params and 'db' in params:
        print("✅ get_application_timeline has correct parameters")
    else:
        print(f"❌ get_application_timeline missing parameters. Has: {params}")
        return False

    # Test resend_otp signature
    sig = inspect.signature(auth.resend_otp)
    params = list(sig.parameters.keys())

    if 'request' in params and 'db' in params:
        print("✅ resend_otp has correct parameters")
    else:
        print(f"❌ resend_otp missing parameters. Has: {params}")
        return False

    # Test staff_logout signature
    sig = inspect.signature(auth.staff_logout)
    params = list(sig.parameters.keys())

    if 'credentials' in params:
        print("✅ staff_logout has correct parameters")
    else:
        print(f"❌ staff_logout missing parameters. Has: {params}")
        return False

    # Test get_staff_session signature
    sig = inspect.signature(auth.get_staff_session)
    params = list(sig.parameters.keys())

    if 'credentials' in params:
        print("✅ get_staff_session has correct parameters")
    else:
        print(f"❌ get_staff_session missing parameters. Has: {params}")
        return False

    return True

def test_response_models():
    """Test that response models are properly imported."""
    print("\nTesting response models...")

    try:
        from app.api.models import ApiResponse
        from app.api.models.application import (
            ApplicationDetails,
            ApplicationListItem,
            CreateApplicationResponse,
            SubmitApplicationResponse,
        )
        from app.api.models.auth import (
            OtpResponse,
            OtpVerifyResponse,
            StaffLoginResponse,
        )
        print("✅ All response models imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Response model import failed: {e}")
        return False

def generate_test_curl_commands():
    """Generate curl commands for manual testing."""
    print("\n" + "="*70)
    print("MANUAL TESTING COMMANDS")
    print("="*70)

    base_url = "http://localhost:8000/api/v1"

    print("\n1. Test Applications Filter:")
    print(f'curl -X GET "{base_url}/applications/all?status=SUBMITTED&page=1&limit=10"')

    print("\n2. Test Application Timeline:")
    ref = "MTBCC-20260128-001"
    print(f'curl -X GET "{base_url}/applications/reference/{ref}/timeline"')

    print("\n3. Test OTP Resend:")
    print(f'curl -X POST "{base_url}/auth/otp/resend" \\')
    print('  -H "Content-Type: application/json" \\')
    print('  -d \'{"mobile_number": "01712345678", "session_id": "sess_test"}\'')

    print("\n4. Test RM Logout (requires token):")
    print(f'curl -X POST "{base_url}/auth/staff/logout" \\')
    print('  -H "Authorization: Bearer YOUR_TOKEN_HERE"')

    print("\n5. Test RM Session Check (requires token):")
    print(f'curl -X GET "{base_url}/auth/staff/session" \\')
    print('  -H "Authorization: Bearer YOUR_TOKEN_HERE"')

    print("\n" + "="*70)

def main():
    """Run all tests."""
    print("="*70)
    print("BACKEND ENDPOINT VERIFICATION")
    print("="*70)

    results = []

    results.append(("Import Test", test_imports()))
    results.append(("Applications Endpoints", test_applications_endpoints()))
    results.append(("Auth Endpoints", test_auth_endpoints()))
    results.append(("Function Signatures", test_endpoint_signatures()))
    results.append(("Response Models", test_response_models()))

    print("\n" + "="*70)
    print("TEST RESULTS SUMMARY")
    print("="*70)

    all_passed = True
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if not result:
            all_passed = False

    print("="*70)

    if all_passed:
        print("\n🎉 ALL TESTS PASSED! Endpoints are ready for testing.")
        print("\nNext steps:")
        print("1. Start the backend server:")
        print("   cd backend && uvicorn app.main:app --reload")
        print("\n2. Run the manual testing commands above")
        print("\n3. Update frontend to use correct endpoint paths")
    else:
        print("\n⚠️ SOME TESTS FAILED. Please review the errors above.")

    print("\n")
    generate_test_curl_commands()

    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
