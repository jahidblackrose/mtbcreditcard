-- =============================================================================
-- MTB Credit Card Application System - Extended Entities (TCC_ prefix)
-- Additional tables to support full application form with all 12 steps
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Supplementary Card Holders
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_SUPPLEMENTARY_CARD (
    supplementary_id    VARCHAR2(36)   NOT NULL,
    application_id      VARCHAR2(36)   NOT NULL,
    full_name           VARCHAR2(200)  NOT NULL,
    name_on_card        VARCHAR2(200)  NOT NULL,
    relationship        VARCHAR2(30)   NOT NULL,
    date_of_birth       DATE           NOT NULL,
    gender              CHAR(1)        NOT NULL,
    father_name         VARCHAR2(200)  NOT NULL,
    mother_name         VARCHAR2(200)  NOT NULL,
    spouse_name         VARCHAR2(200),
    present_address     CLOB,
    permanent_address   CLOB,
    same_as_permanent   CHAR(1)        DEFAULT 'Y' NOT NULL,
    nid_or_birth_cert   VARCHAR2(50)   NOT NULL,
    tin                 VARCHAR2(30),
    passport_number     VARCHAR2(50),
    passport_issue_date DATE,
    passport_expiry_date DATE,
    spending_limit_pct  NUMBER(3)      DEFAULT 100 NOT NULL,
    photo_url           VARCHAR2(500),
    signature_url       VARCHAR2(500),
    created_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_supplementary PRIMARY KEY (supplementary_id),
    CONSTRAINT fk_tcc_supplementary_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_supplementary_gender CHECK (gender IN ('M','F','O')),
    CONSTRAINT chk_tcc_supplementary_same_permanent CHECK (same_as_permanent IN ('Y','N')),
    CONSTRAINT chk_tcc_supplementary_spending_pct CHECK (spending_limit_pct BETWEEN 1 AND 100)
);
CREATE INDEX idx_tcc_supplementary_app ON TCC_SUPPLEMENTARY_CARD(application_id);

-- -----------------------------------------------------------------------------
-- Bank Accounts
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_BANK_ACCOUNT (
    bank_account_id    VARCHAR2(36)   NOT NULL,
    application_id     VARCHAR2(36)   NOT NULL,
    bank_name          VARCHAR2(100)  NOT NULL,
    account_type       VARCHAR2(30)   NOT NULL,
    account_number     VARCHAR2(50)   NOT NULL,
    branch_name        VARCHAR2(100)  NOT NULL,
    created_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_bank_account PRIMARY KEY (bank_account_id),
    CONSTRAINT fk_tcc_bank_account_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_bank_account_type CHECK (account_type IN ('SAVINGS','CURRENT','FDR','DPS','OTHER'))
);
CREATE INDEX idx_tcc_bank_account_app ON TCC_BANK_ACCOUNT(application_id);

-- -----------------------------------------------------------------------------
-- Credit Facilities (Existing Cards/Loans)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_CREDIT_FACILITY (
    facility_id        VARCHAR2(36)   NOT NULL,
    application_id     VARCHAR2(36)   NOT NULL,
    bank_name          VARCHAR2(100)  NOT NULL,
    facility_type      VARCHAR2(30)   NOT NULL,
    account_number     VARCHAR2(50)   NOT NULL,
    credit_limit       VARCHAR2(30)   NOT NULL,
    monthly_installment VARCHAR2(30)   NOT NULL,
    created_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_credit_facility PRIMARY KEY (facility_id),
    CONSTRAINT fk_tcc_credit_facility_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_facility_type CHECK (facility_type IN ('CREDIT_CARD','HOME_LOAN','CAR_LOAN','PERSONAL_LOAN','OTHER'))
);
CREATE INDEX idx_tcc_credit_facility_app ON TCC_CREDIT_FACILITY(application_id);

-- -----------------------------------------------------------------------------
-- References (Two Mandatory References)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REFERENCE (
    reference_id       VARCHAR2(36)   NOT NULL,
    application_id     VARCHAR2(36)   NOT NULL,
    reference_sequence NUMBER(2)      NOT NULL, -- 1 or 2
    referee_name       VARCHAR2(200)  NOT NULL,
    relationship       VARCHAR2(30)   NOT NULL,
    mobile_number      VARCHAR2(20)   NOT NULL,
    work_address       CLOB,
    residence_address  CLOB,
    created_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_reference PRIMARY KEY (reference_id),
    CONSTRAINT fk_tcc_reference_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_reference_seq CHECK (reference_sequence IN (1,2)),
    CONSTRAINT chk_tcc_reference_rel CHECK (relationship IN ('COLLEAGUE','FRIEND','RELATIVE','EMPLOYER','OTHER')),
    CONSTRAINT uk_tcc_reference_app_seq UNIQUE (application_id, reference_sequence)
);
CREATE INDEX idx_tcc_reference_app ON TCC_REFERENCE(application_id);

