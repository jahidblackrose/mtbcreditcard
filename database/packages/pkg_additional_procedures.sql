-- =============================================================================
-- MTB Credit Card Application System - Additional Procedures
-- Session 2 Procedures: get_all_applications, get_application_timeline
-- Error Codes: 561-562
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Procedure: get_all_applications (561)
-- Purpose: Retrieve applications with multiple filters for RM dashboard
-- Parameters:
--   p_json_in: JSON object with filters (status, dateFrom, dateTo, branchCode, page, limit)
--   p_status, p_message, p_json_out: Standard output parameters
-- Usage: RM dashboard to list and filter applications
-- ---------------------------------------------------------------------------

PROCEDURE get_all_applications(
  p_json_in  IN  CLOB,
  p_status   OUT VARCHAR2,
  p_message  OUT VARCHAR2,
  p_json_out OUT CLOB
) IS
  v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_all_applications';

  -- Parse input JSON
  v_filter_status       VARCHAR2(30);
  v_filter_date_from    VARCHAR2(50);
  v_filter_date_to      VARCHAR2(50);
  v_filter_branch_code  VARCHAR2(20);
  v_page                NUMBER := 1;
  v_limit               NUMBER := 50;
  v_offset              NUMBER;

  -- Count for pagination
  v_total_count         NUMBER;

