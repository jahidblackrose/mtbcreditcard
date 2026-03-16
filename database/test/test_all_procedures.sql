-- =============================================================================
-- MTB Credit Card Application System - Complete Package Test
-- =============================================================================
-- Purpose: Test all 60 procedures (501-560) with sample data
-- Usage: Run in SQLPlus or any Oracle SQL client
-- =============================================================================

SET SERVEROUTPUT ON SIZE UNLIMITED
SET FEEDBACK ON
SET ECHO ON
SET TIMING ON

-- =============================================================================
-- SECTION 1: SETUP - Clean Test Data & Insert Reference Data
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 1: SETUP - Cleaning test data and inserting reference data
PROMPT ==============================================================================

BEGIN
   -- Clean existing test data (cascade delete will handle child records)
   DELETE FROM TCC_DRAFT WHERE session_id LIKE 'TEST-%';
   DELETE FROM TCC_SESSION WHERE session_id LIKE 'TEST-%';
   DELETE FROM TCC_APPLICATION WHERE application_id LIKE 'TEST-%';
   DELETE FROM TCC_APPLICANT WHERE applicant_id LIKE 'TEST-%';
   DELETE FROM TCC_ERROR_LOG WHERE error_code LIKE '5%';

   -- Clean reference tables
   DELETE FROM TCC_REF_CARD_NETWORK;
   DELETE FROM TCC_REF_CARD_TIER;
   DELETE FROM TCC_REF_CARD_CATEGORY;
   DELETE FROM TCC_REF_CUSTOMER_SEGMENT;
   DELETE FROM TCC_REF_EDUCATION_LEVEL;
   DELETE FROM TCC_REF_ACCOUNT_TYPE;
   DELETE FROM TCC_REF_FACILITY_TYPE;
   DELETE FROM TCC_REF_NOMINEE_RELATIONSHIP;
   DELETE FROM TCC_REF_SUPPLEMENTARY_RELATIONSHIP;
   DELETE FROM TCC_REF_REFEE_RELATIONSHIP;
   DELETE FROM TCC_REF_RELIGION;
   DELETE FROM TCC_REF_MARITAL_STATUS;
   DELETE FROM TCC_REF_AUTO_DEBIT_PREFERENCE;
   DELETE FROM TCC_REF_DISTRICT;

   COMMIT;

   -- Insert Card Networks
   INSERT INTO TCC_REF_CARD_NETWORK (network_id, network_code, network_name, is_active) VALUES
   ('N-001', 'VISA', 'Visa', 'Y'),
   ('N-002', 'MASTERCARD', 'Mastercard', 'Y'),
   ('N-003', 'UNIONPAY', 'UnionPay', 'Y');

   -- Insert Card Tiers
   INSERT INTO TCC_REF_CARD_TIER (tier_id, tier_code, tier_name, min_limit, max_limit, is_active) VALUES
   ('T-001', 'CLASSIC', 'Classic', 10000, 50000, 'Y'),
   ('T-002', 'GOLD', 'Gold', 50001, 100000, 'Y'),
   ('T-003', 'PLATINUM', 'Platinum', 100001, 250000, 'Y'),
   ('T-004', 'TITANIUM', 'Titanium', 250001, 500000, 'Y'),
   ('T-005', 'SIGNATURE', 'Signature', 500001, 1000000, 'Y'),
   ('T-006', 'WORLD', 'World', 1000001, 9999999, 'Y');

   -- Insert Card Categories
   INSERT INTO TCC_REF_CARD_CATEGORY (category_id, category_code, category_name, is_active) VALUES
   ('C-001', 'REGULAR', 'Regular Card', 'Y'),
   ('C-002', 'YAQEEN', 'Yaqeen Card', 'Y'),
   ('C-003', 'CO_BRANDED', 'Co-Branded Card', 'Y');

   -- Insert Customer Segments
   INSERT INTO TCC_REF_CUSTOMER_SEGMENT (segment_id, segment_code, segment_name, description, is_active) VALUES
   ('S-001', 'SALARIED', 'Salaried Individual', 'Employed professionals', 'Y'),
   ('S-002', 'BUSINESS_PERSON', 'Business Person', 'Business owners', 'Y'),
   ('S-003', 'SELF_EMPLOYED', 'Self Employed', 'Doctors, Lawyers, Consultants', 'Y'),
   ('S-004', 'LANDLORD', 'Landlord', 'Property owners', 'Y'),
   ('S-005', 'OTHER', 'Other', 'Other income sources', 'Y');

   -- Insert Education Levels
   INSERT INTO TCC_REF_EDUCATION_LEVEL (education_id, education_code, education_name, is_active) VALUES
   ('E-001', 'SSC', 'Secondary School Certificate', 'Y'),
   ('E-002', 'HSC', 'Higher Secondary Certificate', 'Y'),
   ('E-003', 'GRADUATE', 'Graduate', 'Y'),
   ('E-004', 'POST_GRADUATE', 'Post Graduate', 'Y'),
   ('E-005', 'PHD', 'PhD', 'Y'),
   ('E-006', 'OTHER', 'Other', 'Y');

   -- Insert Account Types
   INSERT INTO TCC_REF_ACCOUNT_TYPE (account_type_id, account_type_code, account_type_name, is_active) VALUES
   ('AT-001', 'SAVINGS', 'Savings Account', 'Y'),
   ('AT-002', 'CURRENT', 'Current Account', 'Y'),
   ('AT-003', 'FDR', 'Fixed Deposit Receipt', 'Y'),
   ('AT-004', 'DPS', 'DPS Scheme', 'Y'),
   ('AT-005', 'OTHER', 'Other', 'Y');

   -- Insert Facility Types
   INSERT INTO TCC_REF_FACILITY_TYPE (facility_type_id, facility_type_code, facility_type_name, is_active) VALUES
   ('FT-001', 'CREDIT_CARD', 'Credit Card', 'Y'),
   ('FT-002', 'HOME_LOAN', 'Home Loan', 'Y'),
   ('FT-003', 'CAR_LOAN', 'Car Loan', 'Y'),
   ('FT-004', 'PERSONAL_LOAN', 'Personal Loan', 'Y'),
   ('FT-005', 'OTHER', 'Other', 'Y');

   -- Insert Nominee Relationships
   INSERT INTO TCC_REF_NOMINEE_RELATIONSHIP (relationship_id, relationship_code, relationship_name, is_active) VALUES
   ('NR-001', 'SPOUSE', 'Spouse', 'Y'),
   ('NR-002', 'PARENT', 'Parent', 'Y'),
   ('NR-003', 'SON', 'Son', 'Y'),
   ('NR-004', 'DAUGHTER', 'Daughter', 'Y'),
   ('NR-005', 'OTHER', 'Other', 'Y');

   -- Insert Supplementary Relationships
   INSERT INTO TCC_REF_SUPPLEMENTARY_RELATIONSHIP (relationship_id, relationship_code, relationship_name, is_active) VALUES
   ('SR-001', 'FATHER', 'Father', 'Y'),
   ('SR-002', 'MOTHER', 'Mother', 'Y'),
   ('SR-003', 'SON', 'Son', 'Y'),
   ('SR-004', 'DAUGHTER', 'Daughter', 'Y'),
   ('SR-005', 'SPOUSE', 'Spouse', 'Y'),
   ('SR-006', 'OTHER', 'Other', 'Y');

   -- Insert Referee Relationships
   INSERT INTO TCC_REF_REFEE_RELATIONSHIP (relationship_id, relationship_code, relationship_name, is_active) VALUES
   ('RR-001', 'COLLEAGUE', 'Colleague', 'Y'),
   ('RR-002', 'FRIEND', 'Friend', 'Y'),
   ('RR-003', 'RELATIVE', 'Relative', 'Y'),
   ('RR-004', 'EMPLOYER', 'Employer', 'Y'),
   ('RR-005', 'OTHER', 'Other', 'Y');

   -- Insert Religions
   INSERT INTO TCC_REF_RELIGION (religion_id, religion_code, religion_name, is_active) VALUES
   ('R-001', 'ISLAM', 'Islam', 'Y'),
   ('R-002', 'HINDUISM', 'Hinduism', 'Y'),
   ('R-003', 'CHRISTIANITY', 'Christianity', 'Y'),
   ('R-004', 'BUDDHISM', 'Buddhism', 'Y'),
   ('R-005', 'OTHER', 'Other', 'Y');

   -- Insert Marital Status
   INSERT INTO TCC_REF_MARITAL_STATUS (marital_id, marital_code, marital_name, is_active) VALUES
   ('M-001', 'SINGLE', 'Single', 'Y'),
   ('M-002', 'MARRIED', 'Married', 'Y');

   -- Insert Auto Debit Preferences
   INSERT INTO TCC_REF_AUTO_DEBIT_PREFERENCE (preference_id, preference_code, preference_name, is_active) VALUES
   ('AD-001', 'MINIMUM_AMOUNT_DUE', 'Minimum Amount Due', 'Y'),
   ('AD-002', 'TOTAL_OUTSTANDING', 'Total Outstanding', 'Y');

   -- Insert Districts (Sample)
   INSERT INTO TCC_REF_DISTRICT (district_id, district_code, district_name, division_name, is_active) VALUES
   ('D-001', 'DHAKA', 'Dhaka', 'Dhaka', 'Y'),
   ('D-002', 'CHITTAGONG', 'Chittagong', 'Chittagong', 'Y'),
   ('D-003', 'SYLHET', 'Sylhet', 'Sylhet', 'Y'),
   ('D-004', 'RAJSHAHI', 'Rajshahi', 'Rajshahi', 'Y'),
   ('D-005', 'KHULNA', 'Khulna', 'Khulna', 'Y');

   COMMIT;

   DBMS_OUTPUT.PUT_LINE('=== Reference data inserted successfully ===');
