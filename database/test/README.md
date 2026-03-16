# MTB Credit Card Application - Package Test Suite

## Overview
Complete test suite for all 60 procedures (501-560) in the `pkg_credit_card_application` package.

## Test File Structure

```
database/test/
├── test_all_procedures.sql    # Main test file (all 60 procedures)
└── README.md                  # This file
```

## Prerequisites

### 1. Database Setup
Before running tests, ensure all tables are created:

```sql
-- Run in order:
@database/ddl/01_tables_reference.sql
@database/ddl/02_tables_applicant_application.sql
@database/ddl/06_tables_extended_entities.sql
@database/ddl/99_tables_error_log.sql
```

### 2. Package Compilation
Compile the package specification and body:

```sql
@database/packages/pkg_credit_card_application_spec.sql
@database/packages/pkg_credit_card_application_body.sql
```

## Running Tests

### Method 1: SQLPlus Command Line
```bash
sqlplus username/password@database @test_all_procedures.sql
```

### Method 2: SQLPlus Interactive
```sql
-- Connect to database
CONNECT username/password@database

-- Run test file
@test_all_procedures.sql
```

### Method 3: SQL Developer
1. Open `test_all_procedures.sql` in SQL Developer
2. Press F5 or click "Run Script"

### Method 4: Other Tools (TOAD, DBeaver, etc.)
1. Open the file
2. Execute as script (not statement)

## Test Sections

| Section | Error Codes | Procedures | Description |
|---------|-------------|------------|-------------|
| 1 | Setup | - | Clean data, insert reference data |
| 2 | 501-504 | 4 | Reference data procedures |
| 3 | 505-510 | 6 | Application CRUD |
| 4 | 512-516 | 5 | OTP procedures |
| 5 | 517 | 1 | Step 1: Card Selection |
| 6 | 518-519 | 2 | Step 2: Personal Info & Addresses |
| 7 | 520 | 1 | Step 3: Professional Info |
| 8 | 521 | 1 | Step 4: Monthly Income |
| 9 | 522-524 | 3 | Step 5: Bank Accounts |
| 10 | 525-527 | 3 | Step 6: Credit Facilities |
| 11 | 528-529 | 2 | Step 7: Nominee/MPP |
| 12 | 530-532 | 3 | Step 8: Supplementary Card |
| 13 | 533-534 | 2 | Step 9: References |
| 14 | 535-538 | 4 | Step 10: Images & Signatures |
| 15 | 539-540 | 2 | Step 11: Auto Debit |
| 16 | 541-542 | 2 | Step 12: MID Declarations |
| 17 | 543 | 1 | Full Application Save |
| 18 | 544-548 | 5 | Session Management |
| 19 | 549-553 | 5 | Draft Management |
| 20 | 554-556 | 3 | Submission |
| 21 | 557-560 | 4 | Dashboard & Reporting |

## Expected Output

### Success Pattern
Each test displays:
```
--- TEST XXX: procedure_name ---
Status: S
Message: [success message]
JSON Output: {...}
```

### Failure Pattern
If a test fails:
```
Status: [error code]
Message: [error code] : Error description
```

### Final Summary
At the end, check `TCC_ERROR_LOG` for any errors:
```sql
SELECT * FROM TCC_ERROR_LOG WHERE error_code LIKE '5%';
```

## Test Data

### Reference Data (Auto-inserted)
- Card Networks: VISA, MASTERCARD, UNIONPAY
- Card Tiers: CLASSIC through WORLD
- Card Categories: REGULAR, YAQEEN, CO_BRANDED
- Customer Segments: 5 types
- Districts: 5 sample districts
- And 10+ more reference tables

### Test IDs
All test entities use prefixed IDs:
- Applicants: `TEST-APPLICANT-*`
- Applications: `TEST-APP-*`
- Sessions: `TEST-SESSION-*`

### Test Applicant
Primary test applicant:
- Name: Md. Rahman Ahmed
- Mobile: 01812345678
- NID: 1234567890123
- DOB: 1990-05-15

## Quick Validation

After tests run, verify key data:

```sql
-- Check applications created
SELECT application_id, card_network, card_tier, application_status
FROM TCC_APPLICATION
WHERE application_id LIKE 'TEST-%';

-- Check applicant data
SELECT applicant_id, full_name, mobile_number, date_of_birth
FROM TCC_APPLICANT
WHERE applicant_id LIKE 'TEST-%';

-- Check bank accounts
SELECT bank_name, account_type, account_number
FROM TCC_BANK_ACCOUNT
WHERE application_id LIKE 'TEST-%';

-- Check supplementary cards
SELECT full_name, relationship
FROM TCC_SUPPLEMENTARY_CARD
WHERE application_id LIKE 'TEST-%';
```

## Troubleshooting

### Common Issues

**Issue: ORA-00942 table or view does not exist**
- Solution: Run DDL scripts first to create tables

**Issue: PLS-00201 identifier must be declared**
- Solution: Compile package spec before body

**Issue: JSON_VALUE returns NULL**
- Solution: Check Oracle version (requires 12c+ for JSON functions)

**Issue: Test shows error but no data in TCC_ERROR_LOG**
- Solution: Check if autonomous transaction is working

### Debug Mode
Add these lines at the top of test file:
```sql
EXEC DBMS_OUTPUT.ENABLE(NULL);
SET LINESIZE 200;
SET PAGESIZE 1000;
```

## Manual Procedure Testing

Test individual procedures:

```sql
-- Example: Test 501
DECLARE
   v_status VARCHAR2(10);
   v_message VARCHAR2(4000);
   v_json_out CLOB;
BEGIN
   pkg_credit_card_application.get_card_products(v_status, v_message, v_json_out);
   DBMS_OUTPUT.PUT_LINE('Status: ' || v_status);
   DBMS_OUTPUT.PUT_LINE('Message: ' || v_message);
   DBMS_OUTPUT.PUT_LINE('JSON: ' || v_json_out);
END;
/
```

## Success Criteria

All 60 tests should show:
- **Status: S** (Success)
- No entries in `TCC_ERROR_LOG` with error_code 5XX

## Clean Up Test Data

```sql
-- Remove all test data
DELETE FROM TCC_DRAFT WHERE session_id LIKE 'TEST-%';
DELETE FROM TCC_SESSION WHERE session_id LIKE 'TEST-%';
DELETE FROM TCC_APPLICATION WHERE application_id LIKE 'TEST-%';
DELETE FROM TCC_APPLICANT WHERE applicant_id LIKE 'TEST-%';
DELETE FROM TCC_ERROR_LOG WHERE error_code LIKE '5%';
COMMIT;
```

## Contact & Support

For issues or questions:
- Check package body: `database/packages/pkg_credit_card_application_body.sql`
- Check table definitions: `database/ddl/`
- Review TCC_ERROR_LOG table for detailed error messages
