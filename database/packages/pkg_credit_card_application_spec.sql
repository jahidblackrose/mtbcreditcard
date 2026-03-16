-- =============================================================================
-- MTB Credit Card Application System - Comprehensive Package Specification
-- Package: pkg_credit_card_application
-- Every procedure has OUT p_status, p_message. Error codes: 501, 502, ... (package level)
-- Extended to support full 12-step application form
-- =============================================================================

CREATE OR REPLACE PACKAGE pkg_credit_card_application AS
  -- ---------------------------------------------------------------------------
  -- REFERENCE DATA (501-504)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_card_products(
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  );
  PROCEDURE get_reference_data(
    p_type     IN  VARCHAR2, -- 'NETWORKS', 'TIERS', 'CATEGORIES', 'DISTRICTS', etc.
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  );
  PROCEDURE check_eligibility(
    p_monthly_income IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );
  PROCEDURE get_bank_list(
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- APPLICATION CRUD (505-510)
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
  );
  PROCEDURE get_application(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );
  PROCEDURE get_application_by_reference(
    p_reference_number IN  VARCHAR2,
    p_status           OUT VARCHAR2,
    p_message          OUT VARCHAR2,
    p_json_out         OUT CLOB
  );
  PROCEDURE get_application_by_mobile(
    p_mobile_number IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  );
  PROCEDURE update_application_status(
    p_application_id IN  VARCHAR2,
    p_new_status     IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE submit_application(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- STEP 0: PRE-APPLICATION & OTP (511-516)
  -- ---------------------------------------------------------------------------
  PROCEDURE check_existing_applicant(
    p_nid_number  IN  VARCHAR2,
    p_mobile      IN  VARCHAR2,
    p_status      OUT VARCHAR2,
    p_message     OUT VARCHAR2,
    p_json_out    OUT CLOB
  );
  PROCEDURE request_otp(
    p_mobile_number IN  VARCHAR2,
    p_session_id    IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  );
  PROCEDURE verify_otp(
    p_mobile_number IN  VARCHAR2,
    p_otp           IN  VARCHAR2,
    p_session_id    IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  );
  PROCEDURE get_otp_status(
    p_mobile_number IN  VARCHAR2,
    p_session_id    IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  );
  PROCEDURE verify_otp_extended(
    p_mobile_number IN  VARCHAR2,
    p_otp           IN  VARCHAR2,
    p_session_id    IN  VARCHAR2,
    p_status        OUT VARCHAR2,
    p_message       OUT VARCHAR2,
    p_json_out      OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- STEP 1: CARD SELECTION (517)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_card_selection(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );

  -- ---------------------------------------------------------------------------
  -- STEP 2: PERSONAL INFO (518-519)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_personal_info(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE save_addresses(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );

  -- ---------------------------------------------------------------------------
  -- STEP 3: PROFESSIONAL INFO (520)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_professional_info(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );

  -- ---------------------------------------------------------------------------
  -- STEP 4: MONTHLY INCOME (521)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_monthly_income(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );

  -- ---------------------------------------------------------------------------
  -- STEP 5: BANK ACCOUNTS (522-524)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_bank_accounts(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,  -- JSON array of accounts
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE get_bank_accounts(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );
  PROCEDURE delete_bank_account(
    p_bank_account_id IN VARCHAR2,
    p_status          OUT VARCHAR2,
    p_message         OUT VARCHAR2
  );

  -- ---------------------------------------------------------------------------
  -- STEP 6: CREDIT FACILITIES (525-527)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_credit_facilities(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,  -- JSON array of facilities
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE get_credit_facilities(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );
  PROCEDURE delete_credit_facility(
    p_facility_id IN VARCHAR2,
    p_status       OUT VARCHAR2,
    p_message      OUT VARCHAR2
  );

  -- ---------------------------------------------------------------------------
  -- STEP 7: NOMINEE (MPP) (528-529)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_nominee_details(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE get_nominee_details(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- STEP 8: SUPPLEMENTARY CARD (530-532)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_supplementary_card(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE get_supplementary_card(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );
  PROCEDURE delete_supplementary_card(
    p_supplementary_id IN VARCHAR2,
    p_status           OUT VARCHAR2,
    p_message          OUT VARCHAR2
  );

  -- ---------------------------------------------------------------------------
  -- STEP 9: REFERENCES (533-534)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_references(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,  -- JSON with reference1 and reference2
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE get_references(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- STEP 10: IMAGES & SIGNATURES (535-538)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_applicant_media(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE get_applicant_media(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );
  PROCEDURE upload_document(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );
  PROCEDURE get_documents(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- STEP 11: AUTO DEBIT (539-540)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_auto_debit(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE get_auto_debit(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- STEP 12: MID DECLARATIONS (541-542)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_mid_declarations(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );
  PROCEDURE get_mid_declarations(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- FULL APPLICATION SAVE (543)
  -- ---------------------------------------------------------------------------
  PROCEDURE save_full_application(
    p_application_id IN  VARCHAR2,
    p_json_in        IN  CLOB,  -- Complete FullApplicationData as JSON
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2
  );

  -- ---------------------------------------------------------------------------
  -- SESSION MANAGEMENT (544-548)
  -- ---------------------------------------------------------------------------
  PROCEDURE create_session(
    p_mode     IN  VARCHAR2,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  );
  PROCEDURE get_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  );
  PROCEDURE extend_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  );
  PROCEDURE end_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2
  );
  PROCEDURE validate_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- DRAFT MANAGEMENT (549-553)
  -- ---------------------------------------------------------------------------
  PROCEDURE initialize_draft(
    p_session_id IN  VARCHAR2,
    p_mode       IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  );
  PROCEDURE get_draft(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  );
  PROCEDURE save_draft_step(
    p_session_id  IN  VARCHAR2,
    p_step_number IN  NUMBER,
    p_step_name   IN  VARCHAR2,
    p_data        IN  CLOB,
    p_is_complete IN  CHAR DEFAULT 'N',
    p_status      OUT VARCHAR2,
    p_message     OUT VARCHAR2,
    p_json_out    OUT CLOB
  );
  PROCEDURE clear_draft(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2
  );
  PROCEDURE get_step_versions(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- SUBMISSION (554-556)
  -- ---------------------------------------------------------------------------
  PROCEDURE submit_by_session(
    p_session_id IN  VARCHAR2,
    p_status     OUT VARCHAR2,
    p_message    OUT VARCHAR2,
    p_json_out   OUT CLOB
  );
  PROCEDURE submit_full_application(
    p_json_in  IN  CLOB,  -- Complete application data
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  );
  PROCEDURE get_submission_status(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- DASHBOARD & REPORTING (557-560)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_my_applications(
    p_user_id  IN  VARCHAR2,
    p_page     IN  NUMBER DEFAULT 1,
    p_limit    IN  NUMBER DEFAULT 10,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  );
  PROCEDURE track_by_reference(
    p_reference_number IN  VARCHAR2,
    p_status           OUT VARCHAR2,
    p_message          OUT VARCHAR2,
    p_json_out         OUT CLOB
  );
  PROCEDURE get_dashboard_stats(
    p_branch_id IN  VARCHAR2,
    p_status    OUT VARCHAR2,
    p_message   OUT VARCHAR2,
    p_json_out  OUT CLOB
  );
  PROCEDURE get_application_details(
    p_application_id IN  VARCHAR2,
    p_status         OUT VARCHAR2,
    p_message        OUT VARCHAR2,
    p_json_out       OUT CLOB
  );

  -- ---------------------------------------------------------------------------
  -- ADDITIONAL FEATURES (561-562)
  -- ---------------------------------------------------------------------------
  PROCEDURE get_all_applications(
    p_json_in  IN  CLOB,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  );
  PROCEDURE get_application_timeline(
    p_json_in  IN  CLOB,
    p_status   OUT VARCHAR2,
    p_message  OUT VARCHAR2,
    p_json_out OUT CLOB
  );

END pkg_credit_card_application;
/