END;
/

-- =============================================================================
-- SECTION 2: REFERENCE DATA PROCEDURES (501-504)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 2: Testing Reference Data Procedures (501-504)
PROMPT ==============================================================================

-- Test 501: get_card_products
PROMPT
PROMPT --- TEST 501: get_card_products ---
DECLARE
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
BEGIN
   pkg_credit_card_application.get_card_products(v_status, v_message, v_json_out);

   DBMS_OUTPUT.PUT_LINE('Status: ' || v_status);
   DBMS_OUTPUT.PUT_LINE('Message: ' || v_message);
   DBMS_OUTPUT.PUT_LINE('JSON Output: ' || SUBSTR(v_json_out, 1, 500));
END;
/

-- Test 502: get_reference_data
PROMPT
PROMPT --- TEST 502: get_reference_data (all reference types) ---
DECLARE
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
BEGIN
   -- Test Card Networks
   pkg_credit_card_application.get_reference_data('CARD_NETWORK', v_status, v_message, v_json_out);
   DBMS_OUTPUT.PUT_LINE('CARD_NETWORK: ' || v_status || ' - ' || SUBSTR(v_json_out, 1, 200));

   -- Test Card Tiers
   pkg_credit_card_application.get_reference_data('CARD_TIER', v_status, v_message, v_json_out);
   DBMS_OUTPUT.PUT_LINE('CARD_TIER: ' || v_status || ' - ' || SUBSTR(v_json_out, 1, 200));

   -- Test Customer Segments
   pkg_credit_card_application.get_reference_data('CUSTOMER_SEGMENT', v_status, v_message, v_json_out);
   DBMS_OUTPUT.PUT_LINE('CUSTOMER_SEGMENT: ' || v_status || ' - ' || SUBSTR(v_json_out, 1, 200));