-- -----------------------------------------------------------------------------
-- Nominee Details (MPP - MTB Protection Plan)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_NOMINEE (
    nominee_id         VARCHAR2(36)   NOT NULL,
    application_id     VARCHAR2(36)   NOT NULL,
    nominee_name       VARCHAR2(200)  NOT NULL,
    relationship       VARCHAR2(30)   NOT NULL,
    date_of_birth      DATE           NOT NULL,
    contact_address    CLOB           NOT NULL,
    mobile_number      VARCHAR2(20)   NOT NULL,
    photo_url          VARCHAR2(500),
    declaration_accepted CHAR(1)      DEFAULT 'N' NOT NULL,
    created_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_nominee PRIMARY KEY (nominee_id),
    CONSTRAINT fk_tcc_nominee_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_nominee_rel CHECK (relationship IN ('SPOUSE','PARENT','SON','DAUGHTER','OTHER')),
    CONSTRAINT chk_tcc_nominee_declaration CHECK (declaration_accepted IN ('Y','N'))
);
CREATE INDEX idx_tcc_nominee_app ON TCC_NOMINEE(application_id);

-- -----------------------------------------------------------------------------
-- Uploaded Documents & Images
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_DOCUMENT (
    document_id        VARCHAR2(36)   NOT NULL,
    application_id     VARCHAR2(36)   NOT NULL,
    document_type      VARCHAR2(30)   NOT NULL,
    document_name      VARCHAR2(200)  NOT NULL,
    file_url           VARCHAR2(1000) NOT NULL,
    file_size          NUMBER(10),
    mime_type          VARCHAR2(100),
    verification_status VARCHAR2(30)  DEFAULT 'PENDING',
    uploaded_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    verified_at        TIMESTAMP,
    CONSTRAINT pk_tcc_document PRIMARY KEY (document_id),
    CONSTRAINT fk_tcc_document_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_doc_type CHECK (document_type IN (
        'NID','PASSPORT','TIN_CERTIFICATE','SALARY_SLIP','BANK_STATEMENT',
        'UTILITY_BILL','PHOTOGRAPH','SIGNATURE','NOMINEE_PHOTO','TRADE_LICENSE','OTHER'
    )),
    CONSTRAINT chk_tcc_doc_verify_status CHECK (verification_status IN ('PENDING','VERIFIED','REJECTED'))
);
CREATE INDEX idx_tcc_document_app ON TCC_DOCUMENT(application_id);
CREATE INDEX idx_tcc_document_type ON TCC_DOCUMENT(document_type);

-- Special document types for quick access
CREATE TABLE TCC_APPLICANT_MEDIA (
    media_id           VARCHAR2(36)   NOT NULL,
    application_id     VARCHAR2(36)   NOT NULL,
    media_type         VARCHAR2(30)   NOT NULL,
    file_url           VARCHAR2(1000) NOT NULL,
    uploaded_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_applicant_media PRIMARY KEY (media_id),
    CONSTRAINT fk_tcc_media_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_media_type CHECK (media_type IN (
        'PRIMARY_APPLICANT_PHOTO','SUPPLEMENTARY_APPLICANT_PHOTO',
        'PRIMARY_APPLICANT_SIGNATURE','SUPPLEMENTARY_APPLICANT_SIGNATURE'
    ))
);
CREATE INDEX idx_tcc_media_app ON TCC_APPLICANT_MEDIA(application_id);

-- -----------------------------------------------------------------------------
-- Auto Debit Instruction
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_AUTO_DEBIT (
    auto_debit_id      VARCHAR2(36)   NOT NULL,
    application_id     VARCHAR2(36)   NOT NULL,
    debit_preference   VARCHAR2(50)   NOT NULL,
    account_name       VARCHAR2(200)  NOT NULL,
    mtb_account_number VARCHAR2(50)   NOT NULL,
    created_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_auto_debit PRIMARY KEY (auto_debit_id),
    CONSTRAINT fk_tcc_auto_debit_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_debit_pref CHECK (debit_preference IN ('MINIMUM_AMOUNT_DUE','TOTAL_OUTSTANDING'))
);
CREATE INDEX idx_tcc_auto_debit_app ON TCC_AUTO_DEBIT(application_id);

