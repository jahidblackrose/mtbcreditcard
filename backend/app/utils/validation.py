"""
Validation utility functions.
"""

import re
from typing import Optional


def validate_mobile_number(mobile: str) -> bool:
    """
    Validate Bangladeshi mobile number.

    Args:
        mobile: Mobile number string

    Returns:
        True if valid, False otherwise
    """
    pattern = r"^01[3-9]\d{8}$"
    return bool(re.match(pattern, mobile))


def validate_nid_number(nid: str) -> bool:
    """
    Validate NID number (10 or 13 digits).

    Args:
        nid: NID number string

    Returns:
        True if valid, False otherwise
    """
    pattern = r"^\d{10}$|^\d{13}$|^\d{17}$"
    return bool(re.match(pattern, nid))


def validate_email(email: str) -> bool:
    """
    Validate email address.

    Args:
        email: Email address string

    Returns:
        True if valid, False otherwise
    """
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(pattern, email))


def mask_mobile_number(mobile: str, show_last: int = 2) -> str:
    """
    Mask mobile number for privacy.

    Args:
        mobile: Mobile number string
        show_last: Number of last digits to show

    Returns:
        Masked mobile number
    """
    if len(mobile) < 6:
        return "*******"
    return mobile[:4] + "******" + mobile[-show_last:]


def mask_nid_number(nid: str) -> str:
    """
    Mask NID number for privacy.

    Args:
        nid: NID number string

    Returns:
        Masked NID number
    """
    if len(nid) < 4:
        return "******"
    return nid[:2] + "******" + nid[-2:]


def generate_reference_number(application_id: str) -> str:
    """
    Generate reference number from application ID.

    Args:
        application_id: Application ID

    Returns:
        Reference number in format CC-YYYY-XXXXXX
    """
    from datetime import datetime

    year = datetime.now().year
    return f"CC-{year}-{application_id[:6].upper()}"
