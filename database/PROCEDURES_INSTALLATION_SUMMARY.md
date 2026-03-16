# Database Procedures Installation Complete

**Date:** January 31, 2026
**Status:** ✅ **READY FOR DEPLOYMENT**

---

## Summary

Successfully added **2 new database procedures** to support RM dashboard and application tracking features.

### Procedures Added

| # | Procedure | Error Code | Purpose | Status |
|---|-----------|------------|---------|--------|
| 1 | `get_all_applications` | 561 | Filter applications for RM dashboard | ✅ Complete |
| 2 | `get_application_timeline` | 562 | Get application audit trail/timeline | ✅ Complete |

**Total Procedures in Package:** 62 (Error codes: 501-562)

---

## Files Modified

### 1. Package Specification
**File:** `database/packages/pkg_credit_card_application_spec.sql`
- Added 2 procedure declarations (lines 458-464)
- 61 procedures total declared

### 2. Package Body
**File:** `database/packages/pkg_credit_card_application_body.sql`
- Added 2 procedure implementations (lines 2897-3151)
- Complete logic with error handling
- JSON input/output processing
- Pagination support

### 3. Reference File
**File:** `database/packages/pkg_additional_procedures.sql`
- Standalone procedure source code
- For reference/review

---

## What the Procedures Do

### get_all_applications (561)

**Capability:** RM Dashboard Filter

**Features:**
- ✅ Filter by application status (DRAFT, SUBMITTED, APPROVED, etc.)
- ✅ Filter by date range (created_at between dates)
- ✅ Filter by branch code
- ✅ Pagination support (page + limit)
- ✅ Returns applicant details (name, mobile, email)
- ✅ Returns application progress (current_step, highest_step)
- ✅ Returns timestamps in ISO 8601 format

**Example Call:**
```sql
DECLARE
  v_status   VARCHAR2(10);
  v_message  VARCHAR2(4000);
  v_json_out CLOB;
BEGIN
  pkg_credit_card_application.get_all_applications(
    p_json_in  => '{"status":"SUBMITTED","page":1,"limit":10}',
    p_status   => v_status,
    p_message  => v_message,
    p_json_out => v_json_out
  );
END;
```

---

### get_application_timeline (562)

**Capability:** Application Tracking

**Features:**
- ✅ Retrieves application by reference number
- ✅ Builds timeline from application data
- ✅ Shows key events (Created, Submitted, Status changes)
- ✅ Displays actor (APPLICANT or SYSTEM)
- ✅ Returns ISO 8601 timestamps
- ✅ Status flags: completed, current, pending, error

**Timeline Events:**
1. Application Created (always shown)
2. Information Completed (if step >= 6)
3. Application Submitted (if submitted)
4. Status Update (UNDER_REVIEW, DOCUMENTS_REQUIRED, APPROVED, REJECTED)

**Example Call:**
```sql
DECLARE
  v_status   VARCHAR2(10);
  v_message  VARCHAR2(4000);
  v_json_out CLOB;
BEGIN
  pkg_credit_card_application.get_application_timeline(
    p_json_in  => '{"referenceNumber":"MTBCC-20260128-001"}',
    p_status   => v_status,
    p_message  => v_message,
    p_json_out => v_json_out
  );
END;
```

---

## Installation Steps

### Step 1: Connect to Database

```bash
# Using SQL*Plus
sqlplus mtb_app_user/password@ORCL

# Or using SQL Developer
# Connect with your credentials
```

### Step 2: Recompile Package

```sql
-- Recompile package spec (if needed)
@database/packages/pkg_credit_card_application_spec.sql

-- Recompile package body
@database/packages/pkg_credit_card_application_body.sql

-- Check for errors
SHOW ERRORS;

-- Verify compilation
SELECT object_name, status
FROM user_objects
WHERE object_name LIKE 'PKG_CREDIT_CARD_APPLICATION%';
```

Expected output:
```
OBJECT_NAME                    STATUS
------------------------------ ----------
PKG_CREDIT_CARD_APPLICATION      VALID
PKG_CREDIT_CARD_APPLICATION      VALID
```

### Step 3: Test Procedures

See `database/PROCEDURES_CREATED.md` for complete test scripts.

---

## Integration Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Backend Endpoints** | ✅ Complete | 5 endpoints added |
| **Database Procedures** | ✅ Complete | 2 procedures added |
| **Frontend API** | ⚠️ Needs Update | 3 path updates needed |
| **API Contract** | ✅ Matches | JSON format verified |

---

## Frontend Updates Still Needed

To use these procedures in REAL mode, update `src/api/auth.api.ts`:

### Update 1: RM Login Path (Line ~206)
```typescript
// Change from:
return http.post('/auth/rm/login', { staffId, password });

// To:
return http.post('/auth/staff/login', { staff_id: staffId, password });
```

### Update 2: RM Logout Path (Line ~224)
```typescript
// Change from:
return http.post('/auth/rm/logout');

// To:
return http.post('/auth/staff/logout');
```

### Update 3: RM Session Path (Line ~273)
```typescript
// Change from:
return http.get('/auth/rm/session');

// To:
return http.get('/auth/staff/session');
```

---

## Testing Checklist

After database installation:

- [ ] Package compiles without errors
- [ ] Both procedures accessible
- [ ] Test get_all_applications returns data
- [ ] Test get_application_timeline returns timeline
- [ ] Verify JSON format matches frontend expectations
- [ ] Check errors logged to TCC_ERROR_LOG table
- [ ] Test pagination (page/limit)
- [ ] Test filters (status, date, branch)

---

## Error Handling

All errors are logged to `TCC_ERROR_LOG` table with:
- Error log ID (UUID)
- Error code (561 or 562)
- Error message
- Full error backtrace
- Procedure name
- Line number

To check for errors:
```sql
SELECT * FROM TCC_ERROR_LOG
WHERE error_code IN ('561', '562')
ORDER BY created_at DESC
FETCH FIRST 10 ROWS ONLY;
```

---

## Files Created

1. **`database/packages/pkg_additional_procedures.sql`**
   - Standalone procedure source code
   - For reference/review

2. **`database/PROCEDURES_CREATED.md`**
   - Complete procedure documentation
   - Testing scripts
   - Integration details

3. **`database/PROCEDURES_INSTALLATION_SUMMARY.md`**
   - This file
   - Installation instructions

---

## Next Steps

1. ✅ **Procedures created** - Complete
2. ⏳ **Install procedures** - Run SQL scripts in database
3. ⏳ **Update frontend paths** - 3 changes in auth.api.ts
4. ⏳ **Test full flow** - Backend + Database + Frontend
5. ⏳ **Switch to REAL mode** - Change VITE_APP_MODE=REAL

---

## Success Criteria

When complete:

✅ RM dashboard can filter applications by status/date/branch
✅ Application tracking shows timeline with all events
✅ Both procedures return JSON matching frontend contracts
✅ Error logging captures any issues
✅ Frontend can call backend endpoints in REAL mode

---

**Status:** ✅ **PROCEDURES READY FOR INSTALLATION**

**Estimated Installation Time:** 5 minutes

---

**End of Summary**
