-- =============================================================================
-- MTB Credit Card Application System - Limit, Issuance, Staff (TCC_ prefix)
-- =============================================================================

CREATE TABLE TCC_CREDIT_LIMIT (
    limit_id         VARCHAR2(36)   NOT NULL,
    application_id   VARCHAR2(36)   NOT NULL,
    requested_limit  VARCHAR2(30)   NOT NULL,
    approved_limit   VARCHAR2(30)   NOT NULL,
    revision_count   NUMBER(5)     DEFAULT 0,
    confirmed_at     TIMESTAMP,
    confirmed_by     VARCHAR2(50),
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_credit_limit PRIMARY KEY (limit_id),
    CONSTRAINT uk_tcc_credit_limit_app UNIQUE (application_id),
    CONSTRAINT fk_tcc_cl_application FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id)
);

CREATE TABLE TCC_CARD_ISSUANCE (
    issuance_id       VARCHAR2(36)   NOT NULL,
    application_id    VARCHAR2(36)   NOT NULL,
    card_type_id      VARCHAR2(20)   NOT NULL,
    approved_limit    VARCHAR2(30)   NOT NULL,
    generation_status VARCHAR2(30)   DEFAULT 'PENDING' NOT NULL,
    generated_at      TIMESTAMP,
    delivery_status   VARCHAR2(30)   DEFAULT 'PENDING',
    delivery_ref      VARCHAR2(100),
    created_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_card_issuance PRIMARY KEY (issuance_id),
    CONSTRAINT uk_tcc_card_issuance_app UNIQUE (application_id),
    CONSTRAINT fk_tcc_ci_application FOREIGN KEY (application_id) REFERENCES TCC_APPLICATION(application_id),
    CONSTRAINT fk_tcc_ci_card_type FOREIGN KEY (card_type_id) REFERENCES TCC_REF_CARD_TYPE(card_type_id),
    CONSTRAINT chk_tcc_ci_gen_status CHECK (generation_status IN ('PENDING','READY','GENERATED','FAILED')),
    CONSTRAINT chk_tcc_ci_delivery CHECK (delivery_status IN ('PENDING','DISPATCHED','DELIVERED','FAILED'))
);

CREATE TABLE TCC_REF_STAFF (
    staff_id    VARCHAR2(36)   NOT NULL,
    staff_code  VARCHAR2(30)   NOT NULL,
    full_name   VARCHAR2(200)  NOT NULL,
    email       VARCHAR2(100)  NOT NULL,
    branch_id   VARCHAR2(20),
    role_code   VARCHAR2(30)   NOT NULL,
    is_active   CHAR(1)        DEFAULT 'Y' NOT NULL,
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_ref_staff PRIMARY KEY (staff_id),
    CONSTRAINT uk_tcc_ref_staff_code UNIQUE (staff_code),
    CONSTRAINT fk_tcc_ref_staff_branch FOREIGN KEY (branch_id) REFERENCES TCC_REF_BRANCH(branch_id),
    CONSTRAINT chk_tcc_ref_staff_active CHECK (is_active IN ('Y','N')),
    CONSTRAINT chk_tcc_ref_staff_role CHECK (role_code IN ('RM','BRANCH_MANAGER','ADMIN'))
);

COMMENT ON TABLE TCC_CREDIT_LIMIT IS 'Approved credit limit';
COMMENT ON TABLE TCC_CARD_ISSUANCE IS 'Card generation and delivery';
COMMENT ON TABLE TCC_REF_STAFF IS 'Staff/RM users';