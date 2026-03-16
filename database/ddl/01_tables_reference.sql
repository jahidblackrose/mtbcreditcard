-- =============================================================================
-- MTB Credit Card Application System - Reference Tables (TCC_ prefix)
-- Process flow: Reference data first
-- Extended with all lookup tables for frontend enums and dropdowns
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Card Types (Product Catalog)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_CARD_TYPE (
    card_type_id     VARCHAR2(20)   NOT NULL,
    card_type_code   VARCHAR2(30)   NOT NULL,
    card_name        VARCHAR2(100)  NOT NULL,
    annual_fee       VARCHAR2(20)   NOT NULL,
    interest_rate    VARCHAR2(10)   NOT NULL,
    credit_limit_min VARCHAR2(20)   NOT NULL,
    credit_limit_max VARCHAR2(20)   NOT NULL,
    benefits         CLOB,
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_card_type PRIMARY KEY (card_type_id),
    CONSTRAINT chk_tcc_ref_card_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Card Networks (VISA, MASTERCARD, UNIONPAY)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_CARD_NETWORK (
    network_id       VARCHAR2(20)   NOT NULL,
    network_code     VARCHAR2(30)   NOT NULL,
    network_name     VARCHAR2(50)   NOT NULL,
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order    NUMBER(3)      DEFAULT 0,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_card_network PRIMARY KEY (network_id),
    CONSTRAINT chk_tcc_ref_network_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Card Tiers (CLASSIC, GOLD, PLATINUM, TITANIUM, SIGNATURE, WORLD)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_CARD_TIER (
    tier_id          VARCHAR2(20)   NOT NULL,
    tier_code        VARCHAR2(30)   NOT NULL,
    tier_name        VARCHAR2(50)   NOT NULL,
    description      VARCHAR2(200),
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order    NUMBER(3)      DEFAULT 0,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_card_tier PRIMARY KEY (tier_id),
    CONSTRAINT chk_tcc_ref_tier_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Card Categories (REGULAR, YAQEEN, CO_BRANDED)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_CARD_CATEGORY (
    category_id      VARCHAR2(20)   NOT NULL,
    category_code    VARCHAR2(30)   NOT NULL,
    category_name    VARCHAR2(50)   NOT NULL,
    description      VARCHAR2(200),
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order    NUMBER(3)      DEFAULT 0,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_card_category PRIMARY KEY (category_id),
    CONSTRAINT chk_tcc_ref_category_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Employment Types
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_EMPLOYMENT_TYPE (
    employment_type_id   VARCHAR2(20)  NOT NULL,
    employment_type_code VARCHAR2(30)  NOT NULL,
    description          VARCHAR2(200),
    is_active            CHAR(1)       DEFAULT 'Y' NOT NULL,
    display_order        NUMBER(3)     DEFAULT 0,
    created_at           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_employment_type PRIMARY KEY (employment_type_id),
    CONSTRAINT chk_tcc_ref_emp_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Customer Segments
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_CUSTOMER_SEGMENT (
    segment_id      VARCHAR2(20)   NOT NULL,
    segment_code    VARCHAR2(30)   NOT NULL,
    segment_name    VARCHAR2(50)   NOT NULL,
    description     VARCHAR2(200),
    is_active       CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order   NUMBER(3)      DEFAULT 0,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_customer_segment PRIMARY KEY (segment_id),
    CONSTRAINT chk_tcc_ref_segment_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Education Levels
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_EDUCATION_LEVEL (
    education_id    VARCHAR2(20)   NOT NULL,
    education_code  VARCHAR2(30)   NOT NULL,
    education_name  VARCHAR2(50)   NOT NULL,
    is_active       CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order   NUMBER(3)      DEFAULT 0,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_education_level PRIMARY KEY (education_id),
    CONSTRAINT chk_tcc_ref_education_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Account Types (Bank Accounts)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_ACCOUNT_TYPE (
    account_type_id VARCHAR2(20)   NOT NULL,
    account_type_code VARCHAR2(30) NOT NULL,
    account_type_name VARCHAR2(50) NOT NULL,
    is_active       CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order   NUMBER(3)      DEFAULT 0,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_account_type PRIMARY KEY (account_type_id),
    CONSTRAINT chk_tcc_ref_account_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Facility Types (Credit Facilities)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_FACILITY_TYPE (
    facility_type_id VARCHAR2(20)   NOT NULL,
    facility_type_code VARCHAR2(30) NOT NULL,
    facility_type_name VARCHAR2(50) NOT NULL,
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order    NUMBER(3)      DEFAULT 0,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_facility_type PRIMARY KEY (facility_type_id),
    CONSTRAINT chk_tcc_ref_facility_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Relationship Types (Nominee)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_NOMINEE_RELATIONSHIP (
    relationship_id VARCHAR2(20)   NOT NULL,
    relationship_code VARCHAR2(30) NOT NULL,
    relationship_name VARCHAR2(50) NOT NULL,
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order    NUMBER(3)      DEFAULT 0,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_nominee_rel PRIMARY KEY (relationship_id),
    CONSTRAINT chk_tcc_ref_nominee_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Relationship Types (Supplementary Card)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_SUPPLEMENTARY_RELATIONSHIP (
    relationship_id VARCHAR2(20)   NOT NULL,
    relationship_code VARCHAR2(30) NOT NULL,
    relationship_name VARCHAR2(50) NOT NULL,
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order    NUMBER(3)      DEFAULT 0,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_supplementary_rel PRIMARY KEY (relationship_id),
    CONSTRAINT chk_tcc_ref_supplementary_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Relationship Types (Referee)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_REFEE_RELATIONSHIP (
    relationship_id VARCHAR2(20)   NOT NULL,
    relationship_code VARCHAR2(30) NOT NULL,
    relationship_name VARCHAR2(50) NOT NULL,
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order    NUMBER(3)      DEFAULT 0,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_referee_rel PRIMARY KEY (relationship_id),
    CONSTRAINT chk_tcc_ref_referee_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Income Slabs (Eligibility)
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_INCOME_SLAB (
    income_slab_id   VARCHAR2(20)  NOT NULL,
    slab_code        VARCHAR2(30)  NOT NULL,
    min_income       NUMBER(18,2)   NOT NULL,
    max_income       NUMBER(18,2),
    description      VARCHAR2(200),
    is_active        CHAR(1)       DEFAULT 'Y' NOT NULL,
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_income_slab PRIMARY KEY (income_slab_id),
    CONSTRAINT chk_tcc_ref_income_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Rejection Reasons
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_REJECTION_REASON (
    reason_code   VARCHAR2(20)  NOT NULL,
    reason_desc   VARCHAR2(200) NOT NULL,
    category      VARCHAR2(30),
    is_active     CHAR(1)       DEFAULT 'Y' NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_rejection_reason PRIMARY KEY (reason_code),
    CONSTRAINT chk_tcc_ref_rej_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Branch & Channel
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_BRANCH (
    branch_id     VARCHAR2(20)  NOT NULL,
    branch_code   VARCHAR2(30)  NOT NULL,
    branch_name   VARCHAR2(100) NOT NULL,
    channel       VARCHAR2(30),
    is_active     CHAR(1)       DEFAULT 'Y' NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_branch PRIMARY KEY (branch_id),
    CONSTRAINT chk_tcc_ref_branch_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Document Types
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_DOCUMENT_TYPE (
    doc_type_id   VARCHAR2(20)   NOT NULL,
    doc_type_code VARCHAR2(30)   NOT NULL,
    doc_type_name VARCHAR2(50)   NOT NULL,
    description   VARCHAR2(200),
    is_required  CHAR(1)        DEFAULT 'N',
    is_active     CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order NUMBER(3)      DEFAULT 0,
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_doc_type PRIMARY KEY (doc_type_id),
    CONSTRAINT chk_tcc_ref_doc_active CHECK (is_active IN ('Y','N')),
    CONSTRAINT chk_tcc_ref_doc_required CHECK (is_required IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Religions
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_RELIGION (
    religion_id   VARCHAR2(20)   NOT NULL,
    religion_code VARCHAR2(30)   NOT NULL,
    religion_name VARCHAR2(50)   NOT NULL,
    is_active     CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order NUMBER(3)      DEFAULT 0,
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_religion PRIMARY KEY (religion_id),
    CONSTRAINT chk_tcc_ref_religion_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Marital Status
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_MARITAL_STATUS (
    status_id     VARCHAR2(20)   NOT NULL,
    status_code   VARCHAR2(30)   NOT NULL,
    status_name   VARCHAR2(50)   NOT NULL,
    is_active     CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order NUMBER(3)      DEFAULT 0,
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_marital_status PRIMARY KEY (status_id),
    CONSTRAINT chk_tcc_ref_marital_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- Auto Debit Preferences
-- -----------------------------------------------------------------------------
CREATE TABLE TCC_REF_AUTO_DEBIT_PREFERENCE (
    preference_id VARCHAR2(20)   NOT NULL,
    preference_code VARCHAR2(30) NOT NULL,
    preference_name VARCHAR2(50) NOT NULL,
    description   VARCHAR2(200),
    is_active     CHAR(1)        DEFAULT 'Y' NOT NULL,
    display_order NUMBER(3)      DEFAULT 0,
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_auto_debit_pref PRIMARY KEY (preference_id),
    CONSTRAINT chk_tcc_ref_debit_pref_active CHECK (is_active IN ('Y','N'))
);

-- -----------------------------------------------------------------------------
-- COMMENTS
-- -----------------------------------------------------------------------------
COMMENT ON TABLE TCC_REF_CARD_TYPE IS 'Card product catalog';
COMMENT ON TABLE TCC_REF_CARD_NETWORK IS 'Card network types (VISA, MASTERCARD, UNIONPAY)';
COMMENT ON TABLE TCC_REF_CARD_TIER IS 'Card tiers (CLASSIC, GOLD, PLATINUM, TITANIUM, SIGNATURE, WORLD)';
COMMENT ON TABLE TCC_REF_CARD_CATEGORY IS 'Card categories (REGULAR, YAQEEN, CO_BRANDED)';
COMMENT ON TABLE TCC_REF_EMPLOYMENT_TYPE IS 'Employment type reference';
COMMENT ON TABLE TCC_REF_CUSTOMER_SEGMENT IS 'Customer segments (SALARIED, BUSINESS_PERSON, SELF_EMPLOYED, LANDLORD, OTHER)';
COMMENT ON TABLE TCC_REF_EDUCATION_LEVEL IS 'Education levels (SSC, HSC, GRADUATE, POST_GRADUATE, PHD, OTHER)';
COMMENT ON TABLE TCC_REF_ACCOUNT_TYPE IS 'Bank account types (SAVINGS, CURRENT, FDR, DPS, OTHER)';
COMMENT ON TABLE TCC_REF_FACILITY_TYPE IS 'Credit facility types (CREDIT_CARD, HOME_LOAN, CAR_LOAN, PERSONAL_LOAN, OTHER)';
COMMENT ON TABLE TCC_REF_NOMINEE_RELATIONSHIP IS 'Nominee relationship types (SPOUSE, PARENT, SON, DAUGHTER, OTHER)';
COMMENT ON TABLE TCC_REF_SUPPLEMENTARY_RELATIONSHIP IS 'Supplementary card relationship types (FATHER, MOTHER, SON, DAUGHTER, SPOUSE, OTHER)';
COMMENT ON TABLE TCC_REF_REFEE_RELATIONSHIP IS 'Referee relationship types (COLLEAGUE, FRIEND, RELATIVE, EMPLOYER, OTHER)';
COMMENT ON TABLE TCC_REF_INCOME_SLAB IS 'Income slabs for eligibility';
COMMENT ON TABLE TCC_REF_REJECTION_REASON IS 'Rejection reason codes';
COMMENT ON TABLE TCC_REF_BRANCH IS 'Branch and channel for MIS';
COMMENT ON TABLE TCC_REF_DOCUMENT_TYPE IS 'Document types for KYC and verification';
COMMENT ON TABLE TCC_REF_RELIGION IS 'Religion reference data';
COMMENT ON TABLE TCC_REF_MARITAL_STATUS IS 'Marital status reference data';
COMMENT ON TABLE TCC_REF_AUTO_DEBIT_PREFERENCE IS 'Auto debit preferences (MINIMUM_AMOUNT_DUE, TOTAL_OUTSTANDING)';
