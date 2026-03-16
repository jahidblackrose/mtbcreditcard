"""
JSON utility functions.
"""

import json
from datetime import datetime
from typing import Any


def json_dumps(obj: Any, **kwargs) -> str:
    """
    Serialize object to JSON string.

    Args:
        obj: Object to serialize
        **kwargs: Additional arguments for json.dumps

    Returns:
        JSON string
    """
    return json.dumps(obj, ensure_ascii=False, **kwargs)


def json_loads(s: str, **kwargs) -> Any:
    """
    Deserialize JSON string to object.

    Args:
        s: JSON string
        **kwargs: Additional arguments for json.loads

    Returns:
        Deserialized object
    """
    return json.loads(s, **kwargs)


def sanitize_json_input(data: dict) -> dict:
    """
    Sanitize JSON input by removing None values and empty strings.

    Args:
        data: Input dictionary

    Returns:
        Sanitized dictionary
    """
    return {
        k: v
        for k, v in data.items()
        if v is not None and v != ""
    }


def format_iso_datetime(dt: datetime) -> str:
    """
    Format datetime as ISO 8601 string.

    Args:
        dt: DateTime object

    Returns:
        ISO 8601 formatted string
    """
    return dt.isoformat(timespec="seconds")


def parse_iso_datetime(s: str) -> datetime:
    """
    Parse ISO 8601 string to datetime.

    Args:
        s: ISO 8601 formatted string

    Returns:
        DateTime object
    """
    return datetime.fromisoformat(s)
