-- =============================================================================
-- MTB Credit Card Application System - Applicant & Application (TCC_ prefix)
-- Process flow: Applicant profile then Application header
-- Updated to match FullApplicationData type from frontend
-- =============================================================================

CREATE TABLE TCC_APPLICANT (
    applicant_id        VARCHAR2(36)   NOT NULL,
    full_name           VARCHAR2(200)  NOT NULL,
    name_on_card        VARCHAR2(200),  -- BLOCK LETTERS for card printing
    father_name         VARCHAR2(200),
    mother_name         VARCHAR2(200),
    date_of_birth       DATE           NOT NULL,
    gender              CHAR(1)        NOT NULL,
    nationality         VARCHAR2(50)    DEFAULT 'Bangladesh',
    home_district       VARCHAR2(100),  -- Searchable district selection

    -- IDs & Documents
    nid_number          VARCHAR2(20)   NOT NULL,
    tin                 VARCHAR2(30),
    passport_number     VARCHAR2(50),
    passport_issue_date DATE,
    passport_expiry_date DATE,

    -- Contact Information
    mobile_number       VARCHAR2(20)   NOT NULL,
    email               VARCHAR2(100)  NOT NULL,

    -- Personal Attributes
    religion            VARCHAR2(30),
    marital_status      VARCHAR2(30),
    spouse_name         VARCHAR2(200),
    spouse_profession   VARCHAR2(100),

    -- Education
    education_level     VARCHAR2(30),

    -- Address Information (stored as JSON CLOB for flexibility)
    present_address     CLOB,
    permanent_address   CLOB,
    mailing_address_type VARCHAR2(30),  -- PRESENT, PERMANENT, OFFICE

    -- Employment Summary (legacy, use TCC_PROFESSIONAL_DETAILS for full data)
    employment_type_id  VARCHAR2(20),
    employer_name       VARCHAR2(200),
    designation         VARCHAR2(100),
    monthly_income      VARCHAR2(30),
    years_of_experience NUMBER(5),
    office_address      CLOB,

    -- Timestamps
    created_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_tcc_applicant PRIMARY KEY (applicant_id),
    CONSTRAINT chk_tcc_applicant_gender CHECK (gender IN ('M','F','O')),
    CONSTRAINT chk_tcc_applicant_religion CHECK (religion IN ('ISLAM','HINDUISM','CHRISTIANITY','BUDDHISM','OTHER')),
    CONSTRAINT chk_tcc_applicant_marital CHECK (marital_status IN ('SINGLE','MARRIED')),
    CONSTRAINT chk_tcc_applicant_education CHECK (education_level IN ('SSC','HSC','GRADUATE','POST_GRADUATE','PHD','OTHER')),
    CONSTRAINT chk_tcc_mailing_addr_type CHECK (mailing_address_type IN ('PRESENT','PERMANENT','OFFICE'))
);

CREATE TABLE TCC_APPLICATION (
    application_id       VARCHAR2(36)   NOT NULL,
    reference_number     VARCHAR2(30)   NOT NULL,
    applicant_id         VARCHAR2(36)   NOT NULL,

    -- Application Mode & Status
    application_mode     VARCHAR2(10)   NOT NULL,
    application_status   VARCHAR2(30)   NOT NULL,

    -- Card Selection Details
    card_network         VARCHAR2(20)   NOT NULL,  -- VISA, MASTERCARD, UNIONPAY
    card_tier            VARCHAR2(20)   NOT NULL,  -- CLASSIC, GOLD, PLATINUM, etc.
    card_category        VARCHAR2(20)   NOT NULL,  -- REGULAR, YAQEEN, CO_BRANDED
    card_type_id         VARCHAR2(20),  -- FK to reference table (optional)

    -- Credit Limit
    requested_limit      VARCHAR2(30)   NOT NULL,
    approved_limit       VARCHAR2(30),

    -- Session & Branch Info
    session_id           VARCHAR2(36),
    branch_id            VARCHAR2(20),
    channel              VARCHAR2(30),

    -- Status Tracking
    current_step         NUMBER(5)      DEFAULT 0,  -- Current form step (0-12)
    highest_step         NUMBER(5)      DEFAULT 0,  -- Highest completed step

    -- OTP Verification (SELF mode only)
    otp_verified         CHAR(1)        DEFAULT 'N',
    verified_at          TIMESTAMP,

    -- Supplementary Card
    has_supplementary    CHAR(1)        DEFAULT 'N',

    -- Final Declarations
    terms_accepted       CHAR(1)        DEFAULT 'N',
    declaration_accepted CHAR(1)        DEFAULT 'N',

    -- Timestamps
    submitted_at         TIMESTAMP,
    approved_at          TIMESTAMP,
    rejected_at          TIMESTAMP,
    rejection_reason_code VARCHAR2(20),
    created_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_tcc_application PRIMARY KEY (application_id),
    CONSTRAINT uk_tcc_application_ref UNIQUE (reference_number),
    CONSTRAINT fk_tcc_app_applicant FOREIGN KEY (applicant_id) REFERENCES TCC_APPLICANT(applicant_id),
    CONSTRAINT fk_tcc_app_card_type FOREIGN KEY (card_type_id) REFERENCES TCC_REF_CARD_TYPE(card_type_id),
    CONSTRAINT chk_tcc_app_mode CHECK (application_mode IN ('SELF','ASSISTED')),
    CONSTRAINT chk_tcc_app_status CHECK (application_status IN (
        'DRAFT','PENDING_OTP','SUBMITTED','UNDER_REVIEW','DOCUMENTS_REQUIRED',
        'APPROVED','REJECTED','CARD_ISSUED'
    )),
    CONSTRAINT chk_tcc_app_network CHECK (card_network IN ('VISA','MASTERCARD','UNIONPAY')),
    CONSTRAINT chk_tcc_app_tier CHECK (card_tier IN ('CLASSIC','GOLD','PLATINUM','TITANIUM','SIGNATURE','WORLD')),
    CONSTRAINT chk_tcc_app_category CHECK (card_category IN ('REGULAR','YAQEEN','CO_BRANDED')),
    CONSTRAINT chk_tcc_otp_verified CHECK (otp_verified IN ('Y','N')),
    CONSTRAINT chk_tcc_has_supplementary CHECK (has_supplementary IN ('Y','N')),
    CONSTRAINT chk_tcc_terms_accepted CHECK (terms_accepted IN ('Y','N')),
    CONSTRAINT chk_tcc_declaration_accepted CHECK (declaration_accepted IN ('Y','N'))
);

CREATE INDEX idx_tcc_application_ref ON TCC_APPLICATION(reference_number);
CREATE INDEX idx_tcc_application_status ON TCC_APPLICATION(application_status);
CREATE INDEX idx_tcc_application_session ON TCC_APPLICATION(session_id);
CREATE INDEX idx_tcc_application_applicant ON TCC_APPLICATION(applicant_id);
CREATE INDEX idx_tcc_application_mobile ON TCC_APPLICATION(applicant_id); -- For lookup by mobile

COMMENT ON TABLE TCC_APPLICANT IS 'Applicant profile - extended with all personal info fields';
COMMENT ON TABLE TCC_APPLICATION IS 'Credit card application header - extended with card selection and tracking';
