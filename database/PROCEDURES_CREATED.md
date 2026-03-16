# Database Procedures Created - Summary

**Date:** January 31, 2026
**Purpose:** Add missing procedures for RM dashboard and application tracking
**Package:** `pkg_credit_card_application`

---

## Procedures Created

### 1. get_all_applications (Error Code: 561)

**Purpose:** Retrieve applications with multiple filters for RM dashboard

**Parameters:**
```json
{
  "status": "SUBMITTED",          // Optional: Filter by application status
  "dateFrom": "2026-01-01",      // Optional: Filter from date (ISO format)
  "dateTo": "2026-01-31",        // Optional: Filter to date (ISO format)
  "branchCode": "HEAD_OFFICE",   // Optional: Filter by branch code
  "page": 1,                     // Pagination: Page number (default: 1)
  "limit": 50                    // Pagination: Items per page (default: 50, max: 100)
}
```

**Response:**
```json
{
  "applications": [
    {
      "application_id": "app_uuid",
      "reference_number": "MTBCC-20260128-001",
      "status": "SUBMITTED",
      "card_product_name": "MTB Visa Platinum Card",
      "applicant_name": "Ahmed Rahman",
      "mobile_number": "01712345678",
      "email": "ahmed@example.com",
      "created_at": "2026-01-28T10:00:00Z",
      "submitted_at": "2026-01-28T14:30:00Z",
      "last_updated_at": "2026-01-29T10:15:00Z",
      "current_step": 12,
      "highest_step": 12,
      "total_steps": 12,
      "is_submitted": true,
      "branch_id": "HEAD_OFFICE",
      "application_mode": "SELF"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

**Features:**
- ✅ Multiple optional filters (status, date range, branch)
- ✅ Pagination support with page/limit
- ✅ Returns applicant details (name, mobile, email)
- ✅ Includes application status and progress tracking
- ✅ Join with TCC_APPLICANT and TCC_REF_CARD_TYPE tables
- ✅ Ordered by creation date (newest first)

**Used By:**
- Backend: `GET /applications/all` endpoint
- Frontend: `getAllApplications(filters)` in `applications.api.ts`

---

### 2. get_application_timeline (Error Code: 562)

**Purpose:** Retrieve audit trail/timeline for an application

**Parameters:**
```json
{
  "referenceNumber": "MTBCC-20260128-001"
}
```

**Response:**
```json
{
  "application_id": "app_uuid",
  "reference_number": "MTBCC-20260128-001",
  "applicant_name": "Ahmed Rahman",
  "mobile_number": "01712345678",
  "current_status": "APPROVED",
  "timeline": [
    {
      "timestamp": "2026-01-28T10:00:00Z",
      "event": "Application Created",
      "status": "completed",
      "description": "Application initiated",
      "actor": "APPLICANT"
    },
    {
      "timestamp": "2026-01-28T14:30:00Z",
      "event": "Application Submitted",
      "status": "completed",
      "description": "Application submitted for review",
      "actor": "APPLICANT"
    },
    {
      "timestamp": "2026-01-29T10:15:00Z",
      "event": "Application Approved",
      "status": "completed",
      "description": "Application has been approved",
      "actor": "SYSTEM"
    }
  ]
}
```

**Timeline Events Generated:**
1. **Application Created** - Always included
2. **Information Completed** - If step >= 6
3. **Application Submitted** - If submitted_at is not null
4. **Status Events:**
   - **Under Review** - Current status
   - **Documents Required** - Pending action
   - **Approved** - Final approval
   - **Rejected** - Application rejected

**Features:**
- ✅ Builds timeline from existing application data
- ✅ No separate audit table required
- ✅ Dynamic timeline based on application status
- ✅ Shows actor (APPLICANT or SYSTEM)
- ✅ Timestamps in ISO 8601 format
- ✅ Status flags: completed, current, pending, error

**Used By:**
- Backend: `GET /applications/reference/{ref}/timeline` endpoint
- Frontend: `getApplicationTimeline(referenceNumber)` in `applications.api.ts`

---

## Files Modified

1. **`database/packages/pkg_credit_card_application_spec.sql`**
   - Added procedure declarations (lines 456-474)
   - Error codes: 561-562

2. **`database/packages/pkg_credit_card_application_body.sql`**
   - Added procedure implementations (lines 2890-3184)
   - Includes error handling with write_error_log
   - All procedures have TRY-CATCH blocks

3. **`database/packages/pkg_additional_procedures.sql`**
   - Standalone file with procedure source code
   - For reference/review purposes

---

## Installation Instructions

### Option 1: Recompile Package (After Current Connection)

```sql
-- Connect to database as sys or sysdba
sqlplus sys/password@ORCL AS SYSDBA

-- Grant execute on package (if needed)
GRANT EXECUTE ON pkg_credit_card_application TO mtb_app_user;

-- Recompile package body
ALTER PACKAGE pkg_credit_card_application COMPILE BODY;

-- Check for errors
SHOW ERRORS;
```

### Option 2: Fresh Installation

```sql
-- Connect as appropriate user
sqlplus mtb_app_user/password@ORCL

-- Execute spec file (if needed)
@database/packages/pkg_credit_card_application_spec.sql

-- Execute body file
@database/packages/pkg_credit_card_application_body.sql

-- Verify compilation
SELECT object_name, status
FROM user_objects
WHERE object_name = 'PKG_CREDIT_CARD_APPLICATION';
```

### Option 3: Using SQL*Plus Script

```sql
-- Create installation script
SET ECHO ON
SPOOL database/logs/procedure_install.log