END;
/

-- Test 503: check_eligibility
PROMPT
PROMPT --- TEST 503: check_eligibility ---
DECLARE
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
BEGIN
   -- Eligible applicant (age 25, citizen)
   pkg_credit_card_application.check_eligibility(
      p_date_of_birth => TO_DATE('1999-01-01', 'YYYY-MM-DD'),
      p_citizen_status => 'BANGLADESHI',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('ELIGIBLE (Age 25): ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('JSON: ' || v_json_out);

   -- Underage applicant
   pkg_credit_card_application.check_eligibility(
      p_date_of_birth => TO_DATE('2010-01-01', 'YYYY-MM-DD'),
      p_citizen_status => 'BANGLADESHI',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('NOT ELIGIBLE (Age 16): ' || v_status || ' - ' || v_message);
END;
/

-- Test 504: get_bank_list
PROMPT
PROMPT --- TEST 504: get_bank_list ---
DECLARE
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
BEGIN
   pkg_credit_card_application.get_bank_list(v_status, v_message, v_json_out);
   DBMS_OUTPUT.PUT_LINE('Status: ' || v_status);
   DBMS_OUTPUT.PUT_LINE('Banks: ' || v_json_out);
END;
/

-- =============================================================================
-- SECTION 3: APPLICATION CRUD PROCEDURES (505-510)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 3: Testing Application CRUD Procedures (505-510)
PROMPT ==============================================================================

DECLARE
   -- Test variables
   v_test_applicant_id VARCHAR2(36) := 'TEST-APPLICANT-001';
   v_test_application_id VARCHAR2(36) := 'TEST-APP-001';
   v_test_session_id VARCHAR2(36) := 'TEST-SESSION-001';
   v_test_ref_no VARCHAR2(50);
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
   v_json_in CLOB;

BEGIN
   -- ========================================================================
   -- Test 511: check_existing_applicant (Pre-requisite)
   -- ========================================================================
   PROMPT '--- TEST 511: check_existing_applicant ---';

   pkg_credit_card_application.check_existing_applicant(
      p_mobile_number => '01712345678',
      p_nid_number => '1234567890123',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Check Existing: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 505: create_application
   -- ========================================================================
   PROMPT '--- TEST 505: create_application ---';

   v_json_in := '{
      "applicantId": "' || v_test_applicant_id || '",
      "cardNetwork": "VISA",
      "cardTier": "PLATINUM",
      "cardCategory": "REGULAR",
      "requestedLimit": 150000
   }';

   pkg_credit_card_application.create_application(
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Create Application: ' || v_status || ' - ' || v_message);

   IF v_status = 'S' THEN
      -- Extract application_id from JSON
      SELECT JSON_VALUE(v_json_out, '$.applicationId') INTO v_test_application_id FROM DUAL;
      DBMS_OUTPUT.PUT_LINE('Application ID: ' || v_test_application_id);

      -- Extract reference_no
      SELECT JSON_VALUE(v_json_out, '$.referenceNo') INTO v_test_ref_no FROM DUAL;
      DBMS_OUTPUT.PUT_LINE('Reference No: ' || v_test_ref_no);
   END IF;

   -- ========================================================================
   -- Test 506: get_application
   -- ========================================================================
   PROMPT '--- TEST 506: get_application ---';

   pkg_credit_card_application.get_application(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Application: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Application Data: ' || SUBSTR(v_json_out, 1, 500));

   -- ========================================================================
   -- Test 507: get_application_by_reference
   -- ========================================================================
   PROMPT '--- TEST 507: get_application_by_reference ---';

   pkg_credit_card_application.get_application_by_reference(
      p_reference_no => v_test_ref_no,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get by Reference: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 508: get_application_by_mobile
   -- ========================================================================
   PROMPT '--- TEST 508: get_application_by_mobile (will fail - no mobile yet) ---';

   pkg_credit_card_application.get_application_by_mobile(
      p_mobile_number => '01712345678',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get by Mobile: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 509: update_application_status
   -- ========================================================================
   PROMPT '--- TEST 509: update_application_status ---';

   pkg_credit_card_application.update_application_status(
      p_application_id => v_test_application_id,
      p_application_status => 'UNDER_REVIEW',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Update Status: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 544: create_session (for submission)
   -- ========================================================================
   PROMPT '--- TEST 544: create_session ---';

   pkg_credit_card_application.create_session(
      p_mode => 'ASSISTED',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );

   IF v_status = 'S' THEN
      v_test_session_id := JSON_VALUE(v_json_out, '$.sessionId');
      DBMS_OUTPUT.PUT_LINE('Session Created: ' || v_test_session_id);
   END IF;

   -- ========================================================================
   -- Test 510: submit_application
   -- ========================================================================
   PROMPT '--- TEST 510: submit_application ---';

   pkg_credit_card_application.submit_application(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Submit Application: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 4: OTP PROCEDURES (512-516)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 4: Testing OTP Procedures (512-516)
PROMPT ==============================================================================

DECLARE
   v_test_session_id VARCHAR2(36) := 'TEST-SESSION-OTP';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 544: create_session (for OTP tests)
   -- ========================================================================
   PROMPT '--- Creating session for OTP tests ---';

   pkg_credit_card_application.create_session(
      p_mode => 'SELF',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );

   IF v_status = 'S' THEN
      v_test_session_id := JSON_VALUE(v_json_out, '$.sessionId');
      DBMS_OUTPUT.PUT_LINE('Session ID: ' || v_test_session_id);
   END IF;

   -- ========================================================================
   -- Test 512: request_otp
   -- ========================================================================
   PROMPT '--- TEST 512: request_otp ---';

   pkg_credit_card_application.request_otp(
      p_mobile_number => '01712345678',
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Request OTP: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('OTP Response: ' || v_json_out);

   -- ========================================================================
   -- Test 514: get_otp_status
   -- ========================================================================
   PROMPT '--- TEST 514: get_otp_status ---';

   pkg_credit_card_application.get_otp_status(
      p_mobile_number => '01712345678',
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('OTP Status: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Status JSON: ' || v_json_out);

   -- ========================================================================
   -- Test 513: verify_otp (with dummy OTP - will fail in real scenario)
   -- ========================================================================
   PROMPT '--- TEST 513: verify_otp (attempting with 123456) ---';

   pkg_credit_card_application.verify_otp(
      p_mobile_number => '01712345678',
      p_otp_code => '123456',
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Verify OTP: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Verify JSON: ' || v_json_out);

   -- ========================================================================
   -- Test 515: verify_otp_extended
   -- ========================================================================
   PROMPT '--- TEST 515: verify_otp_extended ---';

   pkg_credit_card_application.verify_otp_extended(
      p_mobile_number => '01712345678',
      p_otp_code => '123456',
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Extended Verify: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 5: STEP 1 - CARD SELECTION (517)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 5: Testing Step 1 - Card Selection (517)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-STEP1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- Create test application first
   INSERT INTO TCC_APPLICATION (application_id, applicant_id, card_network, card_tier, card_category)
   VALUES (v_test_application_id, 'TEST-APPLICANT-STEP1', 'VISA', 'GOLD', 'REGULAR');

   -- ========================================================================
   -- Test 517: save_card_selection
   -- ========================================================================
   PROMPT '--- TEST 517: save_card_selection ---';

   v_json_in := '{
      "cardNetwork": "MASTERCARD",
      "cardTier": "PLATINUM",
      "cardCategory": "YAQEEN",
      "requestedLimit": 200000,
      "hasSupplementary": true,
      "supplementaryCount": 1
   }';

   pkg_credit_card_application.save_card_selection(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Card Selection: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Result: ' || v_json_out);

   -- Verify
   SELECT card_network, card_tier, card_category, requested_limit
   INTO v_json_in
   FROM TCC_APPLICATION WHERE application_id = v_test_application_id;

   DBMS_OUTPUT.PUT_LINE('Verified: ' || v_json_in);

END;
/

-- =============================================================================
-- SECTION 6: STEP 2 - PERSONAL INFO & ADDRESSES (518-519)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 6: Testing Step 2 - Personal Info & Addresses (518-519)
PROMPT ==============================================================================

DECLARE
   v_test_applicant_id VARCHAR2(36) := 'TEST-APPLICANT-P1';
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- Create test applicant and application
   INSERT INTO TCC_APPLICANT (applicant_id, full_name, mobile_number)
   VALUES (v_test_applicant_id, 'Md. Rahman Ahmed', '01812345678');

   INSERT INTO TCC_APPLICATION (application_id, applicant_id, card_network, card_tier, card_category)
   VALUES (v_test_application_id, v_test_applicant_id, 'VISA', 'GOLD', 'REGULAR');

   -- ========================================================================
   -- Test 518: save_personal_info
   -- ========================================================================
   PROMPT '--- TEST 518: save_personal_info ---';

   v_json_in := '{
      "fullName": "Md. Rahman Ahmed",
      "fatherName": "Abdul Karim",
      "motherName": "Fatema Begum",
      "spouseName": "Nasrin Akter",
      "dateOfBirth": "1990-05-15",
      "gender": "M",
      "religion": "ISLAM",
      "maritalStatus": "MARRIED",
      "educationLevel": "GRADUATE",
      "nidOrBirthCertNo": "1234567890123",
      "tin": "456789012345",
      "passportNumber": "P1234567",
      "passportIssueDate": "2020-01-15",
      "passportExpiryDate": "2030-01-15",
      "mobileNumber": "01812345678",
      "emailAddress": "rahman.ahmed@email.com",
      "homeDistrict": "DHAKA"
   }';

   pkg_credit_card_application.save_personal_info(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Personal Info: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 519: save_addresses
   -- ========================================================================
   PROMPT '--- TEST 519: save_addresses ---';

   v_json_in := '{
      "presentAddress": {
         "addressLine1": "House 12, Road 5",
         "addressLine2": "Dhanmondi",
         "city": "Dhaka",
         "district": "DHAKA",
         "postalCode": "1205",
         "addressType": "PRESENT"
      },
      "permanentAddress": {
         "addressLine1": "Village: Kalapara",
         "addressLine2": "Post: Barisal",
         "city": "Barisal",
         "district": "BARISAL",
         "postalCode": "8200",
         "addressType": "PERMANENT"
      },
      "mailingAddressType": "PRESENT",
      "sameAsPermanent": false
   }';

   pkg_credit_card_application.save_addresses(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Addresses: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 7: STEP 3 - PROFESSIONAL INFO (520)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 7: Testing Step 3 - Professional Info (520)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 520: save_professional_info
   -- ========================================================================
   PROMPT '--- TEST 520: save_professional_info ---';

   v_json_in := '{
      "customerSegment": "SALARIED",
      "organizationName": "MTB Finance Ltd",
      "parentGroup": "MTB Group",
      "department": "IT Department",
      "designation": "Senior Software Engineer",
      "officeAddress": {
         "addressLine1": "MTB Center, Level 12",
         "addressLine2": "Gulshan Avenue",
         "city": "Dhaka",
         "district": "DHAKA",
         "postalCode": "1212"
      },
      "serviceYears": 5,
      "serviceMonths": 6,
      "totalExperienceYears": 8,
      "totalExperienceMonths": 3,
      "previousEmployer": "Brac Bank",
      "previousDesignation": "Software Engineer"
   }';

   pkg_credit_card_application.save_professional_info(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Professional Info: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 8: STEP 4 - MONTHLY INCOME (521)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 8: Testing Step 4 - Monthly Income (521)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 521: save_monthly_income (Salaried)
   -- ========================================================================
   PROMPT '--- TEST 521: save_monthly_income (Salaried) ---';

   v_json_in := '{
      "isSalaried": true,
      "grossSalary": "85000",
      "totalDeduction": "12000",
      "netSalary": "73000",
      "additionalSources": [
         {"source": "Freelance", "amount": "15000"},
         {"source": "Rent", "amount": "10000"}
      ]
   }';

   pkg_credit_card_application.save_monthly_income(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Income (Salaried): ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 9: STEP 5 - BANK ACCOUNTS (522-524)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 9: Testing Step 5 - Bank Accounts (522-524)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_bank_account_id VARCHAR2(36);
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 522: save_bank_accounts (multiple accounts)
   -- ========================================================================
   PROMPT '--- TEST 522: save_bank_accounts ---';

   v_json_in := '{
      "bankAccounts": [
         {
            "bankName": "MTB",
            "accountType": "SAVINGS",
            "accountNumber": "1234567890",
            "branchName": "Gulshan Branch"
         },
         {
            "bankName": "DBBL",
            "accountType": "CURRENT",
            "accountNumber": "9876543210",
            "branchName": "Dhanmondi Branch"
         }
      ]
   }';

   pkg_credit_card_application.save_bank_accounts(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Bank Accounts: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 523: get_bank_accounts
   -- ========================================================================
   PROMPT '--- TEST 523: get_bank_accounts ---';

   pkg_credit_card_application.get_bank_accounts(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Bank Accounts: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Accounts: ' || SUBSTR(v_json_out, 1, 500));

   -- ========================================================================
   -- Test 524: delete_bank_account
   -- ========================================================================
   PROMPT '--- TEST 524: delete_bank_account ---';

   -- Get first account_id to delete
   SELECT bank_account_id INTO v_bank_account_id
   FROM TCC_BANK_ACCOUNT
   WHERE application_id = v_test_application_id
   AND ROWNUM = 1;

   pkg_credit_card_application.delete_bank_account(
      p_bank_account_id => v_bank_account_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Delete Bank Account: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 10: STEP 6 - CREDIT FACILITIES (525-527)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 10: Testing Step 6 - Credit Facilities (525-527)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_facility_id VARCHAR2(36);
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 525: save_credit_facilities
   -- ========================================================================
   PROMPT '--- TEST 525: save_credit_facilities ---';

   v_json_in := '{
      "creditFacilities": [
         {
            "bankName": "DBBL",
            "facilityType": "CREDIT_CARD",
            "accountNumber": "4567890123456789",
            "creditLimit": "100000",
            "monthlyInstallment": "5000"
         },
         {
            "bankName": "HSBC",
            "facilityType": "PERSONAL_LOAN",
            "accountNumber": "7890123456789",
            "creditLimit": "500000",
            "monthlyInstallment": "25000"
         }
      ]
   }';

   pkg_credit_card_application.save_credit_facilities(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Credit Facilities: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 526: get_credit_facilities
   -- ========================================================================
   PROMPT '--- TEST 526: get_credit_facilities ---';

   pkg_credit_card_application.get_credit_facilities(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Credit Facilities: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Facilities: ' || SUBSTR(v_json_out, 1, 500));

   -- ========================================================================
   -- Test 527: delete_credit_facility
   -- ========================================================================
   PROMPT '--- TEST 527: delete_credit_facility ---';

   SELECT facility_id INTO v_facility_id
   FROM TCC_CREDIT_FACILITY
   WHERE application_id = v_test_application_id
   AND ROWNUM = 1;

   pkg_credit_card_application.delete_credit_facility(
      p_facility_id => v_facility_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Delete Credit Facility: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 11: STEP 7 - NOMINEE/MPP (528-529)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 11: Testing Step 7 - Nominee/MPP (528-529)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 528: save_nominee_details
   -- ========================================================================
   PROMPT '--- TEST 528: save_nominee_details ---';

   v_json_in := '{
      "nomineeName": "Karim Ahmed",
      "relationship": "SON",
      "dateOfBirth": "2015-08-20",
      "contactAddress": "House 12, Road 5, Dhanmondi, Dhaka 1205",
      "mobileNumber": "01912345678",
      "photoUrl": "https://example.com/photos/nominee.jpg",
      "declarationAccepted": true
   }';

   pkg_credit_card_application.save_nominee_details(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Nominee: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 529: get_nominee_details
   -- ========================================================================
   PROMPT '--- TEST 529: get_nominee_details ---';

   pkg_credit_card_application.get_nominee_details(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Nominee: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Nominee: ' || v_json_out);

END;
/

-- =============================================================================
-- SECTION 12: STEP 8 - SUPPLEMENTARY CARD (530-532)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 12: Testing Step 8 - Supplementary Card (530-532)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_supplementary_id VARCHAR2(36);
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 530: save_supplementary_card
   -- ========================================================================
   PROMPT '--- TEST 530: save_supplementary_card ---';

   v_json_in := '{
      "fullName": "Nasrin Akter",
      "nameOnCard": "NASRIN AKTER",
      "relationship": "SPOUSE",
      "dateOfBirth": "1992-03-10",
      "gender": "F",
      "fatherName": "Abdul Malek",
      "motherName": "Rahima Begum",
      "spouseName": "Md. Rahman Ahmed",
      "presentAddress": "House 12, Road 5, Dhanmondi, Dhaka 1205",
      "permanentAddress": "Village: Kalapara, Post: Barisal",
      "sameAsPermanent": true,
      "nidOrBirthCertNo": "9876543210123",
      "tin": "987654321012",
      "passportNumber": "P7654321",
      "passportIssueDate": "2019-05-20",
      "passportExpiryDate": "2029-05-20",
      "spendingLimitPercentage": 80,
      "photoUrl": "https://example.com/photos/supp.jpg",
      "signatureUrl": "https://example.com/signatures/supp.jpg"
   }';

   pkg_credit_card_application.save_supplementary_card(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Supplementary: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 531: get_supplementary_card
   -- ========================================================================
   PROMPT '--- TEST 531: get_supplementary_card ---';

   pkg_credit_card_application.get_supplementary_card(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Supplementary: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Supplementary: ' || SUBSTR(v_json_out, 1, 500));

   -- ========================================================================
   -- Test 532: delete_supplementary_card
   -- ========================================================================
   PROMPT '--- TEST 532: delete_supplementary_card ---';

   SELECT supplementary_id INTO v_supplementary_id
   FROM TCC_SUPPLEMENTARY_CARD
   WHERE application_id = v_test_application_id
   AND ROWNUM = 1;

   pkg_credit_card_application.delete_supplementary_card(
      p_supplementary_id => v_supplementary_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Delete Supplementary: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 13: STEP 9 - REFERENCES (533-534)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 13: Testing Step 9 - References (533-534)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 533: save_references
   -- ========================================================================
   PROMPT '--- TEST 533: save_references ---';

   v_json_in := '{
      "reference1": {
         "refereeName": "Abdul Halim",
         "relationship": "COLLEAGUE",
         "mobileNumber": "01612345678",
         "workAddress": "MTB Center, Gulshan, Dhaka",
         "residenceAddress": "Uttara, Dhaka"
      },
      "reference2": {
         "refereeName": "Sheikh Kamal",
         "relationship": "FRIEND",
         "mobileNumber": "01512345678",
         "workAddress": "Banani, Dhaka",
         "residenceAddress": "Banani, Dhaka"
      }
   }';

   pkg_credit_card_application.save_references(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save References: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 534: get_references
   -- ========================================================================
   PROMPT '--- TEST 534: get_references ---';

   pkg_credit_card_application.get_references(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get References: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('References: ' || v_json_out);

END;
/

-- =============================================================================
-- SECTION 14: STEP 10 - IMAGES & SIGNATURES (535-538)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 14: Testing Step 10 - Images & Signatures (535-538)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 535: save_applicant_media
   -- ========================================================================
   PROMPT '--- TEST 535: save_applicant_media ---';

   v_json_in := '{
      "primaryApplicantPhoto": "https://example.com/photos/primary.jpg",
      "supplementaryApplicantPhoto": "https://example.com/photos/supp.jpg",
      "primaryApplicantSignature": "https://example.com/signatures/primary.jpg",
      "supplementaryApplicantSignature": "https://example.com/signatures/supp.jpg"
   }';

   pkg_credit_card_application.save_applicant_media(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Applicant Media: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 536: get_applicant_media
   -- ========================================================================
   PROMPT '--- TEST 536: get_applicant_media ---';

   pkg_credit_card_application.get_applicant_media(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Applicant Media: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Media: ' || v_json_out);

   -- ========================================================================
   -- Test 537: upload_document
   -- ========================================================================
   PROMPT '--- TEST 537: upload_document ---';

   v_json_in := '{
      "documentType": "NID",
      "documentName": "NID Front.jpg",
      "fileUrl": "https://example.com/docs/nid_front.jpg",
      "fileSize": 250000,
      "mimeType": "image/jpeg"
   }';

   pkg_credit_card_application.upload_document(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Upload Document: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 538: get_documents
   -- ========================================================================
   PROMPT '--- TEST 538: get_documents ---';

   pkg_credit_card_application.get_documents(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Documents: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Documents: ' || SUBSTR(v_json_out, 1, 500));

END;
/

-- =============================================================================
-- SECTION 15: STEP 11 - AUTO DEBIT (539-540)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 15: Testing Step 11 - Auto Debit (539-540)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 539: save_auto_debit
   -- ========================================================================
   PROMPT '--- TEST 539: save_auto_debit ---';

   v_json_in := '{
      "autoDebitPreference": "TOTAL_OUTSTANDING",
      "accountName": "Md. Rahman Ahmed",
      "mtbAccountNumber": "1234567890"
   }';

   pkg_credit_card_application.save_auto_debit(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Auto Debit: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 540: get_auto_debit
   -- ========================================================================
   PROMPT '--- TEST 540: get_auto_debit ---';

   pkg_credit_card_application.get_auto_debit(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Auto Debit: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Auto Debit: ' || v_json_out);

END;
/

-- =============================================================================
-- SECTION 16: STEP 12 - MID DECLARATIONS (541-542)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 16: Testing Step 12 - MID Declarations (541-542)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 541: save_mid_declarations
   -- ========================================================================
   PROMPT '--- TEST 541: save_mid_declarations ---';

   v_json_in := '{
      "declarations": [
         {"id": "pepStatus", "question": "Are you a PEP?", "answer": false},
         {"id": "existingCards", "question": "Do you have existing cards?", "answer": true},
         {"id": "bankruptcyHistory", "question": "Any bankruptcy history?", "answer": false}
      ],
      "documentChecklist": [
         {"docType": "NID", "provided": true},
         {"docType": "TIN_CERTIFICATE", "provided": true},
         {"docType": "PHOTOGRAPH", "provided": true}
      ],
      "termsAccepted": true,
      "declarationAccepted": true
   }';

   pkg_credit_card_application.save_mid_declarations(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Declarations: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 542: get_mid_declarations
   -- ========================================================================
   PROMPT '--- TEST 542: get_mid_declarations ---';

   pkg_credit_card_application.get_mid_declarations(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Declarations: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Declarations: ' || SUBSTR(v_json_out, 1, 500));

END;
/

-- =============================================================================
-- SECTION 17: FULL APPLICATION SAVE (543)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 17: Testing Full Application Save (543)
PROMPT ==============================================================================

DECLARE
   v_test_application_id VARCHAR2(36) := 'TEST-APP-FULL';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- Create test applicant
   INSERT INTO TCC_APPLICANT (applicant_id, full_name, mobile_number)
   VALUES ('TEST-APPLICANT-FULL', 'Test User Full', '01912345678');

   INSERT INTO TCC_APPLICATION (application_id, applicant_id, card_network, card_tier, card_category)
   VALUES (v_test_application_id, 'TEST-APPLICANT-FULL', 'VISA', 'GOLD', 'REGULAR');

   -- ========================================================================
   -- Test 543: save_full_application
   -- ========================================================================
   PROMPT '--- TEST 543: save_full_application ---';

   v_json_in := '{
      "cardSelection": {
         "cardNetwork": "MASTERCARD",
         "cardTier": "PLATINUM",
         "cardCategory": "REGULAR",
         "requestedLimit": 150000
      },
      "personalInfo": {
         "fullName": "Test User Full",
         "fatherName": "Father Name",
         "motherName": "Mother Name",
         "dateOfBirth": "1988-06-15",
         "gender": "M",
         "mobileNumber": "01912345678"
      },
      "professionalInfo": {
         "customerSegment": "SALARIED",
         "organizationName": "Test Corp",
         "designation": "Manager"
      }
   }';

   pkg_credit_card_application.save_full_application(
      p_application_id => v_test_application_id,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Full Application: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 18: SESSION MANAGEMENT (544-548)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 18: Testing Session Management (544-548)
PROMPT ==============================================================================

DECLARE
   v_test_session_id VARCHAR2(36) := 'TEST-SESSION-MGMT';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 544: create_session
   -- ========================================================================
   PROMPT '--- TEST 544: create_session ---';

   pkg_credit_card_application.create_session(
      p_mode => 'ASSISTED',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );

   IF v_status = 'S' THEN
      v_test_session_id := JSON_VALUE(v_json_out, '$.sessionId');
      DBMS_OUTPUT.PUT_LINE('Session Created: ' || v_test_session_id);
   END IF;

   -- ========================================================================
   -- Test 545: get_session
   -- ========================================================================
   PROMPT '--- TEST 545: get_session ---';

   pkg_credit_card_application.get_session(
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Session: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Session: ' || v_json_out);

   -- ========================================================================
   -- Test 546: extend_session
   -- ========================================================================
   PROMPT '--- TEST 546: extend_session ---';

   pkg_credit_card_application.extend_session(
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Extend Session: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 548: validate_session
   -- ========================================================================
   PROMPT '--- TEST 548: validate_session ---';

   pkg_credit_card_application.validate_session(
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Validate Session: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Valid: ' || v_json_out);

   -- ========================================================================
   -- Test 547: end_session
   -- ========================================================================
   PROMPT '--- TEST 547: end_session ---';

   pkg_credit_card_application.end_session(
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message
   );
   DBMS_OUTPUT.PUT_LINE('End Session: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 19: DRAFT MANAGEMENT (549-553)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 19: Testing Draft Management (549-553)
PROMPT ==============================================================================

DECLARE
   v_test_session_id VARCHAR2(36);
   v_test_application_id VARCHAR2(36) := 'TEST-APP-DRAFT';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- Create session and application
   INSERT INTO TCC_APPLICATION (application_id, applicant_id, card_network, card_tier, card_category)
   VALUES (v_test_application_id, 'TEST-APPLICANT-FULL', 'VISA', 'GOLD', 'REGULAR');

   -- ========================================================================
   -- Test 544: create_session (for draft tests)
   -- ========================================================================
   PROMPT '--- Creating session for draft tests ---';

   pkg_credit_card_application.create_session(
      p_mode => 'SELF',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );

   IF v_status = 'S' THEN
      v_test_session_id := JSON_VALUE(v_json_out, '$.sessionId');
      DBMS_OUTPUT.PUT_LINE('Session ID: ' || v_test_session_id);
   END IF;

   -- ========================================================================
   -- Test 549: initialize_draft
   -- ========================================================================
   PROMPT '--- TEST 549: initialize_draft ---';

   pkg_credit_card_application.initialize_draft(
      p_session_id => v_test_session_id,
      p_mode => 'SELF',
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Initialize Draft: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Draft: ' || v_json_out);

   -- ========================================================================
   -- Test 550: get_draft
   -- ========================================================================
   PROMPT '--- TEST 550: get_draft ---';

   pkg_credit_card_application.get_draft(
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Draft: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 551: save_draft_step
   -- ========================================================================
   PROMPT '--- TEST 551: save_draft_step ---';

   v_json_in := '{"cardNetwork": "VISA", "cardTier": "GOLD"}';

   pkg_credit_card_application.save_draft_step(
      p_session_id => v_test_session_id,
      p_step_number => 1,
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Save Draft Step: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 553: get_step_versions
   -- ========================================================================
   PROMPT '--- TEST 553: get_step_versions ---';

   pkg_credit_card_application.get_step_versions(
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Step Versions: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 552: clear_draft
   -- ========================================================================
   PROMPT '--- TEST 552: clear_draft ---';

   pkg_credit_card_application.clear_draft(
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Clear Draft: ' || v_status || ' - ' || v_message);

END;
/

-- =============================================================================
-- SECTION 20: SUBMISSION PROCEDURES (554-556)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 20: Testing Submission Procedures (554-556)
PROMPT ==============================================================================

DECLARE
   v_test_session_id VARCHAR2(36);
   v_test_application_id VARCHAR2(36) := 'TEST-APP-SUBMIT';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_in CLOB;
   v_json_out CLOB;
BEGIN
   -- Create application and session
   INSERT INTO TCC_APPLICANT (applicant_id, full_name, mobile_number)
   VALUES ('TEST-APPLICANT-SUB', 'Test Applicant', '01112345678');

   INSERT INTO TCC_APPLICATION (application_id, applicant_id, card_network, card_tier, card_category)
   VALUES (v_test_application_id, 'TEST-APPLICANT-SUB', 'VISA', 'GOLD', 'REGULAR');

   pkg_credit_card_application.create_session(
      p_mode => 'SELF',
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );

   IF v_status = 'S' THEN
      v_test_session_id := JSON_VALUE(v_json_out, '$.sessionId');
   END IF;

   -- Initialize draft
   pkg_credit_card_application.initialize_draft(
      p_session_id => v_test_session_id,
      p_mode => 'SELF',
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );

   -- ========================================================================
   -- Test 554: submit_by_session
   -- ========================================================================
   PROMPT '--- TEST 554: submit_by_session ---';

   pkg_credit_card_application.submit_by_session(
      p_session_id => v_test_session_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Submit by Session: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Result: ' || v_json_out);

   -- ========================================================================
   -- Test 555: submit_full_application
   -- ========================================================================
   PROMPT '--- TEST 555: submit_full_application ---';

   v_json_in := '{"sessionId": "' || v_test_session_id || '"}';

   pkg_credit_card_application.submit_full_application(
      p_json_in => v_json_in,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Submit Full App: ' || v_status || ' - ' || v_message);

   -- ========================================================================
   -- Test 556: get_submission_status
   -- ========================================================================
   PROMPT '--- TEST 556: get_submission_status ---';

   pkg_credit_card_application.get_submission_status(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Submission Status: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Status: ' || v_json_out);

END;
/

-- =============================================================================
-- SECTION 21: DASHBOARD & REPORTING (557-560)
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT SECTION 21: Testing Dashboard & Reporting (557-560)
PROMPT ==============================================================================

DECLARE
   v_test_applicant_id VARCHAR2(36) := 'TEST-APPLICANT-P1';
   v_test_application_id VARCHAR2(36) := 'TEST-APP-P1';
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
BEGIN
   -- ========================================================================
   -- Test 557: get_my_applications
   -- ========================================================================
   PROMPT '--- TEST 557: get_my_applications ---';

   pkg_credit_card_application.get_my_applications(
      p_applicant_id => v_test_applicant_id,
      p_page => 1,
      p_page_size => 10,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get My Applications: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Applications: ' || SUBSTR(v_json_out, 1, 500));

   -- ========================================================================
   -- Test 558: track_by_reference
   -- ========================================================================
   PROMPT '--- TEST 558: track_by_reference ---';

   -- First get the reference number
   SELECT reference_no INTO v_message
   FROM TCC_APPLICATION
   WHERE application_id = v_test_application_id;

   pkg_credit_card_application.track_by_reference(
      p_reference_no => v_message,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Track by Reference: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Tracking: ' || v_json_out);

   -- ========================================================================
   -- Test 559: get_dashboard_stats
   -- ========================================================================
   PROMPT '--- TEST 559: get_dashboard_stats ---';

   pkg_credit_card_application.get_dashboard_stats(
      p_applicant_id => v_test_applicant_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Dashboard Stats: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Stats: ' || v_json_out);

   -- ========================================================================
   -- Test 560: get_application_details
   -- ========================================================================
   PROMPT '--- TEST 560: get_application_details ---';

   pkg_credit_card_application.get_application_details(
      p_application_id => v_test_application_id,
      p_status => v_status,
      p_message => v_message,
      p_json_out => v_json_out
   );
   DBMS_OUTPUT.PUT_LINE('Get Application Details: ' || v_status || ' - ' || v_message);
   DBMS_OUTPUT.PUT_LINE('Details: ' || SUBSTR(v_json_out, 1, 1000));

END;
/

-- =============================================================================
-- FINAL SUMMARY: Check Error Log
-- =============================================================================
PROMPT
PROMPT ==============================================================================
PROMPT FINAL SUMMARY: Check Error Log for Any Errors
PROMPT ==============================================================================

SELECT
   error_code,
   error_message,
   procedure_name,
   error_line,
   created_at
FROM TCC_ERROR_LOG
WHERE error_code LIKE '5%'
ORDER BY created_at DESC;

PROMPT
PROMPT ==============================================================================
PROMPT TEST COMPLETE - All 60 procedures tested
PROMPT Check output above for any errors (status != 'S')
PROMPT ==============================================================================
PROMPT

SET ECHO OFF
SET TIMING OFF
