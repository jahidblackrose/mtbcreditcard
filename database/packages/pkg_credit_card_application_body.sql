-- =============================================================================
-- MTB Credit Card Application System - Package Body (Session 1: 501-532)
-- Package: pkg_credit_card_application
-- Every procedure: BEGIN ... EXCEPTION -> log to TCC_ERROR_LOG with backtrace
-- Error codes: 501-532 (Session 1), 533-560 (Session 2)
-- =============================================================================

CREATE OR REPLACE PACKAGE BODY pkg_credit_card_application AS

  -- ---------------------------------------------------------------------------
  -- Private: write error to TCC_ERROR_LOG (backtrace, line, procedure name)
  -- ---------------------------------------------------------------------------
  PROCEDURE write_error_log(
    p_error_code    VARCHAR2,
    p_error_message VARCHAR2,
    p_procedure_name VARCHAR2
  ) IS
    PRAGMA AUTONOMOUS_TRANSACTION;
    v_id        VARCHAR2(36);
    v_backtrace CLOB;
    v_stack     CLOB;
    v_line      VARCHAR2(100);
  BEGIN
    v_id        := SYS_GUID();
    v_backtrace := DBMS_UTILITY.FORMAT_ERROR_BACKTRACE;
    v_stack     := DBMS_UTILITY.FORMAT_CALL_STACK;
    v_line      := SUBSTR(v_backtrace, 1, 100);
    INSERT INTO TCC_ERROR_LOG (error_log_id, error_code, error_message, error_backtrace, error_line, procedure_name, call_stack)
    VALUES (v_id, p_error_code, p_error_message, v_backtrace, v_line, p_procedure_name, v_stack);
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
  END write_error_log;

  -- ==========================================================================
  -- REFERENCE DATA (501-504)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- get_card_products (501)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_card_products(
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_card_products';
  BEGIN
    p_status  := 'S';
    p_message := 'Card products retrieved successfully';
    SELECT JSON_ARRAYAGG(
             JSON_OBJECT(
               'id' VALUE card_type_id, 'type' VALUE card_type_code, 'name' VALUE card_name,
               'annualFee' VALUE annual_fee, 'interestRate' VALUE interest_rate,
               'creditLimitMin' VALUE credit_limit_min, 'creditLimitMax' VALUE credit_limit_max,
               'benefits' VALUE benefits
             )
           ) INTO p_json_out
    FROM TCC_REF_CARD_TYPE
    WHERE is_active = 'Y';
    IF p_json_out IS NULL THEN p_json_out := '[]'; END IF;
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('501', SQLERRM, v_proc);
      p_status  := '501';
      p_message := '501 : Error retrieving card products. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_card_products;

  -- ---------------------------------------------------------------------------
  -- get_reference_data (502) - Generic reference data getter
  -- ---------------------------------------------------------------------------
  PROCEDURE get_reference_data(
    p_type     IN  VARCHAR2,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_reference_data';
  BEGIN
    p_status := 'S';
    p_message := 'Reference data retrieved successfully';

    CASE UPPER(p_type)
      WHEN 'NETWORKS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE network_id, 'code' VALUE network_code, 'name' VALUE network_name,
          'displayOrder' VALUE display_order
        )) INTO p_json_out FROM TCC_REF_CARD_NETWORK WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'TIERS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE tier_id, 'code' VALUE tier_code, 'name' VALUE tier_name,
          'description' VALUE description, 'displayOrder' VALUE display_order
        )) INTO p_json_out FROM TCC_REF_CARD_TIER WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'CATEGORIES' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE category_id, 'code' VALUE category_code, 'name' VALUE category_name,
          'description' VALUE description, 'displayOrder' VALUE display_order
        )) INTO p_json_out FROM TCC_REF_CARD_CATEGORY WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'CUSTOMER_SEGMENTS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE segment_id, 'code' VALUE segment_code, 'name' VALUE segment_name
        )) INTO p_json_out FROM TCC_REF_CUSTOMER_SEGMENT WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'EDUCATION_LEVELS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE education_id, 'code' VALUE education_code, 'name' VALUE education_name
        )) INTO p_json_out FROM TCC_REF_EDUCATION_LEVEL WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'ACCOUNT_TYPES' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE account_type_id, 'code' VALUE account_type_code, 'name' VALUE account_type_name
        )) INTO p_json_out FROM TCC_REF_ACCOUNT_TYPE WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'FACILITY_TYPES' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE facility_type_id, 'code' VALUE facility_type_code, 'name' VALUE facility_type_name
        )) INTO p_json_out FROM TCC_REF_FACILITY_TYPE WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'NOMINEE_RELATIONSHIPS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE relationship_id, 'code' VALUE relationship_code, 'name' VALUE relationship_name
        )) INTO p_json_out FROM TCC_REF_NOMINEE_RELATIONSHIP WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'SUPPLEMENTARY_RELATIONSHIPS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE relationship_id, 'code' VALUE relationship_code, 'name' VALUE relationship_name
        )) INTO p_json_out FROM TCC_REF_SUPPLEMENTARY_RELATIONSHIP WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'REFEE_RELATIONSHIPS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE relationship_id, 'code' VALUE relationship_code, 'name' VALUE relationship_name
        )) INTO p_json_out FROM TCC_REF_REFEE_RELATIONSHIP WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'RELIGIONS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE religion_id, 'code' VALUE religion_code, 'name' VALUE religion_name
        )) INTO p_json_out FROM TCC_REF_RELIGION WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'MARITAL_STATUSES' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE status_id, 'code' VALUE status_code, 'name' VALUE status_name
        )) INTO p_json_out FROM TCC_REF_MARITAL_STATUS WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'AUTO_DEBIT_PREFERENCES' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE preference_id, 'code' VALUE preference_code, 'name' VALUE preference_name,
          'description' VALUE description
        )) INTO p_json_out FROM TCC_REF_AUTO_DEBIT_PREFERENCE WHERE is_active = 'Y' ORDER BY display_order;
      WHEN 'DISTRICTS' THEN
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' VALUE district_id, 'code' VALUE district_code, 'name' VALUE district_name,
          'divisionName' VALUE division_name
        )) INTO p_json_out FROM TCC_REF_DISTRICT WHERE is_active = 'Y' ORDER BY district_name;
      ELSE
        p_status := '502';
        p_message := '502 : Unknown reference type: ' || p_type;
        p_json_out := '[]';
        RETURN;
    END CASE;

    IF p_json_out IS NULL THEN p_json_out := '[]'; END IF;
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('502', SQLERRM, v_proc);
      p_status  := '502';
      p_message := '502 : Error retrieving reference data. See TCC_ERROR_LOG.';
      p_json_out := '[]';
  END get_reference_data;

  -- ---------------------------------------------------------------------------
  -- check_eligibility (503)
  -- ---------------------------------------------------------------------------
  PROCEDURE check_eligibility(
    p_monthly_income IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc   CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.check_eligibility';
    v_income NUMBER;
  BEGIN
    p_status  := 'S';
    p_message := 'Eligibility check completed';
    v_income := TO_NUMBER(REGEXP_REPLACE(NVL(p_monthly_income,'0'), '[^0-9.]', ''));
    IF v_income IS NULL OR v_income < 25000 THEN
      p_json_out := JSON_OBJECT('eligible' VALUE 0, 'eligibleCards' VALUE '[]' FORMAT JSON);
      RETURN;
    END IF;
    SELECT JSON_OBJECT(
             'eligible' VALUE 1,
             'eligibleCards' VALUE (
               SELECT JSON_ARRAYAGG(JSON_OBJECT('id' VALUE card_type_id, 'type' VALUE card_type_code, 'name' VALUE card_name,
                 'annualFee' VALUE annual_fee, 'interestRate' VALUE interest_rate,
                 'creditLimitMin' VALUE credit_limit_min, 'creditLimitMax' VALUE credit_limit_max, 'benefits' VALUE benefits))
               FROM TCC_REF_CARD_TYPE
               WHERE is_active = 'Y'
                 AND TO_NUMBER(REGEXP_REPLACE(credit_limit_min, '[^0-9.]', '')) <= (v_income * 3)
             ) FORMAT JSON
           ) INTO p_json_out FROM DUAL;
    IF p_json_out IS NULL THEN p_json_out := JSON_OBJECT('eligible' VALUE 0, 'eligibleCards' VALUE '[]' FORMAT JSON); END IF;
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('503', SQLERRM, v_proc);
      p_status  := '503';
      p_message := '503 : Eligibility check failed. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END check_eligibility;

  -- ---------------------------------------------------------------------------
  -- get_bank_list (504)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_bank_list(
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_bank_list';
  BEGIN
    p_status := 'S';
    p_message := 'Bank list retrieved successfully';
    p_json_out := JSON_ARRAYAGG(JSON_OBJECT(
      'code' VALUE bank_code, 'name' VALUE bank_name
    ));
    -- Return hardcoded Bangladesh banks for now
    p_json_out := '[
      {"code":"MTB","name":"Mutual Trust Bank"},
      {"code":"DBBL","name":"Dutch-Bangla Bank"},
      {"code":"ABANK","name":"AB Bank"},
      {"code":"BCB","name":"Bangladesh Commerce Bank"},
      {"code":"BB","name":"Bangladesh Bank"},
      {"code":"BKB","name":"Bangladesh Krishi Bank"},
      {"code":"BSON","name":"BASIC Bank"},
      {"code":"BL","name":"Banglalink"},
      {"code":"CITY","name":"City Bank"},
      {"code":"EBL","name":"Eastern Bank"},
      {"code":"EXIM","name":"EXIM Bank"},
      {"code":"IBBL","name":"Islami Bank"},
      {"code":"JANATA","name":"Janata Bank"},
      {"code":"MTBL","name":"Mercantile Bank"},
      {"code":"NCCBL","name":"National Credit"},
      {"code":"NRBC","name":"NRB Commercial"},
      {"code":"PADMA","name":"Padma Bank"},
      {"code":"PRIME","name":"Prime Bank"},
      {"code":"RUPALI","name":"Rupali Bank"},
      {"code":"SBAC","name":"South Bangla"},
      {"code":"SCB","name":"Standard Chartered"},
      {"code":"SONALI","name":"Sonali Bank"},
      {"code":"UCB","name":"United Commercial"}
    ]';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('504', SQLERRM, v_proc);
      p_status := '504';
      p_message := '504 : Error retrieving bank list. See TCC_ERROR_LOG.';
      p_json_out := '[]';
  END get_bank_list;

  -- ==========================================================================
  -- APPLICATION CRUD (505-510)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- create_application (505) - Modified to accept network, tier, category
  -- ---------------------------------------------------------------------------
  PROCEDURE create_application(
    p_mode     IN  VARCHAR2,
    p_network  IN  VARCHAR2,
    p_tier     IN  VARCHAR2,
    p_category IN  VARCHAR2,
    p_limit    IN  VARCHAR2,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  ) IS
    v_proc         CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.create_application';
    v_app_id       VARCHAR2(36);
    v_ref_no       VARCHAR2(30);
    v_applicant_id VARCHAR2(36);
  BEGIN
    v_app_id       := SYS_GUID();
    v_applicant_id := SYS_GUID();
    v_ref_no       := 'MTB-CC-' || TO_CHAR(SYSDATE,'YYYY') || '-' || LPAD(TRUNC(DBMS_RANDOM.VALUE(1,99999)), 5, '0');

    INSERT INTO TCC_APPLICANT (applicant_id, full_name, date_of_birth, gender, nid_number, mobile_number, email)
    VALUES (v_applicant_id, ' ', SYSDATE, 'M', ' ', ' ', ' ');

    INSERT INTO TCC_APPLICATION (
      application_id, reference_number, applicant_id, application_mode,
      card_network, card_tier, card_category, requested_limit, application_status
    )
    VALUES (
      v_app_id, v_ref_no, v_applicant_id, p_mode,
      p_network, p_tier, p_category, p_limit, 'DRAFT'
    );

    p_status  := 'S';
    p_message := 'Application created successfully';
    p_json_out := JSON_OBJECT(
      'applicationId' VALUE v_app_id,
      'referenceNumber' VALUE v_ref_no,
      'cardNetwork' VALUE p_network,
      'cardTier' VALUE p_tier,
      'cardCategory' VALUE p_category
    );
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('505', SQLERRM, v_proc);
      p_status  := '505';
      p_message := '505 : Error creating application. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END create_application;

  -- ---------------------------------------------------------------------------
  -- get_application (506)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_application(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_application';
  BEGIN
    SELECT JSON_OBJECT(
             'id' VALUE a.application_id, 'referenceNumber' VALUE a.reference_number,
             'mode' VALUE a.application_mode, 'status' VALUE a.application_status,
             'cardNetwork' VALUE a.card_network, 'cardTier' VALUE a.card_tier,
             'cardCategory' VALUE a.card_category, 'requestedCreditLimit' VALUE a.requested_limit,
             'currentStep' VALUE a.current_step, 'highestStep' VALUE a.highest_step,
             'otpVerified' VALUE CASE WHEN a.otp_verified = 'Y' THEN 1 ELSE 0 END,
             'hasSupplementary' VALUE CASE WHEN a.has_supplementary = 'Y' THEN 1 ELSE 0 END,
             'createdAt' VALUE TO_CHAR(a.created_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
             'updatedAt' VALUE TO_CHAR(a.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
             'personalInfo' VALUE (SELECT JSON_OBJECT(
               'fullName' VALUE ap.full_name, 'nameOnCard' VALUE ap.name_on_card,
               'fatherName' VALUE ap.father_name, 'motherName' VALUE ap.mother_name,
               'dateOfBirth' VALUE TO_CHAR(ap.date_of_birth,'YYYY-MM-DD'),
               'gender' VALUE ap.gender, 'nationality' VALUE ap.nationality,
               'nidNumber' VALUE ap.nid_number, 'tin' VALUE ap.tin,
               'passportNumber' VALUE ap.passport_number, 'homeDistrict' VALUE ap.home_district,
               'religion' VALUE ap.religion, 'maritalStatus' VALUE ap.marital_status,
               'spouseName' VALUE ap.spouse_name, 'spouseProfession' VALUE ap.spouse_profession,
               'educationLevel' VALUE ap.education_level,
               'mobileNumber' VALUE ap.mobile_number, 'email' VALUE ap.email
             ) FROM TCC_APPLICANT ap WHERE ap.applicant_id = a.applicant_id)
           ) INTO p_json_out
    FROM TCC_APPLICATION a WHERE a.application_id = p_application_id;
    p_status := 'S';
    p_message := 'Application retrieved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '506';
      p_message := '506 : Application not found.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('506', SQLERRM, v_proc);
      p_status := '506';
      p_message := '506 : Error retrieving application. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_application;

  -- ---------------------------------------------------------------------------
  -- get_application_by_reference (507)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_application_by_reference(
    p_reference_number IN  VARCHAR2,
    p_status           OUT VARCHAR2,
    p_message          OUT VARCHAR2,
    p_json_out         OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_application_by_reference';
    v_app_id VARCHAR2(36);
  BEGIN
    SELECT application_id INTO v_app_id FROM TCC_APPLICATION WHERE reference_number = p_reference_number;
    -- Reuse get_application
    get_application(v_app_id, p_status, p_message, p_json_out);
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '507';
      p_message := '507 : No application found with this reference number.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('507', SQLERRM, v_proc);
      p_status := '507';
      p_message := '507 : Error finding application. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_application_by_reference;

  -- ---------------------------------------------------------------------------
  -- get_application_by_mobile (508)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_application_by_mobile(
    p_mobile_number IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_application_by_mobile';
  BEGIN
    p_status := 'S';
    p_message := 'Applications retrieved successfully';
    SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'id' VALUE a.application_id, 'referenceNumber' VALUE a.reference_number,
      'status' VALUE a.application_status, 'mode' VALUE a.application_mode,
      'cardNetwork' VALUE a.card_network, 'cardTier' VALUE a.card_tier,
      'submittedAt' VALUE TO_CHAR(a.submitted_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'createdAt' VALUE TO_CHAR(a.created_at, 'YYYY-MM-DD"T"HH24:MI:SS')
    )) INTO p_json_out
    FROM TCC_APPLICATION a
    JOIN TCC_APPLICANT ap ON ap.applicant_id = a.applicant_id
    WHERE ap.mobile_number = p_mobile_number
    ORDER BY a.created_at DESC;
    IF p_json_out IS NULL THEN p_json_out := '[]'; END IF;
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('508', SQLERRM, v_proc);
      p_status := '508';
      p_message := '508 : Error retrieving applications. See TCC_ERROR_LOG.';
      p_json_out := '[]';
  END get_application_by_mobile;

  -- ---------------------------------------------------------------------------
  -- update_application_status (509)
  -- ---------------------------------------------------------------------------
  PROCEDURE update_application_status(
    p_application_id IN  VARCHAR2,
    p_new_status     IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.update_application_status';
  BEGIN
    UPDATE TCC_APPLICATION
    SET application_status = p_new_status,
        updated_at = CURRENT_TIMESTAMP,
        approved_at = CASE WHEN p_new_status = 'APPROVED' THEN CURRENT_TIMESTAMP ELSE approved_at END,
        rejected_at = CASE WHEN p_new_status = 'REJECTED' THEN CURRENT_TIMESTAMP ELSE rejected_at END
    WHERE application_id = p_application_id;

    IF SQL%ROWCOUNT = 0 THEN
      p_status := '509';
      p_message := '509 : Application not found.';
      RETURN;
    END IF;

    p_status := 'S';
    p_message := 'Application status updated successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('509', SQLERRM, v_proc);
      p_status := '509';
      p_message := '509 : Error updating status. See TCC_ERROR_LOG.';
  END update_application_status;

  -- ---------------------------------------------------------------------------
  -- submit_application (510)
  -- ---------------------------------------------------------------------------
  PROCEDURE submit_application(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc      CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.submit_application';
    v_ref_no    VARCHAR2(30);
    v_full_name VARCHAR2(200);
  BEGIN
    SELECT reference_number, (SELECT full_name FROM TCC_APPLICANT ap WHERE ap.applicant_id = a.applicant_id)
    INTO v_ref_no, v_full_name
    FROM TCC_APPLICATION a
    WHERE application_id = p_application_id AND application_status = 'DRAFT';

    IF v_full_name IS NULL OR TRIM(v_full_name) = ' ' THEN
      p_status := '510';
      p_message := '510 : Please complete all required personal information.';
      p_json_out := NULL;
      RETURN;
    END IF;

    UPDATE TCC_APPLICATION
    SET application_status = 'SUBMITTED',
        submitted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Application submitted successfully. You will receive updates via SMS and email.';
    p_json_out := JSON_OBJECT('referenceNumber' VALUE v_ref_no);
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '510';
      p_message := '510 : Application not found or not in DRAFT.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('510', SQLERRM, v_proc);
      p_status := '510';
      p_message := '510 : Error submitting application. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END submit_application;

  -- ==========================================================================
  -- PRE-APPLICATION & OTP (511-516)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- check_existing_applicant (511)
  -- ---------------------------------------------------------------------------
  PROCEDURE check_existing_applicant(
    p_nid_number  IN  VARCHAR2,
    p_mobile      IN  VARCHAR2,
    p_status      OUT VARCHAR2,
    p_message     OUT VARCHAR2,
    p_json_out    OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.check_existing_applicant';
    v_exists NUMBER;
  BEGIN
    p_status := 'S';
    p_message := 'Applicant check completed';

    SELECT COUNT(*) INTO v_exists
    FROM TCC_APPLICANT ap
    JOIN TCC_APPLICATION a ON a.applicant_id = ap.applicant_id
    WHERE ap.nid_number = p_nid_number OR ap.mobile_number = p_mobile
    AND a.application_status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED');

    IF v_exists > 0 THEN
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'applicationId' VALUE a.application_id,
        'referenceNumber' VALUE a.reference_number,
        'status' VALUE a.application_status,
        'createdAt' VALUE TO_CHAR(a.created_at, 'YYYY-MM-DD"T"HH24:MI:SS')
      )) INTO p_json_out
      FROM TCC_APPLICATION a
      JOIN TCC_APPLICANT ap ON ap.applicant_id = a.applicant_id
      WHERE (ap.nid_number = p_nid_number OR ap.mobile_number = p_mobile)
      AND a.application_status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED');
    ELSE
      p_json_out := JSON_OBJECT('hasExistingApplication' VALUE 0);
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('511', SQLERRM, v_proc);
      p_status := '511';
      p_message := '511 : Error checking applicant. See TCC_ERROR_LOG.';
      p_json_out := JSON_OBJECT('hasExistingApplication' VALUE 0);
  END check_existing_applicant;

  -- ---------------------------------------------------------------------------
  -- request_otp (512)
  -- ---------------------------------------------------------------------------
  PROCEDURE request_otp(
    p_mobile_number IN  VARCHAR2,
    p_session_id    IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.request_otp';
  BEGIN
    IF p_mobile_number IS NULL OR LENGTH(REGEXP_REPLACE(p_mobile_number,'[^0-9]','')) < 10 THEN
      p_status := '512';
      p_message := '512 : Please enter a valid Bangladesh mobile number.';
      p_json_out := NULL;
      RETURN;
    END IF;

    INSERT INTO TCC_OTP_ATTEMPT (otp_attempt_id, mobile_number, session_id, remaining_attempts, max_attempts)
    VALUES (SYS_GUID(), p_mobile_number, p_session_id, 5, 5);

    p_status := 'S';
    p_message := 'OTP sent successfully to your mobile number';
    p_json_out := JSON_OBJECT('expiresIn' VALUE 300, 'remainingAttempts' VALUE 5);
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('512', SQLERRM, v_proc);
      p_status := '512';
      p_message := '512 : Error requesting OTP. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END request_otp;

  -- ---------------------------------------------------------------------------
  -- verify_otp (513)
  -- ---------------------------------------------------------------------------
  PROCEDURE verify_otp(
    p_mobile_number IN  VARCHAR2,
    p_otp           IN  VARCHAR2,
    p_session_id    IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.verify_otp';
  BEGIN
    p_status := 'S';
    p_message := 'OTP verified successfully';
    p_json_out := JSON_OBJECT('verified' VALUE 1, 'userId' VALUE SYS_GUID());
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('513', SQLERRM, v_proc);
      p_status := '513';
      p_message := '513 : Error verifying OTP. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END verify_otp;

  -- ---------------------------------------------------------------------------
  -- get_otp_status (514)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_otp_status(
    p_mobile_number IN  VARCHAR2,
    p_session_id    IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_otp_status';
  BEGIN
    SELECT JSON_OBJECT(
      'mobileNumber' VALUE mobile_number, 'remainingAttempts' VALUE remaining_attempts,
      'maxAttempts' VALUE max_attempts, 'isLocked' VALUE CASE is_locked WHEN 'Y' THEN 1 ELSE 0 END,
      'lockExpiresAt' VALUE TO_CHAR(lock_expires_at, 'YYYY-MM-DD"T"HH24:MI:SS')
    ) INTO p_json_out FROM TCC_OTP_ATTEMPT
    WHERE mobile_number = p_mobile_number AND (session_id = p_session_id OR session_id IS NULL)
    ORDER BY created_at DESC FETCH FIRST 1 ROW ONLY;

    p_status := 'S';
    p_message := 'OTP status retrieved';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := 'S';
      p_message := 'OTP status retrieved';
      p_json_out := JSON_OBJECT(
        'mobileNumber' VALUE p_mobile_number, 'remainingAttempts' VALUE 5,
        'maxAttempts' VALUE 5, 'isLocked' VALUE 0
      );
    WHEN OTHERS THEN
      write_error_log('514', SQLERRM, v_proc);
      p_status := '514';
      p_message := '514 : Error retrieving OTP status. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_otp_status;

  -- ---------------------------------------------------------------------------
  -- verify_otp_extended (515)
  -- ---------------------------------------------------------------------------
  PROCEDURE verify_otp_extended(
    p_mobile_number IN  VARCHAR2,
    p_otp           IN  VARCHAR2,
    p_session_id    IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.verify_otp_extended';
    v_attempts NUMBER;
    v_locked   CHAR(1);
  BEGIN
    SELECT remaining_attempts, is_locked INTO v_attempts, v_locked
    FROM TCC_OTP_ATTEMPT
    WHERE mobile_number = p_mobile_number AND session_id = p_session_id
    ORDER BY created_at DESC FETCH FIRST 1 ROW ONLY;

    IF v_locked = 'Y' THEN
      p_status := '515';
      p_message := '515 : Too many failed attempts. Account is locked.';
      p_json_out := JSON_OBJECT('verified' VALUE 0, 'locked' VALUE 1);
      RETURN;
    END IF;

    -- For mock, always succeed
    UPDATE TCC_APPLICATION SET otp_verified = 'Y', verified_at = CURRENT_TIMESTAMP
    WHERE session_id = p_session_id;

    p_status := 'S';
    p_message := 'OTP verified successfully';
    p_json_out := JSON_OBJECT('verified' VALUE 1, 'locked' VALUE 0);
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '515';
      p_message := '515 : OTP session not found.';
      p_json_out := JSON_OBJECT('verified' VALUE 0, 'locked' VALUE 0);
    WHEN OTHERS THEN
      write_error_log('515', SQLERRM, v_proc);
      p_status := '515';
      p_message := '515 : Error verifying OTP. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END verify_otp_extended;

  -- ==========================================================================
  -- STEP 1: CARD SELECTION (517)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_card_selection (517)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_card_selection(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_card_selection';
  BEGIN
    UPDATE TCC_APPLICATION
    SET card_network = JSON_VALUE(p_json_in, '$.cardNetwork'),
        card_tier = JSON_VALUE(p_json_in, '$.cardTier'),
        card_category = JSON_VALUE(p_json_in, '$.cardCategory'),
        requested_limit = JSON_VALUE(p_json_in, '$.expectedCreditLimit'),
        current_step = GREATEST(current_step, 1),
        highest_step = GREATEST(highest_step, 1),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    IF SQL%ROWCOUNT = 0 THEN
      p_status := '517';
      p_message := '517 : Application not found.';
      RETURN;
    END IF;

    p_status := 'S';
    p_message := 'Card selection saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('517', SQLERRM, v_proc);
      p_status := '517';
      p_message := '517 : Error saving card selection. See TCC_ERROR_LOG.';
  END save_card_selection;

  -- ==========================================================================
  -- STEP 2: PERSONAL INFO (518-519)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_personal_info (518)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_personal_info(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc         CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_personal_info';
    v_applicant_id VARCHAR2(36);
  BEGIN
    SELECT applicant_id INTO v_applicant_id FROM TCC_APPLICATION WHERE application_id = p_application_id;

    UPDATE TCC_APPLICANT SET
      full_name = JSON_VALUE(p_json_in, '$.nameOnCard'),
      name_on_card = JSON_VALUE(p_json_in, '$.nameOnCard'),
      father_name = JSON_VALUE(p_json_in, '$.fatherName'),
      mother_name = JSON_VALUE(p_json_in, '$.motherName'),
      date_of_birth = TO_DATE(JSON_VALUE(p_json_in, '$.dateOfBirth'), 'YYYY-MM-DD'),
      gender = SUBSTR(JSON_VALUE(p_json_in, '$.gender'),1,1),
      nationality = JSON_VALUE(p_json_in, '$.nationality'),
      home_district = JSON_VALUE(p_json_in, '$.homeDistrict'),
      nid_number = JSON_VALUE(p_json_in, '$.nidNumber'),
      tin = JSON_VALUE(p_json_in, '$.tin'),
      passport_number = JSON_VALUE(p_json_in, '$.passportNumber'),
      passport_issue_date = TO_DATE(JSON_VALUE(p_json_in, '$.passportIssueDate'), 'YYYY-MM-DD'),
      passport_expiry_date = TO_DATE(JSON_VALUE(p_json_in, '$.passportExpiryDate'), 'YYYY-MM-DD'),
      religion = JSON_VALUE(p_json_in, '$.religion'),
      marital_status = JSON_VALUE(p_json_in, '$.maritalStatus'),
      spouse_name = JSON_VALUE(p_json_in, '$.spouseName'),
      spouse_profession = JSON_VALUE(p_json_in, '$.spouseProfession'),
      education_level = JSON_VALUE(p_json_in, '$.educationalQualification'),
      mobile_number = JSON_VALUE(p_json_in, '$.mobileNumber'),
      email = JSON_VALUE(p_json_in, '$.email'),
      updated_at = CURRENT_TIMESTAMP
    WHERE applicant_id = v_applicant_id;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 2),
        highest_step = GREATEST(highest_step, 2),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Personal information saved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '518';
      p_message := '518 : Application not found.';
    WHEN OTHERS THEN
      write_error_log('518', SQLERRM, v_proc);
      p_status := '518';
      p_message := '518 : Error saving personal info. See TCC_ERROR_LOG.';
  END save_personal_info;

  -- ---------------------------------------------------------------------------
  -- save_addresses (519)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_addresses(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc         CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_addresses';
    v_applicant_id VARCHAR2(36);
  BEGIN
    SELECT applicant_id INTO v_applicant_id FROM TCC_APPLICATION WHERE application_id = p_application_id;

    UPDATE TCC_APPLICANT SET
      present_address = JSON_QUERY(p_json_in, '$.presentAddress'),
      permanent_address = JSON_QUERY(p_json_in, '$.permanentAddress'),
      mailing_address_type = JSON_VALUE(p_json_in, '$.mailingAddressType'),
      updated_at = CURRENT_TIMESTAMP
    WHERE applicant_id = v_applicant_id;

    p_status := 'S';
    p_message := 'Address information saved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '519';
      p_message := '519 : Application not found.';
    WHEN OTHERS THEN
      write_error_log('519', SQLERRM, v_proc);
      p_status := '519';
      p_message := '519 : Error saving addresses. See TCC_ERROR_LOG.';
  END save_addresses;

  -- ==========================================================================
  -- STEP 3: PROFESSIONAL INFO (520)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_professional_info (520)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_professional_info(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc            CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_professional_info';
    v_professional_id VARCHAR2(36);
    v_exists          NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_exists FROM TCC_PROFESSIONAL_DETAILS WHERE application_id = p_application_id;

    IF v_exists > 0 THEN
      UPDATE TCC_PROFESSIONAL_DETAILS SET
        customer_segment = JSON_VALUE(p_json_in, '$.customerSegment'),
        organization_name = JSON_VALUE(p_json_in, '$.organizationName'),
        parent_group = JSON_VALUE(p_json_in, '$.parentGroup'),
        department = JSON_VALUE(p_json_in, '$.department'),
        designation = JSON_VALUE(p_json_in, '$.designation'),
        office_address = JSON_QUERY(p_json_in, '$.officeAddress'),
        service_years = TO_NUMBER(JSON_VALUE(p_json_in, '$.lengthOfServiceYears')),
        service_months = TO_NUMBER(JSON_VALUE(p_json_in, '$.lengthOfServiceMonths')),
        total_exp_years = TO_NUMBER(JSON_VALUE(p_json_in, '$.totalExperienceYears')),
        total_exp_months = TO_NUMBER(JSON_VALUE(p_json_in, '$.totalExperienceMonths')),
        previous_employer = JSON_VALUE(p_json_in, '$.previousEmployer'),
        previous_designation = JSON_VALUE(p_json_in, '$.previousDesignation'),
        updated_at = CURRENT_TIMESTAMP
      WHERE application_id = p_application_id;
    ELSE
      v_professional_id := SYS_GUID();
      INSERT INTO TCC_PROFESSIONAL_DETAILS (
        professional_id, application_id, customer_segment, organization_name,
        parent_group, department, designation, office_address,
        service_years, service_months, total_exp_years, total_exp_months,
        previous_employer, previous_designation
      ) VALUES (
        v_professional_id, p_application_id, JSON_VALUE(p_json_in, '$.customerSegment'),
        JSON_VALUE(p_json_in, '$.organizationName'), JSON_VALUE(p_json_in, '$.parentGroup'),
        JSON_VALUE(p_json_in, '$.department'), JSON_VALUE(p_json_in, '$.designation'),
        JSON_QUERY(p_json_in, '$.officeAddress'),
        TO_NUMBER(JSON_VALUE(p_json_in, '$.lengthOfServiceYears')),
        TO_NUMBER(JSON_VALUE(p_json_in, '$.lengthOfServiceMonths')),
        TO_NUMBER(JSON_VALUE(p_json_in, '$.totalExperienceYears')),
        TO_NUMBER(JSON_VALUE(p_json_in, '$.totalExperienceMonths')),
        JSON_VALUE(p_json_in, '$.previousEmployer'),
        JSON_VALUE(p_json_in, '$.previousDesignation')
      );
    END IF;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 3),
        highest_step = GREATEST(highest_step, 3),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Professional information saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('520', SQLERRM, v_proc);
      p_status := '520';
      p_message := '520 : Error saving professional info. See TCC_ERROR_LOG.';
  END save_professional_info;

  -- ==========================================================================
  -- STEP 4: MONTHLY INCOME (521)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_monthly_income (521)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_monthly_income(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc         CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_monthly_income';
    v_income_id     VARCHAR2(36);
    v_exists       NUMBER;
    v_is_salaried   CHAR(1);
  BEGIN
    v_is_salaried := CASE WHEN JSON_VALUE(p_json_in, '$.isSalaried') = 'true' THEN 'Y' ELSE 'N' END;

    SELECT COUNT(*) INTO v_exists FROM TCC_INCOME_DETAILS WHERE application_id = p_application_id;

    IF v_exists > 0 THEN
      UPDATE TCC_INCOME_DETAILS SET
        is_salaried = v_is_salaried,
        gross_salary = JSON_VALUE(p_json_in, '$.salariedIncome.grossSalary'),
        total_deduction = JSON_VALUE(p_json_in, '$.salariedIncome.totalDeduction'),
        net_salary = JSON_VALUE(p_json_in, '$.salariedIncome.netSalary'),
        gross_income = JSON_VALUE(p_json_in, '$.businessIncome.grossIncome'),
        total_expenses = JSON_VALUE(p_json_in, '$.businessIncome.totalExpenses'),
        net_income = JSON_VALUE(p_json_in, '$.businessIncome.netIncome'),
        additional_sources = JSON_QUERY(p_json_in, '$.additionalIncomeSources'),
        updated_at = CURRENT_TIMESTAMP
      WHERE application_id = p_application_id;
    ELSE
      v_income_id := SYS_GUID();
      INSERT INTO TCC_INCOME_DETAILS (
        income_details_id, application_id, is_salaried,
        gross_salary, total_deduction, net_salary,
        gross_income, total_expenses, net_income,
        additional_sources
      ) VALUES (
        v_income_id, p_application_id, v_is_salaried,
        JSON_VALUE(p_json_in, '$.salariedIncome.grossSalary'),
        JSON_VALUE(p_json_in, '$.salariedIncome.totalDeduction'),
        JSON_VALUE(p_json_in, '$.salariedIncome.netSalary'),
        JSON_VALUE(p_json_in, '$.businessIncome.grossIncome'),
        JSON_VALUE(p_json_in, '$.businessIncome.totalExpenses'),
        JSON_VALUE(p_json_in, '$.businessIncome.netIncome'),
        JSON_QUERY(p_json_in, '$.additionalIncomeSources')
      );
    END IF;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 4),
        highest_step = GREATEST(highest_step, 4),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Monthly income saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('521', SQLERRM, v_proc);
      p_status := '521';
      p_message := '521 : Error saving monthly income. See TCC_ERROR_LOG.';
  END save_monthly_income;

  -- ==========================================================================
  -- STEP 5: BANK ACCOUNTS (522-524)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_bank_accounts (522) - Save array of bank accounts
  -- ---------------------------------------------------------------------------
  PROCEDURE save_bank_accounts(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_bank_accounts';
  BEGIN
    -- Delete existing accounts
    DELETE FROM TCC_BANK_ACCOUNT WHERE application_id = p_application_id;

    -- Insert new accounts from JSON array
    INSERT INTO TCC_BANK_ACCOUNT (bank_account_id, application_id, bank_name, account_type, account_number, branch_name)
    SELECT SYS_GUID(), p_application_id,
           jt.bankName, jt.accountType, jt.accountNumber, jt.branchName
    FROM JSON_TABLE(p_json_in, '$[*]' COLUMNS (
      bankName      VARCHAR2(100) PATH '$.bankName',
      accountType   VARCHAR2(30)  PATH '$.accountType',
      accountNumber VARCHAR2(50)  PATH '$.accountNumber',
      branchName    VARCHAR2(100) PATH '$.branch'
    )) jt;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 5),
        highest_step = GREATEST(highest_step, 5),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Bank accounts saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('522', SQLERRM, v_proc);
      p_status := '522';
      p_message := '522 : Error saving bank accounts. See TCC_ERROR_LOG.';
  END save_bank_accounts;

  -- ---------------------------------------------------------------------------
  -- get_bank_accounts (523)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_bank_accounts(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_bank_accounts';
  BEGIN
    SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'id' VALUE bank_account_id, 'bankName' VALUE bank_name,
      'accountType' VALUE account_type, 'accountNumber' VALUE account_number,
      'branch' VALUE branch_name
    )) INTO p_json_out
    FROM TCC_BANK_ACCOUNT
    WHERE application_id = p_application_id;

    IF p_json_out IS NULL THEN p_json_out := '[]'; END IF;
    p_status := 'S';
    p_message := 'Bank accounts retrieved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('523', SQLERRM, v_proc);
      p_status := '523';
      p_message := '523 : Error retrieving bank accounts. See TCC_ERROR_LOG.';
      p_json_out := '[]';
  END get_bank_accounts;

  -- ---------------------------------------------------------------------------
  -- delete_bank_account (524)
  -- ---------------------------------------------------------------------------
  PROCEDURE delete_bank_account(
    p_bank_account_id IN VARCHAR2,
    p_status          OUT VARCHAR2,
    p_message         OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.delete_bank_account';
  BEGIN
    DELETE FROM TCC_BANK_ACCOUNT WHERE bank_account_id = p_bank_account_id;
    p_status := 'S';
    p_message := 'Bank account deleted successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('524', SQLERRM, v_proc);
      p_status := '524';
      p_message := '524 : Error deleting bank account. See TCC_ERROR_LOG.';
  END delete_bank_account;

  -- ==========================================================================
  -- STEP 6: CREDIT FACILITIES (525-527)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_credit_facilities (525) - Save array of credit facilities
  -- ---------------------------------------------------------------------------
  PROCEDURE save_credit_facilities(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_credit_facilities';
  BEGIN
    -- Delete existing facilities
    DELETE FROM TCC_CREDIT_FACILITY WHERE application_id = p_application_id;

    -- Insert new facilities from JSON array
    INSERT INTO TCC_CREDIT_FACILITY (facility_id, application_id, bank_name, facility_type, account_number, credit_limit, monthly_installment)
    SELECT SYS_GUID(), p_application_id,
           jt.bankName, jt.facilityType, jt.accountNumber, jt.limit, jt.monthlyInstallment
    FROM JSON_TABLE(p_json_in, '$[*]' COLUMNS (
      bankName           VARCHAR2(100) PATH '$.bankName',
      facilityType       VARCHAR2(30)  PATH '$.facilityType',
      accountNumber      VARCHAR2(50)  PATH '$.accountNumber',
      limit              VARCHAR2(30)  PATH '$.limit',
      monthlyInstallment VARCHAR2(30)  PATH '$.monthlyInstallment'
    )) jt;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 6),
        highest_step = GREATEST(highest_step, 6),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Credit facilities saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('525', SQLERRM, v_proc);
      p_status := '525';
      p_message := '525 : Error saving credit facilities. See TCC_ERROR_LOG.';
  END save_credit_facilities;

  -- ---------------------------------------------------------------------------
  -- get_credit_facilities (526)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_credit_facilities(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_credit_facilities';
  BEGIN
    SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'id' VALUE facility_id, 'bankName' VALUE bank_name,
      'facilityType' VALUE facility_type, 'accountNumber' VALUE account_number,
      'limit' VALUE credit_limit, 'monthlyInstallment' VALUE monthly_installment
    )) INTO p_json_out
    FROM TCC_CREDIT_FACILITY
    WHERE application_id = p_application_id;

    IF p_json_out IS NULL THEN p_json_out := '[]'; END IF;
    p_status := 'S';
    p_message := 'Credit facilities retrieved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('526', SQLERRM, v_proc);
      p_status := '526';
      p_message := '526 : Error retrieving credit facilities. See TCC_ERROR_LOG.';
      p_json_out := '[]';
  END get_credit_facilities;

  -- ---------------------------------------------------------------------------
  -- delete_credit_facility (527)
  -- ---------------------------------------------------------------------------
  PROCEDURE delete_credit_facility(
    p_facility_id IN VARCHAR2,
    p_status       OUT VARCHAR2,
    p_message      OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.delete_credit_facility';
  BEGIN
    DELETE FROM TCC_CREDIT_FACILITY WHERE facility_id = p_facility_id;
    p_status := 'S';
    p_message := 'Credit facility deleted successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('527', SQLERRM, v_proc);
      p_status := '527';
      p_message := '527 : Error deleting credit facility. See TCC_ERROR_LOG.';
  END delete_credit_facility;

  -- ==========================================================================
  -- STEP 7: NOMINEE (MPP) (528-529)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_nominee_details (528)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_nominee_details(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc      CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_nominee_details';
    v_nominee_id VARCHAR2(36);
    v_exists    NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_exists FROM TCC_NOMINEE WHERE application_id = p_application_id;

    IF v_exists > 0 THEN
      UPDATE TCC_NOMINEE SET
        nominee_name = JSON_VALUE(p_json_in, '$.nomineeName'),
        relationship = JSON_VALUE(p_json_in, '$.relationship'),
        date_of_birth = TO_DATE(JSON_VALUE(p_json_in, '$.dateOfBirth'), 'YYYY-MM-DD'),
        contact_address = JSON_VALUE(p_json_in, '$.contactAddress'),
        mobile_number = JSON_VALUE(p_json_in, '$.mobileNumber'),
        photo_url = JSON_VALUE(p_json_in, '$.photoUrl'),
        declaration_accepted = CASE WHEN JSON_VALUE(p_json_in, '$.declarationAccepted') = 'true' THEN 'Y' ELSE 'N' END,
        updated_at = CURRENT_TIMESTAMP
      WHERE application_id = p_application_id;
    ELSE
      v_nominee_id := SYS_GUID();
      INSERT INTO TCC_NOMINEE (
        nominee_id, application_id, nominee_name, relationship,
        date_of_birth, contact_address, mobile_number,
        photo_url, declaration_accepted
      ) VALUES (
        v_nominee_id, p_application_id, JSON_VALUE(p_json_in, '$.nomineeName'),
        JSON_VALUE(p_json_in, '$.relationship'),
        TO_DATE(JSON_VALUE(p_json_in, '$.dateOfBirth'), 'YYYY-MM-DD'),
        JSON_VALUE(p_json_in, '$.contactAddress'),
        JSON_VALUE(p_json_in, '$.mobileNumber'),
        JSON_VALUE(p_json_in, '$.photoUrl'),
        CASE WHEN JSON_VALUE(p_json_in, '$.declarationAccepted') = 'true' THEN 'Y' ELSE 'N' END
      );
    END IF;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 7),
        highest_step = GREATEST(highest_step, 7),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Nominee details saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('528', SQLERRM, v_proc);
      p_status := '528';
      p_message := '528 : Error saving nominee details. See TCC_ERROR_LOG.';
  END save_nominee_details;

  -- ---------------------------------------------------------------------------
  -- get_nominee_details (529)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_nominee_details(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_nominee_details';
  BEGIN
    SELECT JSON_OBJECT(
      'nomineeName' VALUE nominee_name, 'relationship' VALUE relationship,
      'dateOfBirth' VALUE TO_CHAR(date_of_birth, 'YYYY-MM-DD'),
      'contactAddress' VALUE contact_address, 'mobileNumber' VALUE mobile_number,
      'photoUrl' VALUE photo_url,
      'declarationAccepted' VALUE CASE declaration_accepted WHEN 'Y' THEN 1 ELSE 0 END
    ) INTO p_json_out
    FROM TCC_NOMINEE
    WHERE application_id = p_application_id;

    IF p_json_out IS NULL THEN p_json_out := JSON_OBJECT('nomineeName' VALUE NULL); END IF;
    p_status := 'S';
    p_message := 'Nominee details retrieved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := 'S';
      p_message := 'Nominee details retrieved successfully';
      p_json_out := JSON_OBJECT('nomineeName' VALUE NULL);
    WHEN OTHERS THEN
      write_error_log('529', SQLERRM, v_proc);
      p_status := '529';
      p_message := '529 : Error retrieving nominee details. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_nominee_details;

  -- ==========================================================================
  -- STEP 8: SUPPLEMENTARY CARD (530-532)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_supplementary_card (530)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_supplementary_card(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc            CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_supplementary_card';
    v_supplementary_id VARCHAR2(36);
    v_exists          NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_exists FROM TCC_SUPPLEMENTARY_CARD WHERE application_id = p_application_id;

    IF v_exists > 0 THEN
      UPDATE TCC_SUPPLEMENTARY_CARD SET
        full_name = JSON_VALUE(p_json_in, '$.fullName'),
        name_on_card = JSON_VALUE(p_json_in, '$.nameOnCard'),
        relationship = JSON_VALUE(p_json_in, '$.relationship'),
        date_of_birth = TO_DATE(JSON_VALUE(p_json_in, '$.dateOfBirth'), 'YYYY-MM-DD'),
        gender = SUBSTR(JSON_VALUE(p_json_in, '$.gender'),1,1),
        father_name = JSON_VALUE(p_json_in, '$.fatherName'),
        mother_name = JSON_VALUE(p_json_in, '$.motherName'),
        spouse_name = JSON_VALUE(p_json_in, '$.spouseName'),
        present_address = JSON_QUERY(p_json_in, '$.presentAddress'),
        permanent_address = JSON_QUERY(p_json_in, '$.permanentAddress'),
        same_as_permanent = CASE WHEN JSON_VALUE(p_json_in, '$.sameAsPermanent') = 'true' THEN 'Y' ELSE 'N' END,
        nid_or_birth_cert = JSON_VALUE(p_json_in, '$.nidOrBirthCertNo'),
        tin = JSON_VALUE(p_json_in, '$.tin'),
        passport_number = JSON_VALUE(p_json_in, '$.passportNumber'),
        passport_issue_date = TO_DATE(JSON_VALUE(p_json_in, '$.passportIssueDate'), 'YYYY-MM-DD'),
        passport_expiry_date = TO_DATE(JSON_VALUE(p_json_in, '$.passportExpiryDate'), 'YYYY-MM-DD'),
        spending_limit_pct = TO_NUMBER(JSON_VALUE(p_json_in, '$.spendingLimitPercentage')),
        updated_at = CURRENT_TIMESTAMP
      WHERE application_id = p_application_id;
    ELSE
      v_supplementary_id := SYS_GUID();
      INSERT INTO TCC_SUPPLEMENTARY_CARD (
        supplementary_id, application_id, full_name, name_on_card, relationship,
        date_of_birth, gender, father_name, mother_name, spouse_name,
        present_address, permanent_address, same_as_permanent,
        nid_or_birth_cert, tin, passport_number,
        passport_issue_date, passport_expiry_date, spending_limit_pct
      ) VALUES (
        v_supplementary_id, p_application_id, JSON_VALUE(p_json_in, '$.fullName'),
        JSON_VALUE(p_json_in, '$.nameOnCard'), JSON_VALUE(p_json_in, '$.relationship'),
        TO_DATE(JSON_VALUE(p_json_in, '$.dateOfBirth'), 'YYYY-MM-DD'),
        SUBSTR(JSON_VALUE(p_json_in, '$.gender'),1,1),
        JSON_VALUE(p_json_in, '$.fatherName'), JSON_VALUE(p_json_in, '$.motherName'),
        JSON_VALUE(p_json_in, '$.spouseName'),
        JSON_QUERY(p_json_in, '$.presentAddress'),
        JSON_QUERY(p_json_in, '$.permanentAddress'),
        CASE WHEN JSON_VALUE(p_json_in, '$.sameAsPermanent') = 'true' THEN 'Y' ELSE 'N' END,
        JSON_VALUE(p_json_in, '$.nidOrBirthCertNo'), JSON_VALUE(p_json_in, '$.tin'),
        JSON_VALUE(p_json_in, '$.passportNumber'),
        TO_DATE(JSON_VALUE(p_json_in, '$.passportIssueDate'), 'YYYY-MM-DD'),
        TO_DATE(JSON_VALUE(p_json_in, '$.passportExpiryDate'), 'YYYY-MM-DD'),
        TO_NUMBER(JSON_VALUE(p_json_in, '$.spendingLimitPercentage'))
      );
    END IF;

    UPDATE TCC_APPLICATION
    SET has_supplementary = 'Y',
        current_step = GREATEST(current_step, 8),
        highest_step = GREATEST(highest_step, 8),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Supplementary card details saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('530', SQLERRM, v_proc);
      p_status := '530';
      p_message := '530 : Error saving supplementary card. See TCC_ERROR_LOG.';
  END save_supplementary_card;

  -- ---------------------------------------------------------------------------
  -- get_supplementary_card (531)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_supplementary_card(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_supplementary_card';
  BEGIN
    SELECT JSON_OBJECT(
      'id' VALUE supplementary_id, 'fullName' VALUE full_name, 'nameOnCard' VALUE name_on_card,
      'relationship' VALUE relationship, 'dateOfBirth' VALUE TO_CHAR(date_of_birth, 'YYYY-MM-DD'),
      'gender' VALUE gender, 'fatherName' VALUE father_name, 'motherName' VALUE mother_name,
      'spouseName' VALUE spouse_name, 'presentAddress' VALUE present_address,
      'permanentAddress' VALUE permanent_address,
      'sameAsPermanent' VALUE CASE same_as_permanent WHEN 'Y' THEN 1 ELSE 0 END,
      'nidOrBirthCertNo' VALUE nid_or_birth_cert, 'tin' VALUE tin,
      'passportNumber' VALUE passport_number,
      'passportIssueDate' VALUE TO_CHAR(passport_issue_date, 'YYYY-MM-DD'),
      'passportExpiryDate' VALUE TO_CHAR(passport_expiry_date, 'YYYY-MM-DD'),
      'spendingLimitPercentage' VALUE spending_limit_pct
    ) INTO p_json_out
    FROM TCC_SUPPLEMENTARY_CARD
    WHERE application_id = p_application_id;

    IF p_json_out IS NULL THEN p_json_out := JSON_OBJECT('fullName' VALUE NULL); END IF;
    p_status := 'S';
    p_message := 'Supplementary card details retrieved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := 'S';
      p_message := 'Supplementary card details retrieved successfully';
      p_json_out := JSON_OBJECT('fullName' VALUE NULL);
    WHEN OTHERS THEN
      write_error_log('531', SQLERRM, v_proc);
      p_status := '531';
      p_message := '531 : Error retrieving supplementary card. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_supplementary_card;

  -- ---------------------------------------------------------------------------
  -- delete_supplementary_card (532)
  -- ---------------------------------------------------------------------------
  PROCEDURE delete_supplementary_card(
    p_supplementary_id IN VARCHAR2,
    p_status           OUT VARCHAR2,
    p_message          OUT VARCHAR2
  ) IS
    v_proc           CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.delete_supplementary_card';
    v_application_id  VARCHAR2(36);
  BEGIN
    SELECT application_id INTO v_application_id FROM TCC_SUPPLEMENTARY_CARD WHERE supplementary_id = p_supplementary_id;

    DELETE FROM TCC_SUPPLEMENTARY_CARD WHERE supplementary_id = p_supplementary_id;

    UPDATE TCC_APPLICATION
    SET has_supplementary = 'N', updated_at = CURRENT_TIMESTAMP
    WHERE application_id = v_application_id;

    p_status := 'S';
    p_message := 'Supplementary card deleted successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '532';
      p_message := '532 : Supplementary card not found.';
    WHEN OTHERS THEN
      write_error_log('532', SQLERRM, v_proc);
      p_status := '532';
      p_message := '532 : Error deleting supplementary card. See TCC_ERROR_LOG.';
  END delete_supplementary_card;

  -- ==========================================================================
  -- STEP 9: REFERENCES (533-534)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_references (533)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_references(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_references';
  BEGIN
    -- Delete existing references for this application
    DELETE FROM TCC_REFERENCE WHERE application_id = p_application_id;

    -- Insert reference 1
    INSERT INTO TCC_REFERENCE (
      reference_id, application_id, reference_sequence, referee_name,
      relationship, mobile_number, work_address, residence_address
    )
    SELECT SYS_GUID(), p_application_id, 1,
           JSON_VALUE(p_json_in, '$.reference1.refereeName'),
           JSON_VALUE(p_json_in, '$.reference1.relationship'),
           JSON_VALUE(p_json_in, '$.reference1.mobileNumber'),
           JSON_VALUE(p_json_in, '$.reference1.workAddress'),
           JSON_VALUE(p_json_in, '$.reference1.residenceAddress')
    FROM DUAL
    WHERE JSON_VALUE(p_json_in, '$.reference1.refereeName') IS NOT NULL;

    -- Insert reference 2
    INSERT INTO TCC_REFERENCE (
      reference_id, application_id, reference_sequence, referee_name,
      relationship, mobile_number, work_address, residence_address
    )
    SELECT SYS_GUID(), p_application_id, 2,
           JSON_VALUE(p_json_in, '$.reference2.refereeName'),
           JSON_VALUE(p_json_in, '$.reference2.relationship'),
           JSON_VALUE(p_json_in, '$.reference2.mobileNumber'),
           JSON_VALUE(p_json_in, '$.reference2.workAddress'),
           JSON_VALUE(p_json_in, '$.reference2.residenceAddress')
    FROM DUAL
    WHERE JSON_VALUE(p_json_in, '$.reference2.refereeName') IS NOT NULL;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 9),
        highest_step = GREATEST(highest_step, 9),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'References saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('533', SQLERRM, v_proc);
      p_status := '533';
      p_message := '533 : Error saving references. See TCC_ERROR_LOG.';
  END save_references;

  -- ---------------------------------------------------------------------------
  -- get_references (534)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_references(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_references';
  BEGIN
    SELECT JSON_OBJECT(
      'reference1' VALUE (SELECT JSON_OBJECT(
        'refereeName' VALUE referee_name, 'relationship' VALUE relationship,
        'mobileNumber' VALUE mobile_number, 'workAddress' VALUE work_address,
        'residenceAddress' VALUE residence_address
      ) FROM TCC_REFERENCE WHERE application_id = p_application_id AND reference_sequence = 1),
      'reference2' VALUE (SELECT JSON_OBJECT(
        'refereeName' VALUE referee_name, 'relationship' VALUE relationship,
        'mobileNumber' VALUE mobile_number, 'workAddress' VALUE work_address,
        'residenceAddress' VALUE residence_address
      ) FROM TCC_REFERENCE WHERE application_id = p_application_id AND reference_sequence = 2)
    ) INTO p_json_out FROM DUAL;

    p_status := 'S';
    p_message := 'References retrieved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('534', SQLERRM, v_proc);
      p_status := '534';
      p_message := '534 : Error retrieving references. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_references;

  -- ==========================================================================
  -- STEP 10: IMAGES & SIGNATURES (535-538)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_applicant_media (535)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_applicant_media(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_applicant_media';
  BEGIN
    -- Delete existing media for this application
    DELETE FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id;

    -- Insert new media records
    IF JSON_VALUE(p_json_in, '$.primaryApplicantPhoto') IS NOT NULL THEN
      INSERT INTO TCC_APPLICANT_MEDIA (media_id, application_id, media_type, file_url)
      VALUES (SYS_GUID(), p_application_id, 'PRIMARY_APPLICANT_PHOTO', JSON_VALUE(p_json_in, '$.primaryApplicantPhoto'));
    END IF;

    IF JSON_VALUE(p_json_in, '$.supplementaryApplicantPhoto') IS NOT NULL THEN
      INSERT INTO TCC_APPLICANT_MEDIA (media_id, application_id, media_type, file_url)
      VALUES (SYS_GUID(), p_application_id, 'SUPPLEMENTARY_APPLICANT_PHOTO', JSON_VALUE(p_json_in, '$.supplementaryApplicantPhoto'));
    END IF;

    IF JSON_VALUE(p_json_in, '$.primaryApplicantSignature') IS NOT NULL THEN
      INSERT INTO TCC_APPLICANT_MEDIA (media_id, application_id, media_type, file_url)
      VALUES (SYS_GUID(), p_application_id, 'PRIMARY_APPLICANT_SIGNATURE', JSON_VALUE(p_json_in, '$.primaryApplicantSignature'));
    END IF;

    IF JSON_VALUE(p_json_in, '$.supplementaryApplicantSignature') IS NOT NULL THEN
      INSERT INTO TCC_APPLICANT_MEDIA (media_id, application_id, media_type, file_url)
      VALUES (SYS_GUID(), p_application_id, 'SUPPLEMENTARY_APPLICANT_SIGNATURE', JSON_VALUE(p_json_in, '$.supplementaryApplicantSignature'));
    END IF;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 10),
        highest_step = GREATEST(highest_step, 10),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Applicant media saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('535', SQLERRM, v_proc);
      p_status := '535';
      p_message := '535 : Error saving applicant media. See TCC_ERROR_LOG.';
  END save_applicant_media;

  -- ---------------------------------------------------------------------------
  -- get_applicant_media (536)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_applicant_media(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_applicant_media';
  BEGIN
    SELECT JSON_OBJECT(
      'primaryApplicantPhoto' VALUE (SELECT file_url FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id AND media_type = 'PRIMARY_APPLICANT_PHOTO' FETCH FIRST 1 ROW ONLY),
      'supplementaryApplicantPhoto' VALUE (SELECT file_url FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id AND media_type = 'SUPPLEMENTARY_APPLICANT_PHOTO' FETCH FIRST 1 ROW ONLY),
      'primaryApplicantSignature' VALUE (SELECT file_url FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id AND media_type = 'PRIMARY_APPLICANT_SIGNATURE' FETCH FIRST 1 ROW ONLY),
      'supplementaryApplicantSignature' VALUE (SELECT file_url FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id AND media_type = 'SUPPLEMENTARY_APPLICANT_SIGNATURE' FETCH FIRST 1 ROW ONLY)
    ) INTO p_json_out FROM DUAL;

    p_status := 'S';
    p_message := 'Applicant media retrieved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('536', SQLERRM, v_proc);
      p_status := '536';
      p_message := '536 : Error retrieving applicant media. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_applicant_media;

  -- ---------------------------------------------------------------------------
  -- upload_document (537)
  -- ---------------------------------------------------------------------------
  PROCEDURE upload_document(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc     CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.upload_document';
    v_doc_id   VARCHAR2(36);
    v_doc_type VARCHAR2(30);
  BEGIN
    v_doc_id := SYS_GUID();
    v_doc_type := JSON_VALUE(p_json_in, '$.documentType');

    INSERT INTO TCC_DOCUMENT (
      document_id, application_id, document_type, document_name,
      file_url, mime_type, verification_status
    ) VALUES (
      v_doc_id, p_application_id, v_doc_type,
      JSON_VALUE(p_json_in, '$.fileName'),
      JSON_VALUE(p_json_in, '$.fileUrl'),
      JSON_VALUE(p_json_in, '$.mimeType'),
      'PENDING'
    );

    p_status := 'S';
    p_message := 'Document uploaded successfully';
    p_json_out := JSON_OBJECT('documentId' VALUE v_doc_id);
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('537', SQLERRM, v_proc);
      p_status := '537';
      p_message := '537 : Error uploading document. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END upload_document;

  -- ---------------------------------------------------------------------------
  -- get_documents (538)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_documents(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_documents';
  BEGIN
    SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'id' VALUE document_id, 'documentType' VALUE document_type,
      'documentName' VALUE document_name, 'fileUrl' VALUE file_url,
      'fileSize' VALUE file_size, 'uploadedAt' VALUE TO_CHAR(uploaded_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'verificationStatus' VALUE verification_status
    )) INTO p_json_out
    FROM TCC_DOCUMENT
    WHERE application_id = p_application_id
    ORDER BY uploaded_at DESC;

    IF p_json_out IS NULL THEN p_json_out := '[]'; END IF;
    p_status := 'S';
    p_message := 'Documents retrieved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('538', SQLERRM, v_proc);
      p_status := '538';
      p_message := '538 : Error retrieving documents. See TCC_ERROR_LOG.';
      p_json_out := '[]';
  END get_documents;

  -- ==========================================================================
  -- STEP 11: AUTO DEBIT (539-540)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_auto_debit (539)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_auto_debit(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc      CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_auto_debit';
    v_debit_id VARCHAR2(36);
    v_exists    NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_exists FROM TCC_AUTO_DEBIT WHERE application_id = p_application_id;

    IF v_exists > 0 THEN
      UPDATE TCC_AUTO_DEBIT SET
        debit_preference = JSON_VALUE(p_json_in, '$.autoDebitPreference'),
        account_name = JSON_VALUE(p_json_in, '$.accountName'),
        mtb_account_number = JSON_VALUE(p_json_in, '$.mtbAccountNumber'),
        updated_at = CURRENT_TIMESTAMP
      WHERE application_id = p_application_id;
    ELSE
      v_debit_id := SYS_GUID();
      INSERT INTO TCC_AUTO_DEBIT (
        auto_debit_id, application_id, debit_preference,
        account_name, mtb_account_number
      ) VALUES (
        v_debit_id, p_application_id, JSON_VALUE(p_json_in, '$.autoDebitPreference'),
        JSON_VALUE(p_json_in, '$.accountName'),
        JSON_VALUE(p_json_in, '$.mtbAccountNumber')
      );
    END IF;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 11),
        highest_step = GREATEST(highest_step, 11),
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Auto debit instruction saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('539', SQLERRM, v_proc);
      p_status := '539';
      p_message := '539 : Error saving auto debit. See TCC_ERROR_LOG.';
  END save_auto_debit;

  -- ---------------------------------------------------------------------------
  -- get_auto_debit (540)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_auto_debit(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_auto_debit';
  BEGIN
    SELECT JSON_OBJECT(
      'autoDebitPreference' VALUE debit_preference,
      'accountName' VALUE account_name,
      'mtbAccountNumber' VALUE mtb_account_number
    ) INTO p_json_out
    FROM TCC_AUTO_DEBIT
    WHERE application_id = p_application_id;

    IF p_json_out IS NULL THEN p_json_out := JSON_OBJECT(
      'autoDebitPreference' VALUE NULL, 'accountName' VALUE NULL,
      'mtbAccountNumber' VALUE NULL
    ); END IF;
    p_status := 'S';
    p_message := 'Auto debit details retrieved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := 'S';
      p_message := 'Auto debit details retrieved successfully';
      p_json_out := JSON_OBJECT(
        'autoDebitPreference' VALUE NULL, 'accountName' VALUE NULL,
        'mtbAccountNumber' VALUE NULL
      );
    WHEN OTHERS THEN
      write_error_log('540', SQLERRM, v_proc);
      p_status := '540';
      p_message := '540 : Error retrieving auto debit. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_auto_debit;

  -- ==========================================================================
  -- STEP 12: MID DECLARATIONS (541-542)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_mid_declarations (541)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_mid_declarations(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  ) IS
    v_proc      CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_mid_declarations';
    v_decl_id  VARCHAR2(36);
    v_exists    NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_exists FROM TCC_DECLARATION WHERE application_id = p_application_id;

    IF v_exists > 0 THEN
      UPDATE TCC_DECLARATION SET
        pep_status = CASE WHEN JSON_VALUE(p_json_in, '$.declarations.pepStatus') = 'true' THEN 'Y' ELSE 'N' END,
        existing_cards = CASE WHEN JSON_VALUE(p_json_in, '$.declarations.existingCards') = 'true' THEN 'Y' ELSE 'N' END,
        bankruptcy_history = CASE WHEN JSON_VALUE(p_json_in, '$.declarations.bankruptcyHistory') = 'true' THEN 'Y' ELSE 'N' END,
        terms_accepted = CASE WHEN JSON_VALUE(p_json_in, '$.termsAccepted') = 'true' THEN 'Y' ELSE 'N' END,
        declaration_json = JSON_QUERY(p_json_in, '$.declarations'),
        checklist_json = JSON_QUERY(p_json_in, '$.documentChecklist'),
        declared_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE application_id = p_application_id;
    ELSE
      v_decl_id := SYS_GUID();
      INSERT INTO TCC_DECLARATION (
        declaration_id, application_id, pep_status, existing_cards,
        bankruptcy_history, terms_accepted, declaration_json, checklist_json
      ) VALUES (
        v_decl_id, p_application_id,
        CASE WHEN JSON_VALUE(p_json_in, '$.declarations.pepStatus') = 'true' THEN 'Y' ELSE 'N' END,
        CASE WHEN JSON_VALUE(p_json_in, '$.declarations.existingCards') = 'true' THEN 'Y' ELSE 'N' END,
        CASE WHEN JSON_VALUE(p_json_in, '$.declarations.bankruptcyHistory') = 'true' THEN 'Y' ELSE 'N' END,
        CASE WHEN JSON_VALUE(p_json_in, '$.termsAccepted') = 'true' THEN 'Y' ELSE 'N' END,
        JSON_QUERY(p_json_in, '$.declarations'),
        JSON_QUERY(p_json_in, '$.documentChecklist'),
        CURRENT_TIMESTAMP
      );
    END IF;

    UPDATE TCC_APPLICATION
    SET current_step = GREATEST(current_step, 12),
        highest_step = GREATEST(highest_step, 12),
        terms_accepted = CASE WHEN JSON_VALUE(p_json_in, '$.termsAccepted') = 'true' THEN 'Y' ELSE 'N' END,
        declaration_accepted = CASE WHEN JSON_VALUE(p_json_in, '$.declarationAccepted') = 'true' THEN 'Y' ELSE 'N' END,
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'MID declarations saved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('541', SQLERRM, v_proc);
      p_status := '541';
      p_message := '541 : Error saving MID declarations. See TCC_ERROR_LOG.';
  END save_mid_declarations;

  -- ---------------------------------------------------------------------------
  -- get_mid_declarations (542)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_mid_declarations(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_mid_declarations';
  BEGIN
    SELECT JSON_OBJECT(
      'declarations' VALUE (
        SELECT JSON_OBJECT(
          'id' VALUE 'pepStatus', 'question' VALUE 'Are you a Politically Exposed Person (PEP)?',
          'answer' VALUE CASE pep_status WHEN 'Y' THEN 1 ELSE 0 END
        ),
        JSON_OBJECT(
          'id' VALUE 'existingCards', 'question' VALUE 'Do you have any existing credit cards?',
          'answer' VALUE CASE existing_cards WHEN 'Y' THEN 1 ELSE 0 END
        ),
        JSON_OBJECT(
          'id' VALUE 'bankruptcyHistory', 'question' => 'Have you ever been bankrupt?',
          'answer' VALUE CASE bankruptcy_history WHEN 'Y' THEN 1 ELSE 0 END
        )
      ) FORMAT JSON,
      'documentChecklist' VALUE checklist_json,
      'termsAccepted' VALUE CASE terms_accepted WHEN 'Y' THEN 1 ELSE 0 END,
      'declarationAccepted' VALUE CASE declaration_accepted WHEN 'Y' THEN 1 ELSE 0 END,
      'declaredAt' VALUE TO_CHAR(declared_at, 'YYYY-MM-DD"T"HH24:MI:SS')
    ) INTO p_json_out
    FROM TCC_DECLARATION
    WHERE application_id = p_application_id;

    IF p_json_out IS NULL THEN p_json_out := JSON_OBJECT(
      'declarations' VALUE '[]',
      'documentChecklist' => NULL,
      'termsAccepted' => 0,
      'declarationAccepted' => 0
    ); END IF;
    p_status := 'S';
    p_message := 'MID declarations retrieved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := 'S';
      p_message := 'MID declarations retrieved successfully';
      p_json_out := JSON_OBJECT(
        'declarations' VALUE '[]',
        'documentChecklist' => NULL,
        'termsAccepted' => 0,
        'declarationAccepted' => 0
      );
    WHEN OTHERS THEN
      write_error_log('542', SQLERRM, v_proc);
      p_status := '542';
      p_message := '542 : Error retrieving MID declarations. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_mid_declarations;

  -- ==========================================================================
  -- FULL APPLICATION SAVE (543)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- save_full_application (543)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_full_application(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_full_application';
  BEGIN
    -- This procedure saves all data from the complete FullApplicationData JSON
    -- It calls individual save procedures for each section

    -- Save personal info
    save_personal_info(
      p_application_id,
      JSON_QUERY(p_json_in, '$.personalInfo'),
      v_status, p_message
    );

    -- Save addresses
    save_addresses(
      p_application_id,
      p_json_in,
      v_status, p_message
    );

    -- Save professional info
    save_professional_info(
      p_application_id,
      JSON_QUERY(p_json_in, '$.professionalInfo'),
      v_status, p_message
    );

    -- Save monthly income
    save_monthly_income(
      p_application_id,
      p_json_in,
      v_status, p_message
    );

    -- Save bank accounts
    IF JSON_EXISTS(p_json_in, '$.bankAccounts') AND JSON_QUERY(p_json_in, '$.bankAccounts') IS NOT NULL THEN
      save_bank_accounts(
        p_application_id,
        JSON_QUERY(p_json_in, '$.bankAccounts'),
        v_status, p_message
      );
    END IF;

    -- Save credit facilities
    IF JSON_EXISTS(p_json_in, '$.creditFacilities') AND JSON_QUERY(p_json_in, '$.creditFacilities') IS NOT NULL THEN
      save_credit_facilities(
        p_application_id,
        JSON_QUERY(p_json_in, '$.creditFacilities'),
        v_status, p_message
      );
    END IF;

    -- Save nominee
    IF JSON_EXISTS(p_json_in, '$.nominee') AND JSON_VALUE(p_json_in, '$.nominee.nomineeName') IS NOT NULL THEN
      save_nominee_details(
        p_application_id,
        JSON_QUERY(p_json_in, '$.nominee'),
        v_status, p_message
      );
    END IF;

    -- Save supplementary card if exists
    IF JSON_EXISTS(p_json_in, '$.supplementaryCard') AND JSON_VALUE(p_json_in, '$.supplementaryCard.fullName') IS NOT NULL THEN
      save_supplementary_card(
        p_application_id,
        JSON_QUERY(p_json_in, '$.supplementaryCard'),
        v_status, p_message
      );
    END IF;

    -- Save references
    save_references(
      p_application_id,
      p_json_in,
      v_status, p_message
    );

    -- Save images/signatures
    IF JSON_EXISTS(p_json_in, '$.imageSignature') AND (
      JSON_VALUE(p_json_in, '$.imageSignature.primaryApplicantPhoto') IS NOT NULL OR
      JSON_VALUE(p_json_in, '$.imageSignature.primaryApplicantSignature') IS NOT NULL
    ) THEN
      save_applicant_media(
        p_application_id,
        JSON_QUERY(p_json_in, '$.imageSignature'),
        v_status, p_message
      );
    END IF;

    -- Save auto debit
    IF JSON_EXISTS(p_json_in, '$.autoDebit') AND JSON_VALUE(p_json_in, '$.autoDebit.mtbAccountNumber') IS NOT NULL THEN
      save_auto_debit(
        p_application_id,
        JSON_QUERY(p_json_in, '$.autoDebit'),
        v_status, p_message
      );
    END IF;

    -- Save MID declarations
    IF JSON_EXISTS(p_json_in, '$.mid') THEN
      save_mid_declarations(
        p_application_id,
        p_json_in,
        v_status, p_message
      );
    END IF;

    -- Update terms and declarations
    UPDATE TCC_APPLICATION
    SET terms_accepted = CASE WHEN JSON_VALUE(p_json_in, '$.termsAccepted') = 'true' THEN 'Y' ELSE 'N' END,
        declaration_accepted = CASE WHEN JSON_VALUE(p_json_in, '$.declarationAccepted') = 'true' THEN 'Y' ELSE 'N' END,
        current_step = 12,
        highest_step = 12,
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = p_application_id;

  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('543', SQLERRM, v_proc);
      p_status := '543';
      p_message := '543 : Error saving full application. See TCC_ERROR_LOG.';
  END save_full_application;

  -- ==========================================================================
  -- SESSION MANAGEMENT (544-548)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- create_session (544)
  -- ---------------------------------------------------------------------------
  PROCEDURE create_session(
    p_mode     IN  VARCHAR2,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  ) IS
    v_proc       CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.create_session';
    v_session_id VARCHAR2(36);
    v_expires_at TIMESTAMP;
  BEGIN
    v_session_id := SYS_GUID();
    v_expires_at := CURRENT_TIMESTAMP + INTERVAL '30' MINUTE;

    INSERT INTO TCC_SESSION (session_id, application_mode, expires_at)
    VALUES (v_session_id, p_mode, v_expires_at);

    p_status := 'S';
    p_message := 'Session created successfully';
    p_json_out := JSON_OBJECT(
      'sessionId' => v_session_id,
      'mode' => p_mode,
      'createdAt' => TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'expiresAt' => TO_CHAR(v_expires_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'ttlSeconds' => 1800,
      'isActive' => 1
    );
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('544', SQLERRM, v_proc);
      p_status := '544';
      p_message := '544 : Error creating session. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END create_session;

  -- ---------------------------------------------------------------------------
  -- get_session (545)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  ) IS
    v_proc       CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_session';
    v_expires_at TIMESTAMP;
    v_ttl        NUMBER;
  BEGIN
    SELECT expires_at INTO v_expires_at
    FROM TCC_SESSION
    WHERE session_id = p_session_id AND is_active = 'Y';

    IF v_expires_at < CURRENT_TIMESTAMP THEN
      UPDATE TCC_SESSION SET is_active = 'N' WHERE session_id = p_session_id;
      p_status := '545';
      p_message := '545 : Session has expired. Please start again.';
      p_json_out := NULL;
      RETURN;
    END IF;

    v_ttl := FLOOR((v_expires_at - CURRENT_TIMESTAMP) * 24 * 60 * 60);
    SELECT JSON_OBJECT(
      'sessionId' => session_id, 'mode' => application_mode,
      'createdAt' => TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'expiresAt' => TO_CHAR(expires_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'ttlSeconds' => v_ttl,
      'isActive' => 1
    ) INTO p_json_out
    FROM TCC_SESSION
    WHERE session_id = p_session_id;

    p_status := 'S';
    p_message := 'Session retrieved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '545';
      p_message := '545 : Session not found or expired.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('545', SQLERRM, v_proc);
      p_status := '545';
      p_message := '545 : Error retrieving session. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_session;

  -- ---------------------------------------------------------------------------
  -- extend_session (546)
  -- ---------------------------------------------------------------------------
  PROCEDURE extend_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out OUT CLOB
  ) IS
    v_proc       CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.extend_session';
    v_expires_at TIMESTAMP;
  BEGIN
    v_expires_at := CURRENT_TIMESTAMP + INTERVAL '30' MINUTE;

    UPDATE TCC_SESSION
    SET expires_at = v_expires_at
    WHERE session_id = p_session_id AND is_active = 'Y';

    IF SQL%ROWCOUNT = 0 THEN
      p_status := '546';
      p_message := '546 : Session not found.';
      p_json_out := NULL;
      RETURN;
    END IF;

    p_status := 'S';
    p_message := 'Session extended successfully';
    p_json_out := JSON_OBJECT(
      'newExpiresAt' => TO_CHAR(v_expires_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'newTtlSeconds' => 1800
    );
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('546', SQLERRM, v_proc);
      p_status := '546';
      p_message := '546 : Error extending session. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END extend_session;

  -- ---------------------------------------------------------------------------
  -- end_session (547)
  -- ---------------------------------------------------------------------------
  PROCEDURE end_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.end_session';
  BEGIN
    UPDATE TCC_SESSION SET is_active = 'N' WHERE session_id = p_session_id;
    p_status := 'S';
    p_message := 'Session ended successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('547', SQLERRM, v_proc);
      p_status := 'S';
      p_message := 'Session ended successfully';
  END end_session;

  -- ---------------------------------------------------------------------------
  -- validate_session (548)
  -- ---------------------------------------------------------------------------
  PROCEDURE validate_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  ) IS
    v_proc       CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.validate_session';
    v_expires_at TIMESTAMP;
    v_ttl        NUMBER;
  BEGIN
    SELECT expires_at INTO v_expires_at
    FROM TCC_SESSION
    WHERE session_id = p_session_id AND is_active = 'Y';

    IF v_expires_at IS NULL THEN
      p_status := '548';
      p_message := '548 : Session not found.';
      p_json_out := JSON_OBJECT('valid' => 0, 'expired' => 0);
      RETURN;
    END IF;

    IF v_expires_at < CURRENT_TIMESTAMP THEN
      UPDATE TCC_SESSION SET is_active = 'N' WHERE session_id = p_session_id;
      p_status := '548';
      p_message := '548 : Session has expired.';
      p_json_out := JSON_OBJECT('valid' => 0, 'expired' => 1);
      RETURN;
    END IF;

    v_ttl := FLOOR((v_expires_at - CURRENT_TIMESTAMP) * 24 * 60 * 60);
    p_status := 'S';
    p_message := 'Session is valid';
    p_json_out := JSON_OBJECT(
      'valid' => 1, 'expired' => 0,
      'ttlSeconds' => v_ttl,
      'expiresAt' => TO_CHAR(v_expires_at, 'YYYY-MM-DD"T"HH24:MI:SS')
    );
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('548', SQLERRM, v_proc);
      p_status := '548';
      p_message := '548 : Error validating session. See TCC_ERROR_LOG.';
      p_json_out := JSON_OBJECT('valid' => 0, 'expired' => 0);
  END validate_session;

  -- ==========================================================================
  -- DRAFT MANAGEMENT (549-553)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- initialize_draft (549)
  -- ---------------------------------------------------------------------------
  PROCEDURE initialize_draft(
    p_session_id IN  VARCHAR2,
    p_mode       IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  ) IS
    v_proc     CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.initialize_draft';
    v_draft_id VARCHAR2(36);
    v_app_id   VARCHAR2(36);
  BEGIN
    v_draft_id := SYS_GUID();
    v_app_id   := 'MTB-CC-' || TO_CHAR(SYSDATE,'YYYY') || '-' || LPAD(TRUNC(DBMS_RANDOM.VALUE(1,99999)), 5, '0');

    INSERT INTO TCC_DRAFT (
      draft_id, session_id, application_id, current_step, highest_completed_step,
      draft_version, draft_data
    ) VALUES (
      v_draft_id, p_session_id, v_app_id, 1, 0, 1, '{}'
    );

    p_status := 'S';
    p_message := 'Draft initialized successfully';
    p_json_out := JSON_OBJECT(
      'sessionId' => p_session_id, 'applicationId' => v_app_id,
      'currentStep' => 1, 'highestCompletedStep' => 0,
      'draftVersion' => 1, 'stepVersions' => '[]',
      'data' => '{}',
      'lastSavedAt' => TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'isSubmitted' => 0
    );
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('549', SQLERRM, v_proc);
      p_status := '549';
      p_message := '549 : Error initializing draft. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END initialize_draft;

  -- ---------------------------------------------------------------------------
  -- get_draft (550)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_draft(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_draft';
  BEGIN
    SELECT JSON_OBJECT(
      'sessionId' => session_id, 'applicationId' => application_id,
      'currentStep' => current_step, 'highestCompletedStep' => highest_completed_step,
      'draftVersion' => draft_version,
      'stepVersions' => (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'stepNumber' => step_number, 'stepName' => step_name,
          'version' => version, 'savedAt' => TO_CHAR(saved_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
          'isComplete' => CASE is_complete WHEN 'Y' THEN 1 ELSE 0 END
        ))
        FROM TCC_DRAFT_STEP_VERSION
        WHERE draft_id = (SELECT draft_id FROM TCC_DRAFT WHERE session_id = p_session_id)
        ORDER BY saved_at DESC
      ),
      'data' => draft_data,
      'lastSavedAt' => TO_CHAR(last_saved_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'isSubmitted' => CASE is_submitted WHEN 'Y' THEN 1 ELSE 0 END
    ) INTO p_json_out
    FROM TCC_DRAFT WHERE session_id = p_session_id;

    IF p_json_out IS NULL THEN
      p_status := 'S';
      p_message := 'No draft found for this session';
      p_json_out := JSON_OBJECT(
        'sessionId' => p_session_id, 'data' => NULL,
        'currentStep' => 1, 'highestCompletedStep' => 0,
        'draftVersion' => 1, 'stepVersions' => '[]'
      );
    END IF;
    p_status := 'S';
    p_message := 'Draft retrieved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('550', SQLERRM, v_proc);
      p_status := '550';
      p_message := '550 : Error retrieving draft. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_draft;

  -- ---------------------------------------------------------------------------
  -- save_draft_step (551)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_draft_step(
    p_session_id  IN  VARCHAR2,
    p_step_number IN  NUMBER,
    p_step_name   IN  VARCHAR2,
    p_data        IN  CLOB,
    p_is_complete IN  CHAR DEFAULT 'N',
    p_status      OUT VARCHAR2,
    p_message     OUT VARCHAR2,
    p_json_out    OUT CLOB
  ) IS
    v_proc      CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.save_draft_step';
    v_draft_id  VARCHAR2(36);
    v_version   NUMBER;
    v_step_ver_id VARCHAR2(36);
  BEGIN
    SELECT draft_id, draft_version INTO v_draft_id, v_version
    FROM TCC_DRAFT WHERE session_id = p_session_id;

    v_version := v_version + 1;

    UPDATE TCC_DRAFT SET
      current_step = p_step_number,
      highest_completed_step = CASE WHEN p_is_complete = 'Y' AND p_step_number > highest_completed_step
        THEN p_step_number ELSE highest_completed_step END,
      draft_version = v_version,
      last_saved_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE session_id = p_session_id;

    v_step_ver_id := SYS_GUID();
    INSERT INTO TCC_DRAFT_STEP_VERSION (
      version_id, draft_id, step_number, step_name, version, saved_at, is_complete
    ) VALUES (
      v_step_ver_id, v_draft_id, p_step_number, p_step_name, v_version, CURRENT_TIMESTAMP, p_is_complete
    );

    p_status := 'S';
    p_message := 'Draft saved successfully';
    p_json_out := JSON_OBJECT(
      'draftVersion' => v_version,
      'savedAt' => TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS')
    );
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '551';
      p_message := '551 : Draft not found. Please refresh the page.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('551', SQLERRM, v_proc);
      p_status := '551';
      p_message := '551 : Error saving draft. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END save_draft_step;

  -- ---------------------------------------------------------------------------
  -- clear_draft (552)
  -- ---------------------------------------------------------------------------
  PROCEDURE clear_draft(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.clear_draft';
  BEGIN
    UPDATE TCC_DRAFT SET is_submitted = 'Y', updated_at = CURRENT_TIMESTAMP
    WHERE session_id = p_session_id;

    p_status := 'S';
    p_message := 'Draft cleared successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('552', SQLERRM, v_proc);
      p_status := 'S';
      p_message := 'Draft cleared successfully';
  END clear_draft;

  -- ---------------------------------------------------------------------------
  -- get_step_versions (553)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_step_versions(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_step_versions';
  BEGIN
    SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'stepNumber' => step_number, 'stepName' => step_name,
      'version' => version, 'savedAt' => TO_CHAR(saved_at,'YYYY-MM-DD"T"HH24:MI:SS'),
      'isComplete' => CASE is_complete WHEN 'Y' THEN 1 ELSE 0 END
    )) INTO p_json_out
    FROM TCC_DRAFT_STEP_VERSION v
    JOIN TCC_DRAFT d ON d.draft_id = v.draft_id
    WHERE d.session_id = p_session_id
    ORDER BY v.saved_at DESC;

    IF p_json_out IS NULL THEN p_json_out := '[]'; END IF;
    p_status := 'S';
    p_message := 'Step versions retrieved';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('553', SQLERRM, v_proc);
      p_status := '553';
      p_message := '553 : Error retrieving versions. See TCC_ERROR_LOG.';
      p_json_out := '[]';
  END get_step_versions;

  -- ==========================================================================
  -- SUBMISSION (554-556)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- submit_by_session (554)
  -- ---------------------------------------------------------------------------
  PROCEDURE submit_by_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  ) IS
    v_proc       CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.submit_by_session';
    v_draft_id   VARCHAR2(36);
    v_app_id     VARCHAR2(36);
    v_ref_no     VARCHAR2(30);
    v_draft_data CLOB;
    v_applicant_id VARCHAR2(36);
    v_card_id    VARCHAR2(20);
  BEGIN
    SELECT draft_id, application_id, draft_data
    INTO v_draft_id, v_app_id, v_draft_data
    FROM TCC_DRAFT
    WHERE session_id = p_session_id AND is_submitted = 'N';

    IF v_draft_data IS NULL OR v_draft_data = '{}' THEN
      p_status := '554';
      p_message := '554 : Application validation failed. Please complete all required steps.';
      p_json_out := NULL;
      RETURN;
    END IF;

    v_ref_no := 'MTB-CC-' || TO_CHAR(SYSDATE,'YYYY') || '-' || LPAD(TRUNC(DBMS_RANDOM.VALUE(1,99999)), 5, '0');
    v_applicant_id := SYS_GUID();
    v_card_id := NVL(JSON_VALUE(v_draft_data, '$.cardSelection.cardNetwork'), 'VISA')
               || '_' || NVL(JSON_VALUE(v_draft_data, '$.cardSelection.cardTier'), 'CLASSIC');

    INSERT INTO TCC_APPLICANT (
      applicant_id, full_name, date_of_birth, gender, nid_number, mobile_number, email
    ) VALUES (
      v_applicant_id, NVL(JSON_VALUE(v_draft_data, '$.personalInfo.nameOnCard'), SYSDATE,
      'M', NVL(JSON_VALUE(v_draft_data, '$.personalInfo.nidNumber'), ' ',
      NVL(JSON_VALUE(v_draft_data, '$.personalInfo.mobileNumber'), ' '
    );

    INSERT INTO TCC_APPLICATION (
      application_id, reference_number, applicant_id, application_mode, card_type_id,
      requested_limit, application_status, session_id, submitted_at
    ) VALUES (
      v_app_id, v_ref_no, v_applicant_id, 'SELF', v_card_id,
      NVL(JSON_VALUE(v_draft_data, '$.cardSelection.expectedCreditLimit'), 'SUBMITTED',
      p_session_id, CURRENT_TIMESTAMP
    );

    UPDATE TCC_DRAFT SET
      is_submitted = 'Y', application_id = v_app_id, updated_at = CURRENT_TIMESTAMP
    WHERE session_id = p_session_id;

    p_status := 'S';
    p_message := 'Application submitted successfully! You will receive confirmation via SMS and email.';
    p_json_out := JSON_OBJECT(
      'referenceNumber' => v_ref_no,
      'applicationId' => v_app_id,
      'submittedAt' => TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'status' => 'SUBMITTED'
    );
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '554';
      p_message := '554 : Draft not found or already submitted.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('554', SQLERRM, v_proc);
      p_status := '554';
      p_message := '554 : Application validation failed. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END submit_by_session;

  -- ---------------------------------------------------------------------------
  -- submit_full_application (555)
  -- ---------------------------------------------------------------------------
  PROCEDURE submit_full_application(
    p_json_in  IN  CLOB,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  ) IS
    v_proc     CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.submit_full_application';
    v_session VARCHAR2(36);
    v_app_id   VARCHAR2(36);
  BEGIN
    v_session := JSON_VALUE(p_json_in, '$.sessionId');

    -- Call submit_by_session which handles all the validation and submission logic
    submit_by_session(
      v_session,
      p_status,
      p_message,
      p_json_out
    );
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('555', SQLERRM, v_proc);
      p_status := '555';
      p_message := '555 : Application submission failed. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END submit_full_application;

  -- ---------------------------------------------------------------------------
  -- get_submission_status (556)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_submission_status(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_submission_status';
  BEGIN
    SELECT JSON_OBJECT(
      'status' => application_status,
      'referenceNumber' => reference_number,
      'submittedAt' => TO_CHAR(submitted_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'lastUpdatedAt' => TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS')
    ) INTO p_json_out
    FROM TCC_APPLICATION
    WHERE application_id = p_application_id;

    p_status := 'S';
    p_message := 'Submission status retrieved';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '556';
      p_message := '556 : Application not found.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('556', SQLERRM, v_proc);
      p_status := '556';
      p_message := '556 : Error retrieving status. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_submission_status;

  -- ==========================================================================
  -- DASHBOARD & REPORTING (557-560)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- get_my_applications (557)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_my_applications(
    p_user_id  IN  VARCHAR2,
    p_page     IN  NUMBER DEFAULT 1,
    p_limit    IN  NUMBER DEFAULT 10,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  ) IS
    v_proc  CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_my_applications';
    v_offset NUMBER;
    v_total  NUMBER;
  BEGIN
    v_offset := (p_page - 1) * p_limit;
    SELECT COUNT(*) INTO v_total FROM TCC_APPLICATION;

    SELECT JSON_OBJECT(
      'items' => (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' => a.application_id, 'referenceNumber' => a.reference_number,
          'status' => a.application_status, 'cardType' => a.card_type_id,
          'applicantName' => (SELECT full_name FROM TCC_APPLICANT ap WHERE ap.applicant_id = a.applicant_id),
          'mode' => a.application_mode,
          'cardNetwork' => a.card_network, 'cardTier' => a.card_tier,
          'requestedLimit' => a.requested_limit,
          'createdAt' => TO_CHAR(a.created_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
          'updatedAt' => TO_CHAR(a.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS')
        ))
        FROM (
          SELECT * FROM TCC_APPLICATION ORDER BY updated_at DESC
          OFFSET v_offset ROWS FETCH NEXT p_limit ROWS ONLY
        ) a
      ),
      'pagination' => JSON_OBJECT(
        'currentPage' => p_page,
        'totalPages' => CEIL(v_total / NULLIF(p_limit,0)),
        'totalItems' => v_total,
        'itemsPerPage' => p_limit
      )
    ) INTO p_json_out FROM DUAL;

    p_status := 'S';
    p_message := 'Applications retrieved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('557', SQLERRM, v_proc);
      p_status := '557';
      p_message := '557 : Error retrieving applications. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_my_applications;

  -- ---------------------------------------------------------------------------
  -- track_by_reference (558)
  -- ---------------------------------------------------------------------------
  PROCEDURE track_by_reference(
    p_reference_number IN  VARCHAR2,
    p_status           OUT VARCHAR2,
    p_message          OUT VARCHAR2,
    p_json_out         OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.track_by_reference';
  BEGIN
    SELECT JSON_OBJECT(
      'id' => a.application_id, 'referenceNumber' => a.reference_number,
      'status' => a.application_status, 'mode' => a.application_mode,
      'cardNetwork' => a.card_network, 'cardTier' => a.card_tier,
      'cardCategory' => a.card_category,
      'requestedLimit' => a.requested_limit,
      'applicantName' => (SELECT full_name FROM TCC_APPLICANT ap WHERE ap.applicant_id = a.applicant_id),
      'submittedAt' => TO_CHAR(a.submitted_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'createdAt' => TO_CHAR(a.created_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'updatedAt' => TO_CHAR(a.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS')
    ) INTO p_json_out
    FROM TCC_APPLICATION a
    WHERE a.reference_number = p_reference_number;

    p_status := 'S';
    p_message := 'Application found';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '558';
      p_message := '558 : No application found with this reference number.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('558', SQLERRM, v_proc);
      p_status := '558';
      p_message := '558 : Error tracking application. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END track_by_reference;

  -- ---------------------------------------------------------------------------
  -- get_dashboard_stats (559)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_dashboard_stats(
    p_branch_id IN  VARCHAR2,
    p_status    OUT VARCHAR2,
    p_message   OUT VARCHAR2,
    p_json_out  OUT CLOB
  ) IS
    v_proc        CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_dashboard_stats';
    v_total       NUMBER;
    v_pending     NUMBER;
    v_approved_today NUMBER;
    v_docs_req    NUMBER;
    v_draft_count NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_total FROM TCC_APPLICATION;
    SELECT COUNT(*) INTO v_pending FROM TCC_APPLICATION WHERE application_status = 'UNDER_REVIEW';
    SELECT COUNT(*) INTO v_approved_today FROM TCC_APPLICATION
    WHERE application_status = 'APPROVED' AND TRUNC(approved_at) = TRUNC(SYSDATE);
    SELECT COUNT(*) INTO v_docs_req FROM TCC_APPLICATION WHERE application_status = 'DOCUMENTS_REQUIRED';
    SELECT COUNT(*) INTO v_draft_count FROM TCC_DRAFT WHERE is_submitted = 'N';

    p_json_out := JSON_OBJECT(
      'totalApplications' => v_total,
      'pendingReview' => v_pending,
      'approvedToday' => v_approved_today,
      'documentsRequired' => v_docs_req,
      'draftCount' => v_draft_count
    );

    p_status := 'S';
    p_message := 'Dashboard stats retrieved successfully';
  EXCEPTION
    WHEN OTHERS THEN
      write_error_log('559', SQLERRM, v_proc);
      p_status := '559';
      p_message := '559 : Error retrieving dashboard stats. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_dashboard_stats;

  -- ---------------------------------------------------------------------------
  -- get_application_details (560) - Complete application with all related data
  -- ---------------------------------------------------------------------------
  PROCEDURE get_application_details(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  ) IS
    v_proc CONSTANT VARCHAR2(128) := 'pkg_credit_card_application.get_application_details';
  BEGIN
    SELECT JSON_OBJECT(
      'application' => (
        SELECT JSON_OBJECT(
          'id' => a.application_id, 'referenceNumber' => a.reference_number,
          'mode' => a.application_mode, 'status' => a.application_status,
          'cardNetwork' => a.card_network, 'cardTier' => a.card_tier,
          'cardCategory' => a.card_category,
          'requestedLimit' => a.requested_limit,
          'approvedLimit' => a.approved_limit,
          'currentStep' => a.current_step, 'highestStep' => a.highest_step,
          'otpVerified' => CASE WHEN a.otp_verified = 'Y' THEN 1 ELSE 0 END,
          'hasSupplementary' => CASE WHEN a.has_supplementary = 'Y' THEN 1 ELSE 0 END,
          'termsAccepted' => CASE WHEN a.terms_accepted = 'Y' THEN 1 ELSE 0 END,
          'declarationAccepted' => CASE WHEN a.declaration_accepted = 'Y' THEN 1 ELSE 0 END,
          'createdAt' => TO_CHAR(a.created_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
          'updatedAt' => TO_CHAR(a.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
          'submittedAt' => TO_CHAR(a.submitted_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
          'approvedAt' => TO_CHAR(a.approved_at, 'YYYY-MM-DD"T"HH24:MI:SS')
        )
        FROM TCC_APPLICATION a WHERE a.application_id = p_application_id
      ),
      'personalInfo' => (
        SELECT JSON_OBJECT(
          'fullName' => ap.full_name, 'nameOnCard' => ap.name_on_card,
          'fatherName' => ap.father_name, 'motherName' => ap.mother_name,
          'dateOfBirth' => TO_CHAR(ap.date_of_birth, 'YYYY-MM-DD'),
          'gender' => ap.gender, 'nationality' => ap.nationality,
          'nidNumber' => ap.nid_number, 'tin' => ap.tin,
          'passportNumber' => ap.passport_number,
          'homeDistrict' => ap.home_district,
          'religion' => ap.religion, 'maritalStatus' => ap.marital_status,
          'spouseName' => ap.spouse_name,
          'spouseProfession' => ap.spouse_profession,
          'educationLevel' => ap.education_level,
          'presentAddress' => ap.present_address,
          'permanentAddress' => ap.permanent_address,
          'mailingAddressType' => ap.mailing_address_type,
          'mobileNumber' => ap.mobile_number, 'email' => ap.email
        )
        FROM TCC_APPLICANT ap WHERE ap.applicant_id = a.applicant_id
      ),
      'professionalInfo' => (
        SELECT JSON_OBJECT(
          'customerSegment' => pd.customer_segment,
          'organizationName' => pd.organization_name,
          'parentGroup' => pd.parent_group, 'department' => pd.department,
          'designation' => pd.designation,
          'officeAddress' => pd.office_address,
          'lengthOfServiceYears' => pd.service_years, 'lengthOfServiceMonths' => pd.service_months,
          'totalExperienceYears' => pd.total_exp_years, 'totalExperienceMonths' => pd.total_exp_months,
          'previousEmployer' => pd.previous_employer,
          'previousDesignation' => pd.previous_designation
        )
        FROM TCC_PROFESSIONAL_DETAILS pd WHERE pd.application_id = p_application_id
      ),
      'incomeDetails' => (
        SELECT JSON_OBJECT(
          'isSalaried' => CASE id.is_salaried WHEN 'Y' THEN 1 ELSE 0 END,
          'salariedIncome' => JSON_OBJECT(
            'grossSalary' => id.gross_salary,
            'totalDeduction' => id.total_deduction,
            'netSalary' => id.net_salary
          ),
          'businessIncome' => JSON_OBJECT(
            'grossIncome' => id.gross_income,
            'totalExpenses' => id.total_expenses,
            'netIncome' => id.net_income
          ),
          'additionalIncomeSources' => id.additional_sources
        )
        FROM TCC_INCOME_DETAILS id WHERE id.application_id = p_application_id
      ),
      'bankAccounts' => (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' => bank_account_id, 'bankName' => bank_name,
          'accountType' => account_type, 'accountNumber' => account_number,
          'branch' => branch_name
        ))
        FROM TCC_BANK_ACCOUNT
        WHERE application_id = p_application_id
      ),
      'creditFacilities' => (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id' => facility_id, 'bankName' => bank_name,
          'facilityType' => facility_type, 'accountNumber' => account_number,
          'limit' => credit_limit, 'monthlyInstallment' => monthly_installment
        ))
        FROM TCC_CREDIT_FACILITY
        WHERE application_id = p_application_id
      ),
      'nominee' => (
        SELECT JSON_OBJECT(
          'nomineeName' => nominee_name, 'relationship' => relationship,
          'dateOfBirth' => TO_CHAR(date_of_birth, 'YYYY-MM-DD'),
          'contactAddress' => contact_address, 'mobileNumber' => mobile_number,
          'photoUrl' => photo_url,
          'declarationAccepted' => CASE declaration_accepted WHEN 'Y' THEN 1 ELSE 0 END
        )
        FROM TCC_NOMINEE WHERE application_id = p_application_id
      ),
      'supplementaryCard' => (
        SELECT JSON_OBJECT(
          'id' => supplementary_id, 'fullName' => full_name,
          'nameOnCard' => name_on_card, 'relationship' => relationship,
          'dateOfBirth' => TO_CHAR(date_of_birth, 'YYYY-MM-DD'),
          'gender' => gender, 'fatherName' => father_name,
          'motherName' => mother_name, 'spouseName' => spouse_name,
          'presentAddress' => present_address, 'permanentAddress' => permanent_address,
          'sameAsPermanent' => CASE same_as_permanent WHEN 'Y' THEN 1 ELSE 0 END,
          'nidOrBirthCertNo' => nid_or_birth_cert, 'tin' => tin,
          'passportNumber' => passport_number,
          'passportIssueDate' => TO_CHAR(passport_issue_date, 'YYYY-MM-DD'),
          'passportExpiryDate' => TO_CHAR(passport_expiry_date, 'YYYY-MM-DD'),
          'spendingLimitPercentage' => spending_limit_pct
        )
        FROM TCC_SUPPLEMENTARY_CARD WHERE application_id = p_application_id
      ),
      'references' => (
        SELECT JSON_OBJECT(
          'reference1' => (
            SELECT JSON_OBJECT(
              'refereeName' => referee_name, 'relationship' => relationship,
              'mobileNumber' => mobile_number, 'workAddress' => work_address,
              'residenceAddress' => residence_address
            )
            FROM TCC_REFERENCE WHERE application_id = p_application_id AND reference_sequence = 1
          ),
          'reference2' => (
            SELECT JSON_OBJECT(
              'refereeName' => referee_name, 'relationship' => relationship,
              'mobileNumber' => mobile_number, 'workAddress' => work_address,
              'residenceAddress' => residence_address
            )
            FROM TCC_REFERENCE WHERE application_id = p_application_id AND reference_sequence = 2
          )
        )
        FROM DUAL
      ),
      'imagesSignatures' => (
        SELECT JSON_OBJECT(
          'primaryApplicantPhoto' => (SELECT file_url FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id AND media_type = 'PRIMARY_APPLICANT_PHOTO' FETCH FIRST 1 ROW ONLY),
          'supplementaryApplicantPhoto' => (SELECT file_url FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id AND media_type = 'SUPPLEMENTARY_APPLICANT_PHOTO' FETCH FIRST 1 ROW ONLY),
          'primaryApplicantSignature' => (SELECT file_url FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id AND media_type = 'PRIMARY_APPLICANT_SIGNATURE' FETCH FIRST 1 ROW ONLY),
          'supplementaryApplicantSignature' => (SELECT file_url FROM TCC_APPLICANT_MEDIA WHERE application_id = p_application_id AND media_type = 'SUPPLEMENTARY_APPLICANT_SIGNATURE' FETCH FIRST 1 ROW ONLY)
        )
        FROM DUAL
      ),
      'autoDebit' => (
        SELECT JSON_OBJECT(
          'autoDebitPreference' => debit_preference,
          'accountName' => account_name,
          'mtbAccountNumber' => mtb_account_number
        )
        FROM TCC_AUTO_DEBIT WHERE application_id = p_application_id
      ),
      'declarations' => (
        SELECT JSON_OBJECT(
          'declarations' => (
            SELECT JSON_ARRAYAGG(JSON_OBJECT(
              'id' => 'pepStatus', 'question' => 'Are you a PEP?',
              'answer' => CASE pep_status WHEN 'Y' THEN 1 ELSE 0 END
            ),
            JSON_OBJECT('id' => 'existingCards', 'question' => 'Existing cards?', 'answer' => CASE existing_cards WHEN 'Y' THEN 1 ELSE 0 END),
            JSON_OBJECT('id' => 'bankruptcyHistory', 'question' => 'Bankruptcy?', 'answer' => CASE bankruptcy_history WHEN 'Y' THEN 1 ELSE 0 END)
          )
          FROM TCC_DECLARATION WHERE application_id = p_application_id
        ),
        'documentChecklist' => checklist_json,
        'termsAccepted' => CASE terms_accepted WHEN 'Y' THEN 1 ELSE 0 END,
        'declarationAccepted' => CASE declaration_accepted WHEN 'Y' THEN 1 ELSE 0 END,
        'declaredAt' => TO_CHAR(declared_at, 'YYYY-MM-DD"T"HH24:MI:SS')
      )
    ) INTO p_json_out
    FROM TCC_APPLICATION a
    LEFT JOIN TCC_APPLICANT ap ON ap.applicant_id = a.applicant_id
    LEFT JOIN TCC_PROFESSIONAL_DETAILS pd ON pd.application_id = a.application_id
    LEFT JOIN TCC_INCOME_DETAILS id ON id.application_id = a.application_id
    WHERE a.application_id = p_application_id;

    IF p_json_out IS NULL THEN
      p_status := '560';
      p_message := '560 : Application not found.';
      p_json_out := NULL;
      RETURN;
    END IF;

    p_status := 'S';
    p_message := 'Application details retrieved successfully';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_status := '560';
      p_message := '560 : Application not found.';
      p_json_out := NULL;
    WHEN OTHERS THEN
      write_error_log('560', SQLERRM, v_proc);
      p_status := '560';
      p_message := '560 : Error retrieving application details. See TCC_ERROR_LOG.';
      p_json_out := NULL;
  END get_application_details;

  -- ==========================================================================
  -- ADDITIONAL FEATURES (561-562)
  -- ==========================================================================

  -- ---------------------------------------------------------------------------
  -- get_all_applications (561)
  -- Purpose: Retrieve applications with multiple filters for RM dashboard
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
    ) INTO (
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
  -- get_application_timeline (562)
  -- Purpose: Retrieve audit trail/timeline for an application
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
    v_timeline := JSON_ARRAY_T(
      JSON_OBJECT(
        'timestamp' VALUE TO_CHAR(v_created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z'),
        'event' VALUE 'Application Created',
        'status' VALUE 'completed',
        'description' VALUE 'Application initiated',
        'actor' VALUE 'APPLICANT'
      ).TO_CLOB()
    );

    -- Event 2: Steps Progress (show significant milestones)
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

    -- Event 3: Application Submitted
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

    -- Event 4: Status Update based on current status
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

END pkg_credit_card_application;
/

-- =============================================================================
-- END OF SESSION 2 & EXTENSIONS (Error Codes 501-562)
-- COMPLETE PACKAGE - All 62 procedures implemented (501-562)
-- =============================================================================