-- Connect
CONNECT mtb_app_user/password@ORCL

-- Show current procedures
SELECT COUNT(*) as current_procedures
FROM user_procedures
WHERE object_name = 'PKG_CREDIT_CARD_APPLICATION';

-- Compile package
@database/packages/pkg_credit_card_application_spec.sql
@database/packages/pkg_credit_card_application_body.sql

-- Verify
SELECT object_name, status, timestamp
FROM user_objects
WHERE object_name LIKE 'PKG_CREDIT_CARD_APPLICATION%';

SPOOL OFF
```

---

## Testing Procedures

### Test get_all_applications

```sql
DECLARE
  v_status   VARCHAR2(10);
  v_message  VARCHAR2(4000);
  v_json_out CLOB;
  v_json_in  CLOB;
BEGIN
  -- Build input JSON
  v_json_in := '{
    "status": "SUBMITTED",
    "page": 1,
    "limit": 10
  }';

  -- Call procedure
  pkg_credit_card_application.get_all_applications(
    p_json_in  => v_json_in,
    p_status   => v_status,
    p_message  => v_message,
    p_json_out => v_json_out
  );

  -- Display results
  DBMS_OUTPUT.PUT_LINE('Status: ' || v_status);
  DBMS_OUTPUT.PUT_LINE('Message: ' || v_message);
  DBMS_OUTPUT.PUT_LINE('Output:');
  DBMS_OUTPUT.PUT_LINE(v_json_out);

EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/
```

### Test get_application_timeline

```sql
DECLARE
  v_status   VARCHAR2(10);
  v_message  VARCHAR2(4000);
  v_json_out CLOB;
  v_json_in  CLOB;
BEGIN
  -- Build input JSON
  v_json_in := '{
    "referenceNumber": "MTBCC-20260128-001"
  }';

  -- Call procedure
  pkg_credit_card_application.get_application_timeline(
    p_json_in  => v_json_in,
    p_status   => v_status,
    p_message  => v_message,
    p_json_out => v_json_out
  );

  -- Display results
  DBMS_OUTPUT.PUT_LINE('Status: ' || v_status);
  DBMS_OUTPUT.PUT_LINE('Message: ' || v_message);
  DBMS_OUTPUT.PUT_LINE('Output:');
  DBMS_OUTPUT.PUT_LINE(v_json_out);

EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/
```

---

## Error Codes

| Error Code | Procedure | Description |
|------------|-----------|-------------|
| 561 | get_all_applications | Application retrieval or query error |
| 562 | get_application_timeline | Timeline generation error |

All errors are logged to `TCC_ERROR_LOG` table with:
- Error log ID (UUID)
- Error code
- Error message
- Error backtrace
- Error line
- Procedure name
- Full call stack

---

## Known Limitations

### 1. Timeline from Application Data Only
The timeline procedure builds events from the TCC_APPLICATION table timestamps.
- ✅ **Created**, **Submitted**, **Approved**, **Rejected** timestamps are accurate
- ⚠️ **OTP verification** timestamp not stored (not currently tracked)
- ⚠️ **Status change history** not stored (only shows current status)

**Future Enhancement:** Add `TCC_APPLICATION_AUDIT` table to track all status changes with timestamps.

### 2. Dynamic SQL Execution
Both procedures use dynamic SQL with `EXECUTE IMMEDIATE`.
- ✅ Flexible filters and pagination
- ⚠️ SQL injection risk mitigated by parameter binding
- ⚠️ Requires proper input validation at application layer

---

## Dependencies

### Tables Used:
- `TCC_APPLICATION` - Application header data
- `TCC_APPLICANT` - Applicant personal details
- `TCC_REF_CARD_TYPE` - Card product names (for joins)
- `TCC_ERROR_LOG` - Error logging

### Views/Indexes Used:
- Indexes on `TCC_APPLICATION(reference_number)`
- Indexes on `TCC_APPLICATION(application_status)`
- Indexes on `TCC_APPLICATION(created_at)`

---

## Integration with Backend API

### get_all_applications
```
Frontend: getAllApplications(filters)
   ↓
Backend: GET /api/v1/applications/all
   ↓
Procedure: pkg_credit_card_application.get_all_applications
```

### get_application_timeline
```
Frontend: getApplicationTimeline(referenceNumber)
   ↓
Backend: GET /api/v1/applications/reference/{ref}/timeline
   ↓
Procedure: pkg_credit_card_application.get_application_timeline
```

---

## Verification Checklist

After installation, verify:

- [ ] Package spec compiles without errors
- [ ] Package body compiles without errors
- [ ] Procedures are accessible in `USER_PROCEDURES`
- [ ] Test get_all_applications with sample data
- [ ] Test get_application_timeline with sample reference
- [ ] Verify error logging to TCC_ERROR_LOG
- [ ] Check JSON output format matches API contract
- [ ] Test pagination (page/limit) works correctly

---

## Summary

| Metric | Value |
|--------|-------|
| Procedures Added | 2 |
| Error Codes Added | 561-562 |
| Tables Used | 3 (TCC_APPLICATION, TCC_APPLICANT, TCC_REF_CARD_TYPE) |
| JSON Parameters | 7 (status, dateFrom, dateTo, branchCode, page, limit, referenceNumber) |
| Timeline Events | 4 (Created, Progress, Submitted, Status) |
| Lines of Code | ~300 lines |

**Status:** ✅ **READY FOR INSTALLATION**

---

**Created By:** Claude AI
**Date:** January 31, 2026
**Version:** 1.0

---
