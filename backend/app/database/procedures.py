"""
Oracle procedure caller wrapper.
"""

import json
import logging
from typing import Any, Optional

import oracledb
from oracledb import Connection

from app.database.models import ProcedureResponse

logger = logging.getLogger(__name__)


class ProcedureError(Exception):
    """Custom exception for procedure errors."""

    def __init__(self, code: int, message: str):
        self.code = code
        self.message = message
        super().__init__(f"Procedure error {code}: {message}")


async def call_procedure(
    conn: Connection,
    procedure_name: str,
    p_json_in: Optional[dict | list | str] = None,
) -> ProcedureResponse:
    """
    Call a database procedure with standardized parameters.

    Most procedures follow this pattern:
    - Input: p_json_in (CLOB) - JSON input
    - Output: p_status (VARCHAR2), p_message (VARCHAR2), p_json_out (CLOB)

    Args:
        conn: Database connection
        procedure_name: Name of the procedure to call
        p_json_in: Input data as dict, list, or JSON string

    Returns:
        ProcedureResponse: Response with status, message, and data

    Raises:
        ProcedureError: If procedure returns an error status
        oracledb.DatabaseError: If database operation fails
    """
    # Convert input to JSON string if needed
    json_in_str = p_json_in
    if p_json_in is not None and not isinstance(p_json_in, str):
        json_in_str = json.dumps(p_json_in)
    elif p_json_in is None:
        json_in_str = None

    # Prepare output parameters
    p_status = conn.cursor().var(oracledb.STRING)
    p_message = conn.cursor().var(oracledb.STRING)
    p_json_out = conn.cursor().var(oracledb.CLOB)

    try:
        # Call the procedure
        procedure_call = f"""
        BEGIN
            pkg_credit_card_application.{procedure_name}(
                p_status => :p_status,
                p_message => :p_message,
                p_json_out => :p_json_out
                {', p_json_in => :p_json_in' if json_in_str is not None else ''}
            );
        END;
        """

        params = {
            "p_status": p_status,
            "p_message": p_message,
            "p_json_out": p_json_out,
        }

        if json_in_str is not None:
            params["p_json_in"] = json_in_str

        cursor = conn.cursor()
        cursor.execute(procedure_call, params)

        # Extract output values
        status_value = p_status.getvalue()
        message_value = p_message.getvalue()
        json_out_value = p_json_out.getvalue()

        logger.info(
            f"Procedure {procedure_name} returned: status={status_value}, message={message_value}"
        )

        # Parse JSON output
        json_data = None
        if json_out_value:
            try:
                json_data = json.loads(json_out_value.read())
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse JSON output: {e}")
                json_data = json_out_value.getvalue()

        # Create response
        response = ProcedureResponse(
            status=status_value,
            message=message_value,
            data=json_data,
        )

        # Raise error if procedure failed
        if not response.is_success:
            error_code = response.error_code
            if error_code:
                raise ProcedureError(error_code, message_value)

        return response

    except oracledb.DatabaseError as e:
        logger.error(f"Database error calling {procedure_name}: {e}")
        raise ProcedureError(500, f"Database error: {str(e)}")


async def call_procedure_with_params(
    conn: Connection,
    procedure_name: str,
    **params,
) -> ProcedureResponse:
    """
    Call a database procedure with custom parameters.

    Use this for procedures that don't follow the standard pattern.

    Args:
        conn: Database connection
        procedure_name: Name of the procedure to call
        **params: Procedure parameters as keyword arguments

    Returns:
        ProcedureResponse: Response with status, message, and data

    Raises:
        ProcedureError: If procedure returns an error status
        oracledb.DatabaseError: If database operation fails
    """
    try:
        # Build parameter bindings
        in_params = {}
        out_params = {}

        for key, value in params.items():
            if value == "OUT":
                # Create output variable
                if key.startswith("p_"):
                    param_type = oracledb.STRING
                    if "json" in key.lower():
                        param_type = oracledb.CLOB
                    out_params[key] = conn.cursor().var(param_type)
                    in_params[key] = out_params[key]
                else:
                    raise ValueError(f"Output parameter must start with 'p_': {key}")
            else:
                in_params[key] = value

        # Build procedure call
        param_list = ", ".join([f"{k} => :{k}" for k in in_params.keys()])
        procedure_call = f"BEGIN pkg_credit_card_application.{procedure_name}({param_list}); END;"

        # Execute
        cursor = conn.cursor()
        cursor.execute(procedure_call, in_params)

        # Extract output values
        result = {}
        for key, var in out_params.items():
            value = var.getvalue()
            if isinstance(value, oracledb.Lob):
                value = value.read()
            result[key] = value

        # Assume standard output parameters if present
        status_value = result.get("p_status", "S")
        message_value = result.get("p_message", "Success")
        json_out_value = result.get("p_json_out")

        # Parse JSON output
        json_data = None
        if json_out_value:
            try:
                json_data = json.loads(json_out_value)
            except (json.JSONDecodeError, TypeError):
                json_data = json_out_value

        response = ProcedureResponse(
            status=status_value,
            message=message_value,
            data=json_data,
        )

        if not response.is_success:
            error_code = response.error_code
            if error_code:
                raise ProcedureError(error_code, message_value)

        return response

    except oracledb.DatabaseError as e:
        logger.error(f"Database error calling {procedure_name}: {e}")
        raise ProcedureError(500, f"Database error: {str(e)}")
