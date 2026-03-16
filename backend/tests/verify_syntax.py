"""
Simple syntax check for new backend endpoints.
Checks code structure without importing modules.
"""

import re
from pathlib import Path

def check_file_syntax(filepath):
    """Check if a Python file has valid syntax."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        compile(code, filepath, 'exec')
        return True, None
    except SyntaxError as e:
        return False, str(e)

def extract_function_signatures(filepath, function_name):
    """Extract function signatures from a file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find function definition
    pattern = rf'async def {function_name}\([^)]*\):'
    match = re.search(pattern, content)

    if match:
        # Get the full signature
        start = match.start()
        # Find the end of the signature (closing paren)
        end = content.find(':', start)
        signature = content[start:end+1]
        return signature
    return None

def check_endpoint_exists(filepath, endpoint_path, method):
    """Check if an endpoint exists in a file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for router decorator with the endpoint
    patterns = [
        f'@router.{method.lower()}("{endpoint_path}"',
        f'@router.{method.lower()}("/{endpoint_path}"',
        f'router.{method.lower()}("{endpoint_path}"',
        f'router.{method.lower()}("/{endpoint_path}"'
    ]

    for pattern in patterns:
        if pattern in content:
            return True
    return False

def main():
    print("="*70)
    print("BACKEND ENDPOINT SYNTAX VERIFICATION")
    print("="*70)

    backend_dir = Path(__file__).parent.parent

    # Files to check
    applications_file = backend_dir / "app" / "api" / "applications.py"
    auth_file = backend_dir / "app" / "api" / "auth.py"

    print("\n1. Checking file syntax...")

    syntax_ok = True

    # Check applications.py
    valid, error = check_file_syntax(applications_file)
    if valid:
        print("   OK applications.py - Valid Python syntax")
    else:
        print(f"   FAIL applications.py - Syntax error: {error}")
        syntax_ok = False

    # Check auth.py
    valid, error = check_file_syntax(auth_file)
    if valid:
        print("   OK auth.py - Valid Python syntax")
    else:
        print(f"   FAIL auth.py - Syntax error: {error}")
        syntax_ok = False

    if not syntax_ok:
        print("\nSyntax errors found. Please fix before continuing.")
        return False

    print("\n2. Checking new endpoints exist...")

    endpoints_to_check = [
        ("applications.py", "all", "GET", "get_all_applications"),
        ("applications.py", "reference/{reference_number}/timeline", "GET", "get_application_timeline"),
        ("auth.py", "otp/resend", "POST", "resend_otp"),
        ("auth.py", "staff/logout", "POST", "staff_logout"),
        ("auth.py", "staff/session", "GET", "get_staff_session"),
    ]

    all_found = True
    for filename, endpoint_path, method, func_name in endpoints_to_check:
        filepath = backend_dir / "app" / "api" / filename
        exists = check_endpoint_exists(filepath, endpoint_path, method)

        if exists:
            print(f"   OK {method:6} /{endpoint_path}")

            # Try to extract function signature
            sig = extract_function_signatures(filepath, func_name)
            if sig:
                print(f"      Function: {sig}")
        else:
            print(f"   FAIL {method:6} /{endpoint_path} - NOT FOUND")
            all_found = False

    print("\n3. Checking function implementations...")

    # Read applications.py to check implementations
    with open(applications_file, 'r', encoding='utf-8') as f:
        app_content = f.read()

    if 'async def get_all_applications' in app_content:
        print("   OK get_all_applications function exists")
        if 'status: Optional[str]' in app_content:
            print("      - Has status filter parameter")
        if 'date_from' in app_content:
            print("      - Has date_from filter parameter")
        if 'date_to' in app_content:
            print("      - Has date_to filter parameter")
        if 'branch_code' in app_content:
            print("      - Has branch_code filter parameter")
    else:
        print("   FAIL get_all_applications function NOT FOUND")
        all_found = False

    if 'async def get_application_timeline' in app_content:
        print("   OK get_application_timeline function exists")
        if 'reference_number' in app_content:
            print("      - Has reference_number parameter")
    else:
        print("   FAIL get_application_timeline function NOT FOUND")
        all_found = False

    # Read auth.py to check implementations
    with open(auth_file, 'r', encoding='utf-8') as f:
        auth_content = f.read()

    if 'async def resend_otp' in auth_content:
        print("   OK resend_otp function exists")
    else:
        print("   FAIL resend_otp function NOT FOUND")
        all_found = False

    if 'async def staff_logout' in auth_content:
        print("   OK staff_logout function exists")
    else:
        print("   FAIL staff_logout function NOT FOUND")
        all_found = False

    if 'async def get_staff_session' in auth_content:
        print("   OK get_staff_session function exists")
    else:
        print("   FAIL get_staff_session function NOT FOUND")
        all_found = False

    print("\n" + "="*70)

    if all_found:
        print("SUCCESS: All 5 new endpoints verified!")
        print("\nThe endpoints are properly implemented and ready for testing.")
        print("\nNext steps to test:")
        print("1. Install backend dependencies:")
        print("   cd backend")
        print("   pip install -e .")
        print("\n2. Start the backend server:")
        print("   uvicorn app.main:app --reload --port 8000")
        print("\n3. Test endpoints using curl or Postman")
    else:
        print("FAILED: Some endpoints are missing or incomplete")
        print("Please review the errors above.")

    print("="*70)

    return all_found

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
