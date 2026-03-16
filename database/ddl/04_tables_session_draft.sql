-- =============================================================================
-- MTB Credit Card Application System - Session & Draft (TCC_ prefix)
-- =============================================================================

CREATE TABLE TCC_SESSION (
    session_id       VARCHAR2(36)   NOT NULL,
    application_mode VARCHAR2(10)   NOT NULL,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    expires_at       TIMESTAMP      NOT NULL,
    is_active        CHAR(1)        DEFAULT 'Y' NOT NULL,
    CONSTRAINT pk_tcc_session PRIMARY KEY (session_id),
    CONSTRAINT chk_tcc_session_mode CHECK (application_mode IN ('SELF','ASSISTED')),
    CONSTRAINT chk_tcc_session_active CHECK (is_active IN ('Y','N'))
);

CREATE TABLE TCC_DRAFT (
    draft_id              VARCHAR2(36)   NOT NULL,
    session_id            VARCHAR2(36)   NOT NULL,
    application_id        VARCHAR2(36),
    current_step          NUMBER(5)      DEFAULT 1,
    highest_completed_step NUMBER(5)     DEFAULT 0,
    draft_version         NUMBER(10)    DEFAULT 1,
    draft_data            CLOB,
    is_submitted          CHAR(1)       DEFAULT 'N' NOT NULL,
    last_saved_at         TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    created_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_draft PRIMARY KEY (draft_id),
    CONSTRAINT uk_tcc_draft_session UNIQUE (session_id),
    CONSTRAINT chk_tcc_draft_submitted CHECK (is_submitted IN ('Y','N'))
);
CREATE INDEX idx_tcc_draft_session ON TCC_DRAFT(session_id);

CREATE TABLE TCC_DRAFT_STEP_VERSION (
    version_id   VARCHAR2(36)   NOT NULL,
    draft_id     VARCHAR2(36)   NOT NULL,
    step_number  NUMBER(5)     NOT NULL,
    step_name    VARCHAR2(100),
    version      NUMBER(10)    NOT NULL,
    saved_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    is_complete  CHAR(1)       DEFAULT 'N',
    CONSTRAINT pk_tcc_draft_step_version PRIMARY KEY (version_id),
    CONSTRAINT fk_tcc_draft_sv_draft FOREIGN KEY (draft_id) REFERENCES TCC_DRAFT(draft_id),
    CONSTRAINT chk_tcc_draft_sv_complete CHECK (is_complete IN ('Y','N'))
);

CREATE TABLE TCC_OTP_ATTEMPT (
    otp_attempt_id    VARCHAR2(36)   NOT NULL,
    mobile_number     VARCHAR2(20)   NOT NULL,
    session_id        VARCHAR2(36),
    remaining_attempts NUMBER(2)    DEFAULT 5,
    max_attempts      NUMBER(2)     DEFAULT 5,
    is_locked         CHAR(1)       DEFAULT 'N',
    lock_expires_at   TIMESTAMP,
    last_attempt_at   TIMESTAMP,
    created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tcc_otp_attempt PRIMARY KEY (otp_attempt_id),
    CONSTRAINT chk_tcc_otp_locked CHECK (is_locked IN ('Y','N'))
);
CREATE INDEX idx_tcc_otp_mobile_session ON TCC_OTP_ATTEMPT(mobile_number, session_id);

COMMENT ON TABLE TCC_SESSION IS 'Application session';
COMMENT ON TABLE TCC_DRAFT IS 'Draft application state';
COMMENT ON TABLE TCC_DRAFT_STEP_VERSION IS 'Draft step version history';
COMMENT ON TABLE TCC_OTP_ATTEMPT IS 'OTP attempt and lockout';
