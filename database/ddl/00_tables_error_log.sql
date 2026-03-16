-- =============================================================================
-- MTB Credit Card Application System - Error Log Table
-- All package/API errors logged here with backtrace for support
-- Run first (no dependencies)
-- =============================================================================

CREATE TABLE TCC_ERROR_LOG (
    error_log_id     VARCHAR2(36)   NOT NULL,
    error_code       VARCHAR2(20)   NOT NULL,   -- 501, 502, ... (pkg) or 601, 602, ... (API)
    error_message    VARCHAR2(4000) NOT NULL,
    error_backtrace  CLOB,                     -- DBMS_UTILITY.FORMAT_ERROR_BACKTRACE
    error_line      VARCHAR2(100),             -- Line number / unit where error occurred
    procedure_name   VARCHAR2(128),             -- Package.procedure or API route
    call_stack      CLOB,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_tcc_error_log PRIMARY KEY (error_log_id)
);

CREATE INDEX idx_tcc_error_log_code ON TCC_ERROR_LOG(error_code);
CREATE INDEX idx_tcc_error_log_created ON TCC_ERROR_LOG(created_at);

COMMENT ON TABLE TCC_ERROR_LOG IS 'Central error log: package (501+) and API (601+) errors with backtrace for support';
