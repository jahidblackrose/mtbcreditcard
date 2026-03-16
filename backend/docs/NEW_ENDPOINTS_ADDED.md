# Backend Endpoints Added

**Date:** January 31, 2026
**Purpose:** Add missing backend endpoints to match frontend API calls

---

## Endpoints Added

### 1. Applications Filter Endpoint
**File:** `backend/app/api/applications.py`
**Endpoint:** `GET /applications/all`
**Purpose:** Filter and list all applications for RM dashboard

**Query Parameters:**
- `status` (optional): Filter by application status
- `date_from` (optional): Filter from date (ISO format)
- `date_to` (optional): Filter to date (ISO format)
- `branch_code` (optional): Filter by branch code
- `page` (default: 1): Page number
- `limit` (default: 50, max: 100): Items per page

**Example:**
```bash
GET /api/v1/applications/all?status=SUBMITTED&date_from=2026-01-01&page=1&limit=20
```

**Frontend Maps To:**
```typescript
// src/api/applications.api.ts
getAllApplications(filters?: { status, date_from, date_to, branch_code })
```

---

### 2. Application Timeline Endpoint
**File:** `backend/app/api/applications.py`
**Endpoint:** `GET /applications/reference/{reference_number}/timeline`
**Purpose:** Get application status timeline/audit trail

**Path Parameters:**
- `reference_number`: Application reference number (e.g., MTBCC-20260128-001)

**Response:**
```json
{
  "status": 200,
  "message": "Timeline retrieved successfully",
  "data": [
    {
      "timestamp": "2026-01-30T10:00:00Z",
      "event": "Application Submitted",
      "status": "completed",
      "description": "Application submitted successfully",
      "actor": "APPLICANT"
    },
    {
      "timestamp": "2026-01-30T14:30:00Z",
      "event": "Document Verification",
      "status": "completed",
      "description": "Documents verified successfully",
      "actor": "SYSTEM"
    }
  ]
}
```

**Frontend Maps To:**
```typescript
// src/api/applications.api.ts
getApplicationTimeline(referenceNumber: string)
```

---

### 3. OTP Resend Endpoint
**File:** `backend/app/api/auth.py`
**Endpoint:** `POST /auth/otp/resend`
**Purpose:** Resend OTP for mobile verification

**Request Body:**
```json
{
  "mobile_number": "01712345678",
  "session_id": "sess_abc123"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "OTP resent successfully",
  "data": {
    "otp_sent": true,
    "expires_in": 300,
    "mobile_number": "0171******78",
    "attempts_remaining": 5
  }
}
```

**Frontend Maps To:**
```typescript
// src/api/otp.api.ts
resendOtp(mobileNumber: string, sessionId: string)
```

---

### 4. RM Logout Endpoint
**File:** `backend/app/api/auth.py`
**Endpoint:** `POST /auth/staff/logout`
**Purpose:** Logout RM user (invalidate session)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Logout successful",
  "data": null
}
```

**Frontend Maps To:**
```typescript
// src/api/auth.api.ts (needs update from /auth/rm/logout)
rmLogout()
```

---

### 5. RM Session Check Endpoint
**File:** `backend/app/api/auth.py`
**Endpoint:** `GET /auth/staff/session`
**Purpose:** Get current RM session and validate token

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Session retrieved successfully",
  "data": {
    "is_valid": true,
    "user": {
      "user_id": "STAFF_001",
      "staff_id": "admin",
      "name": "Administrator",
      "role": "ADMIN",
      "branch_id": "HEAD_OFFICE"
    },
    "expires_at": 1738289400
  }
}
```

**Frontend Maps To:**
```typescript
// src/api/auth.api.ts (needs update from /auth/rm/session)
getRMSession()
```

---

## Frontend Updates Required

While these backend endpoints are now added, the frontend still needs minor updates to use the correct endpoint paths:

### Update 1: RM Login Endpoint Path
**File:** `src/api/auth.api.ts` (line 206)

**Current:**
```typescript
return http.post('/auth/rm/login', { staffId, password });
```

**Should Be:**
```typescript
return http.post('/auth/staff/login', {
  staff_id: staffId,  // Note: snake_case to match backend
  password
});
```

### Update 2: RM Logout Endpoint Path
**File:** `src/api/auth.api.ts` (line 224)

**Current:**
```typescript
return http.post('/auth/rm/logout');
```

**Should Be:**
```typescript
return http.post('/auth/staff/logout');
```

### Update 3: RM Session Endpoint Path
**File:** `src/api/auth.api.ts` (line 273)

**Current:**
```typescript
return http.get('/auth/rm/session');
```

**Should Be:**
```typescript
return http.get('/auth/staff/session');
```

---

## Database Procedures Needed

The following procedures should be added to the database for full functionality:

### 1. Get All Applications
```sql
-- Procedure: get_all_applications
-- Purpose: Retrieve applications with multiple filters
-- Parameters: status, dateFrom, dateTo, branchCode, page, limit
```

### 2. Get Application Timeline
```sql
-- Procedure: get_application_timeline
-- Purpose: Retrieve audit trail/timeline for an application
-- Parameters: referenceNumber
```

**Note:** The code includes fallback logic if these procedures don't exist yet, so the endpoints will work with mock data based on existing application data.

---

## Testing

### Test Applications Filter
```bash
curl -X GET "http://localhost:8000/api/v1/applications/all?status=SUBMITTED&page=1&limit=10"
```

### Test Application Timeline
```bash
curl -X GET "http://localhost:8000/api/v1/applications/reference/MTBCC-20260128-001/timeline"
```

### Test OTP Resend
```bash
curl -X POST "http://localhost:8000/api/v1/auth/otp/resend" \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "01712345678", "session_id": "sess_test"}'
```

### Test RM Logout
```bash
curl -X POST "http://localhost:8000/api/v1/auth/staff/logout" \
  -H "Authorization: Bearer {your_token}"
```

### Test RM Session
```bash
curl -X GET "http://localhost:8000/api/v1/auth/staff/session" \
  -H "Authorization: Bearer {your_token}"
```

---

## Summary

✅ **5 new endpoints added**
✅ **All endpoints match frontend API calls**
✅ **Fallback logic included if procedures don't exist**
⚠️ **Frontend needs 3 path updates to use new endpoints**

**Estimated time to complete:** 30 minutes for frontend updates + database procedure creation

---

## Next Steps

1. ✅ Backend endpoints added (completed)
2. ⏳ Update frontend API paths (3 changes in `auth.api.ts`)
3. ⏳ Create/update database procedures if needed
4. ⏳ Test all endpoints in REAL mode
5. ⏳ Update API documentation

---

**End of Document**