-- -----------------------------------------------------------------------------
-- MID (Most Important Document) Declarations
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_DECLARATION (
    declaration_id     VARCHAR2(36)   NOT NULL,
    application_id     VARCHAR2(36)   NOT NULL,
    pep_status         CHAR(1)        DEFAULT 'N' NOT NULL,
    existing_cards     CHAR(1)        DEFAULT 'N' NOT NULL,
    bankruptcy_history CHAR(1)        DEFAULT 'N' NOT NULL,
    terms_accepted     CHAR(1)        DEFAULT 'N' NOT NULL,
    declaration_json   CLOB,          -- Stores all declaration answers as JSON
    checklist_json     CLOB,          -- Stores document checklist as JSON
    declared_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_declaration PRIMARY KEY (declaration_id),
    CONSTRAINT fk_tcc_declaration_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_decl_pep CHECK (pep_status IN ('Y','N')),
    CONSTRAINT chk_tcc_decl_cards CHECK (existing_cards IN ('Y','N')),
    CONSTRAINT chk_tcc_decl_bankruptcy CHECK (bankruptcy_history IN ('Y','N')),
    CONSTRAINT chk_tcc_decl_terms CHECK (terms_accepted IN ('Y','N'))
);
CREATE INDEX idx_tcc_declaration_app ON TCC_DECLARATION(application_id);

-- -----------------------------------------------------------------------------
-- District Reference (Bangladesh Locations)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_DISTRICT (
    district_id    VARCHAR2(20)   NOT NULL,
    district_code  VARCHAR2(30)   NOT NULL,
    district_name  VARCHAR2(100)  NOT NULL,
    division_name  VARCHAR2(100)  NOT NULL,
    is_active      CHAR(1)        DEFAULT 'Y' NOT NULL,
    created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_district PRIMARY KEY (district_id),
    CONSTRAINT chk_tcc_ref_district_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Income Details (Monthly Income Breakdown)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_INCOME_DETAILS (
    income_details_id VARCHAR2(36)   NOT NULL,
    application_id   VARCHAR2(36)   NOT NULL,
    is_salaried      CHAR(1)        NOT NULL,
    -- Salaried Income
    gross_salary     VARCHAR2(30),
    total_deduction  VARCHAR2(30),
    net_salary       VARCHAR2(30),
    -- Business Income
    gross_income     VARCHAR2(30),
    total_expenses   VARCHAR2(30),
    net_income       VARCHAR2(30),
    -- Additional Income Sources (stored as JSON array)
    additional_sources CLOB,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_income_details PRIMARY KEY (income_details_id),
    CONSTRAINT fk_tcc_income_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_income_salaried CHECK (is_salaried IN ('Y','N'))
);
CREATE INDEX idx_tcc_income_app ON TCC_INCOME_DETAILS(application_id);

-- -----------------------------------------------------------------------------
-- Professional Information Details
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_PROFESSIONAL_DETAILS (
    professional_id     VARCHAR2(36)   NOT NULL,
    application_id      VARCHAR2(36)   NOT NULL,
    customer_segment    VARCHAR2(30)   NOT NULL,
    organization_name   VARCHAR2(200)  NOT NULL,
    parent_group        VARCHAR2(200),
    department          VARCHAR2(100),
    designation         VARCHAR2(100)  NOT NULL,
    office_address      CLOB,
    service_years       NUMBER(3),
    service_months      NUMBER(3),
    total_exp_years     NUMBER(3),
    total_exp_months    NUMBER(3),
    previous_employer   VARCHAR2(200),
    previous_designation VARCHAR2(100),
    created_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_professional PRIMARY KEY (professional_id),
    CONSTRAINT fk_tcc_professional_app FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id) ON DELETE CASCADE,
    CONSTRAINT chk_tcc_customer_segment CHECK (customer_segment IN (
        'SALARIED','BUSINESS_PERSON','SELF_EMPLOYED','LANDLORD','OTHER'
    ))
);
CREATE INDEX idx_tcc_professional_app ON TCC_PROFESSIONAL_DETAILS(application_id);

-- -----------------------------------------------------------------------------
-- COMMENTS FOR ALL NEW TABLES
-- -----------------------------------------------------------------------------
COMMENT ON TABLE TCC_SUPPLEMENTARY_CARD IS 'Supplementary/add-on card holder details';
COMMENT ON TABLE TCC_BANK_ACCOUNT IS 'Existing bank accounts of applicant';
COMMENT ON TABLE TCC_CREDIT_FACILITY IS 'Existing credit cards and loans';
COMMENT ON TABLE TCC_REFERENCE IS 'Two mandatory references for application';
COMMENT ON TABLE TCC_NOMINEE IS 'Nominee details for MTB Protection Plan';
COMMENT ON TABLE TCC_DOCUMENT IS 'All uploaded documents with verification status';
COMMENT ON TABLE TCC_APPLICANT_MEDIA IS 'Photos and signatures of applicants';
COMMENT ON TABLE TCC_AUTO_DEBIT IS 'Auto debit payment instruction';
COMMENT ON TABLE TCC_DECLARATION IS 'MID declarations and document checklist';
COMMENT ON TABLE TCC_REF_DISTRICT IS 'Bangladesh district reference data';
COMMENT ON TABLE TCC_INCOME_DETAILS IS 'Monthly income breakdown (salaried/business)';
COMMENT ON TABLE TCC_PROFESSIONAL_DETAILS IS 'Professional and employment details';