BEGIN
  -- Parse JSON input
  JSON_TABLE(
    p_json_in, '$' COLUMNS (
      status       VARCHAR2(30) PATH '$.status',
      dateFrom     VARCHAR2(50) PATH '$.dateFrom',
      dateTo       VARCHAR2(50) PATH '$.dateTo',
      branchCode   VARCHAR2(20) PATH '$.branchCode',
      page         NUMBER         PATH '$.page',
      limit        NUMBER         PATH '$.limit'
    )
  ). INTO (
    v_filter_status,
    v_filter_date_from,
    v_filter_date_to,
    v_filter_branch_code,
    v_page,
    v_limit
  );

  -- Set defaults
  IF v_page IS NULL OR v_page < 1 THEN
    v_page := 1;
  END IF;

  IF v_limit IS NULL OR v_limit < 1 OR v_limit > 100 THEN
    v_limit := 50;
  END IF;

  v_offset := (v_page - 1) * v_limit;

  -- Build dynamic query with filters
  DECLARE
    v_query CLOB;
    v_where_clause VARCHAR2(4000) := '1=1';
    v_result CLOB;
  BEGIN
    -- Build WHERE clause
    IF v_filter_status IS NOT NULL THEN
      v_where_clause := v_where_clause || ' AND app.application_status = ''' || v_filter_status || '''';
    END IF;

    IF v_filter_date_from IS NOT NULL THEN
      v_where_clause := v_where_clause || ' AND TRUNC(app.created_at) >= TO_DATE(''' || v_filter_date_from || ''', ''YYYY-MM-DD'')';
    END IF;

    IF v_filter_date_to IS NOT NULL THEN
      v_where_clause := v_where_clause || ' AND TRUNC(app.created_at) <= TO_DATE(''' || v_filter_date_to || ''', ''YYYY-MM-DD'')';
    END IF;

    IF v_filter_branch_code IS NOT NULL THEN
      v_where_clause := v_where_clause || ' AND app.branch_id = ''' || v_filter_branch_code || '''';
    END IF;

    -- Get total count for pagination
    EXECUTE IMMEDIATE '
      SELECT COUNT(*)
      FROM TCC_APPLICATION app
      JOIN TCC_APPLICANT apt ON app.applicant_id = apt.applicant_id
      WHERE ' || v_where_clause
    INTO v_total_count;

    -- Build main query with pagination
    v_query := '
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          ''application_id'' VALUE app.application_id,
          ''reference_number'' VALUE app.reference_number,
          ''status'' VALUE app.application_status,
          ''card_product_name'' VALUE
            (CASE
              WHEN app.card_type_id IS NOT NULL THEN
                (SELECT card_name FROM TCC_REF_CARD_TYPE WHERE card_type_id = app.card_type_id)
              ELSE app.card_network || '' '' || app.card_tier
            END),
          ''applicant_name'' VALUE apt.full_name,
          ''mobile_number'' VALUE apt.mobile_number,
          ''email'' VALUE apt.email,
          ''created_at'' VALUE TO_CHAR(app.created_at, ''YYYY-MM-DD"T"HH24:MI:SS"Z''),
          ''submitted_at'' VALUE
            (CASE WHEN app.submitted_at IS NOT NULL THEN
              TO_CHAR(app.submitted_at, ''YYYY-MM-DD"T"HH24:MI:SS"Z'')
            END),
          ''last_updated_at'' VALUE TO_CHAR(app.updated_at, ''YYYY-MM-DD"T"HH24:MI:SS"Z''),
          ''current_step'' VALUE app.current_step,
          ''highest_step'' VALUE app.highest_step,
          ''total_steps'' VALUE 12,
          ''is_submitted'' VALUE
            (CASE WHEN app.submitted_at IS NOT NULL THEN ''true'' ELSE ''false'' END),
          ''branch_id'' VALUE app.branch_id,
          ''application_mode'' VALUE app.application_mode
        )
      )
      FROM (
        SELECT app.*
        FROM TCC_APPLICATION app
        JOIN TCC_APPLICANT apt ON app.applicant_id = apt.applicant_id
        WHERE ' || v_where_clause || '
        ORDER BY app.created_at DESC
      ) app
      OFFSET ' || v_offset || ' ROWS FETCH NEXT ' || v_limit || ' ROWS ONLY
    ';

    -- Execute query
    EXECUTE IMMEDIATE v_query INTO v_result;

    -- Return results with pagination info
    p_json_out := JSON_OBJECT(
      'applications' VALUE v_result,
      'pagination' VALUE JSON_OBJECT(
        'page' VALUE v_page,
        'limit' VALUE v_limit,
        'total' VALUE v_total_count,
        'totalPages' VALUE CEIL(v_total_count / v_limit)
      )
    ).TO_CLOB();

    p_status := 'S';
    p_message := 'Applications retrieved successfully';

  END;

EXCEPTION
  WHEN OTHERS THEN
    write_error_log('561', SQLERRM, v_proc);
    p_status := '561';
    p_message := '561 : Error retrieving applications. See TCC_ERROR_LOG.';
    p_json_out := NULL;
END get_all_applications;


-- ---------------------------------------------------------------------------
-- Procedure: get_application_timeline (562)
-- Purpose: Retrieve audit trail/timeline for an application
-- Parameters:
--   p_json_in: JSON object with referenceNumber
--   p_status, p_message, p_json_out: Standard output parameters
-- Usage: Track application status changes and events
-- Note: Since there's no dedicated audit table, builds timeline from application data
-- ---------------------------------------------------------------------------

PROCEDURE get_application_timeline(
  p_json_in  IN  CLOB,
  p_status   OUT VARCHAR2,
  p_message  OUT VARCHAR2,
  p_json_out OUT CLOB
) IS
  v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_application_timeline';

  v_reference_number  VARCHAR2(30);
  v_application_id     VARCHAR2(36);
  v_applicant_id      VARCHAR2(36);
  v_applicant_name    VARCHAR2(200);
  v_mobile_number      VARCHAR2(20);
  v_app_status        VARCHAR2(30);
  v_created_at        TIMESTAMP;
  v_submitted_at      TIMESTAMP;
  v_approved_at       TIMESTAMP;
  v_rejected_at       TIMESTAMP;
  v_current_step      NUMBER;
  v_updated_at        TIMESTAMP;

  v_timeline          JSON_ARRAY_T;

BEGIN
  -- Parse JSON input
  JSON_TABLE(
    p_json_in, '$' COLUMNS (
      referenceNumber VARCHAR2(30) PATH '$.referenceNumber'
    )
  ) INTO v_reference_number;

  -- Get application details
  SELECT
    app.application_id,
    app.applicant_id,
    apt.full_name,
    apt.mobile_number,
    app.application_status,
    app.created_at,
    app.submitted_at,
    app.approved_at,
    app.rejected_at,
    app.current_step,
    app.updated_at
  INTO
    v_application_id,
    v_applicant_id,
    v_applicant_name,
    v_mobile_number,
    v_app_status,
    v_created_at,
    v_submitted_at,
    v_approved_at,
    v_rejected_at,
    v_current_step,
    v_updated_at
  FROM TCC_APPLICATION app
  JOIN TCC_APPLICANT apt ON app.applicant_id = apt.applicant_id
  WHERE app.reference_number = v_reference_number;

  -- If application not found
  IF SQL%NOTFOUND THEN
    p_status := '562';
    p_message := 'Application not found with reference number: ' || v_reference_number;
    p_json_out := JSON_OBJECT('timeline' VALUE '[]').TO_CLOB();
    RETURN;
  END IF;

  -- Build timeline from application events
  v_timeline := JSON_ARRAY_T();

  -- Event 1: Application Created
  v_timeline := v_timeline || JSON_ARRAY_T(
    JSON_OBJECT(
      'timestamp' VALUE TO_CHAR(v_created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z'),
      'event' VALUE 'Application Created',
      'status' VALUE 'completed',
      'description' VALUE 'Application initiated',
      'actor' VALUE 'APPLICANT'
    ).TO_CLOB()
  );

  -- Event 2: OTP Verified (if verified)
  IF v_app_status != 'PENDING_OTP' AND v_app_status != 'DRAFT' THEN
    SELECT json_verify INTO v_timeline FROM dual WHERE 1=0; -- Placeholder
    -- Note: OTP verification timestamp not currently stored
    -- Would need to query session/logs table when available
  END IF;

  -- Event 3: Steps Progress (show significant milestones)
  IF v_current_step >= 6 THEN
    v_timeline := v_timeline || JSON_ARRAY_T(
      JSON_OBJECT(
        'timestamp' VALUE TO_CHAR(v_updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z'),
        'event' VALUE 'Information Completed',
        'status' VALUE 'completed',
        'description' VALUE 'Completed step ' || v_current_step || ' of 12',
        'actor' VALUE 'APPLICANT'
      ).TO_CLOB()
    );
  END IF;

  -- Event 4: Application Submitted
  IF v_submitted_at IS NOT NULL THEN
    v_timeline := v_timeline || JSON_ARRAY_T(
      JSON_OBJECT(
        'timestamp' VALUE TO_CHAR(v_submitted_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z'),
        'event' VALUE 'Application Submitted',
        'status' VALUE 'completed',
        'description' VALUE 'Application submitted for review',
        'actor' VALUE 'APPLICANT'
      ).TO_CLOB()
    );
  END IF;

  -- Event 5: Status Update based on current status
  IF v_app_status = 'UNDER_REVIEW' THEN
    v_timeline := v_timeline || JSON_ARRAY_T(
      JSON_OBJECT(
        'timestamp' VALUE TO_CHAR(v_updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z'),
        'event' VALUE 'Under Review',
        'status' VALUE 'current',
        'description' VALUE 'Application is being reviewed by the team',
        'actor' VALUE 'SYSTEM'
      ).TO_CLOB()
    );
  ELSIF v_app_status = 'DOCUMENTS_REQUIRED' THEN
    v_timeline := v_timeline || JSON_ARRAY_T(
      JSON_OBJECT(
        'timestamp' VALUE TO_CHAR(v_updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z'),
        'event' VALUE 'Documents Required',
        'status' VALUE 'pending',
        'description' VALUE 'Additional documents are required for processing',
        'actor' VALUE 'SYSTEM'
      ).TO_CLOB()
    );
  ELSIF v_app_status = 'APPROVED' AND v_approved_at IS NOT NULL THEN
    v_timeline := v_timeline || JSON_ARRAY_T(
      JSON_OBJECT(
        'timestamp' VALUE TO_CHAR(v_approved_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z'),
        'event' VALUE 'Application Approved',
        'status' VALUE 'completed',
        'description' VALUE 'Application has been approved',
        'actor' VALUE 'SYSTEM'
      ).TO_CLOB()
    );
  ELSIF v_app_status = 'REJECTED' AND v_rejected_at IS NOT NULL THEN
    v_timeline := v_timeline || JSON_ARRAY_T(
      JSON_OBJECT(
        'timestamp' VALUE TO_CHAR(v_rejected_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z'),
        'event' VALUE 'Application Rejected',
        'status' VALUE 'error',
        'description' VALUE 'Application has been rejected',
        'actor' VALUE 'SYSTEM'
      ).TO_CLOB()
    );
  END IF;

  -- Return timeline
  p_json_out := JSON_OBJECT(
    'application_id' VALUE v_application_id,
    'reference_number' VALUE v_reference_number,
    'applicant_name' VALUE v_applicant_name,
    'mobile_number' VALUE v_mobile_number,
    'current_status' VALUE v_app_status,
    'timeline' VALUE TREAT(v_timeline AS CLOB)
  ).TO_CLOB();

  p_status := 'S';
  p_message := 'Timeline retrieved successfully';

EXCEPTION
  WHEN OTHERS THEN
    write_error_log('562', SQLERRM, v_proc);
    p_status := '562';
    p_message := '562 : Error retrieving timeline. See TCC_ERROR_LOG.';
    p_json_out := NULL;
END get_application_timeline;
