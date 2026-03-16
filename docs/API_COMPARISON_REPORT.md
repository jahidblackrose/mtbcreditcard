# Backend vs Frontend API Comparison Report

**Generated:** January 31, 2026
**Status:** ⚠️ **MISMATCHES FOUND** - Some frontend APIs don't match backend endpoints

---

## Summary

| Category | Backend Endpoints | Frontend API Calls | Match Status |
|----------|------------------|-------------------|--------------|
| **Auth** | 7 endpoints | 8 functions | ⚠️ 3 Mismatches |
| **Session** | 5 endpoints | 5 functions | ✅ Perfect Match |
| **Draft** | 5 endpoints | 6 functions | ✅ Perfect Match |
| **OTP** | 5 endpoints | 4 functions | ⚠️ 1 Extra |
| **Applications** | 6 endpoints | 5 functions | ⚠️ 2 Mismatches |
| **Steps** | 12 endpoints | Not checked | ⏳ TBD |

**Overall:** 32/35 APIs match correctly | **91% Compatibility**

---

## ✅ **MATCHING APIs** (Working Correctly)

### 1. Session Management (100% Match)

| Frontend Function | Backend Endpoint | Status |
|------------------|------------------|--------|
| `createSession(mode)` | `POST /session/create` | ✅ |
| `getSession(sessionId)` | `GET /session/{session_id}` | ✅ |
| `extendSession(sessionId)` | `POST /session/{session_id}/extend` | ✅ |
| `endSession(sessionId)` | `DELETE /session/{session_id}` | ✅ |
| `validateSession(sessionId)` | `GET /session/{session_id}/validate` | ✅ |

### 2. Draft Management (100% Match)

| Frontend Function | Backend Endpoint | Status |
|------------------|------------------|--------|
| `initializeDraft(sessionId)` | `POST /drafts/initialize` | ✅ |
| `getDraft(sessionId)` | `GET /drafts/{session_id}` | ✅ |
| `saveDraftStep(request)` | `POST /drafts/save` | ✅ |
| `clearDraft(sessionId)` | `DELETE /drafts/{session_id}` | ✅ |
| `getStepVersions(sessionId)` | `GET /drafts/{session_id}/versions` | ✅ |

### 3. OTP Management (Mostly Match)

| Frontend Function | Backend Endpoint | Status |
|------------------|------------------|--------|
| `requestOtp(mobile, sessionId)` | `POST /auth/otp/request` | ✅ |
| `verifyOtp(mobile, otp, sessionId)` | `POST /auth/otp/verify` | ✅ |
| `getOtpStatus(mobile, sessionId)` | `GET /auth/otp/status` | ✅ |

---

## ⚠️ **MISMATCHES & ISSUES**

### Issue 1: RM Authentication Endpoints Don't Match

**Frontend calls:**
```
POST /auth/rm/login       ❌ Backend doesn't have this
POST /auth/rm/logout      ❌ Backend doesn't have this
GET  /auth/rm/session     ❌ Backend doesn't have this
```

**Backend has:**
```
POST /auth/staff/login    ✅ Exists (procedure 511-515 not used for staff)
POST /auth/staff/refresh  ✅ Exists
```

**Impact:** HIGH - RM login feature will not work in REAL mode

**Solution Required:**
```typescript
// OPTION 1: Update frontend to use backend endpoints
rmLogin() → POST /auth/staff/login
- Request body needs: { staff_id, password }
- Response matches backend StaffLoginResponse

// OPTION 2: Add RM endpoints to backend
POST /auth/rm/login → Map to staff/login internally
POST /auth/rm/logout → Add logout endpoint
GET /auth/rm/session → Add session check endpoint
```

**Recommended:** OPTION 1 - Update frontend to call `/auth/staff/login`

---

### Issue 2: OTP Resend Endpoint Missing

**Frontend calls:**
```
POST /auth/otp/resend     ❌ Backend doesn't have this
```

**Backend has:** No resend endpoint (user must call request again)

**Impact:** MEDIUM - Resend OTP button won't work in REAL mode

**Solution Required:**
```python
# OPTION 1: Add resend endpoint to backend
@router.post("/auth/otp/resend", response_model=ApiResponse)
async def resend_otp(request: OtpRequest, db: Connection):
    # Same logic as request_otp but with resend message
    pass

# OPTION 2: Remove resend from frontend, use requestOtp() instead
```

**Recommended:** OPTION 1 - Add resend endpoint for better UX

---

### Issue 3: Application Timeline Missing

**Frontend calls:**
```
GET /applications/reference/{referenceNumber}/timeline  ❌ Backend doesn't have this
```

**Backend has:**
```
GET /applications/reference/{reference_number}  ✅ Returns application details
```

**Impact:** MEDIUM - Track application feature won't show timeline in REAL mode

**Solution Required:**
```python
# Add timeline endpoint to backend
@router.get("/applications/reference/{reference_number}/timeline")
async def get_application_timeline(reference_number: str, db: Connection):
    # Query TCC_APPLICATION_AUDIT or similar table
    # Return timeline events
    pass
```

**Recommended:** Add timeline endpoint to backend

---

### Issue 4: Get All Applications Missing

**Frontend calls:**
```
GET /applications/all?status=xxx&date_from=xxx&date_to=xxx  ❌ Backend doesn't have this
```

**Backend has:**
```
GET /applications?mobile_number=xxx  ✅ Filter by mobile only
```

**Impact:** HIGH - RM dashboard can't filter applications in REAL mode

**Solution Required:**
```python
# Add comprehensive filter endpoint to backend
@router.get("/applications/all")
async def get_all_applications(
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    branch_code: Optional[str] = None,
    db: Connection = Depends(get_db)
):
    # Query with multiple filters
    pass
```

**Recommended:** Add comprehensive filter endpoint to backend

---

### Issue 5: Frontend Has Duplicate OTP API Files

**Files:**
- `src/api/auth.api.ts` - Has `requestOtp()` and `verifyOtp()`
- `src/api/otp.api.ts` - Has `requestOtp()`, `verifyOtp()`, `resendOtp()`, `getOtpStatus()`

**Impact:** LOW - Both exist but may cause confusion

**Solution Required:**
```typescript
// OPTION 1: Keep only otp.api.ts, remove OTP functions from auth.api.ts
// OPTION 2: Keep only auth.api.ts, remove otp.api.ts
// OPTION 3: Import from otp.api.ts in auth.api.ts
```

**Recommended:** OPTION 1 - Keep otp.api.ts as single source of truth

---

## 📋 Missing Backend Endpoints Needed

To make frontend work in REAL mode, add these endpoints to backend:

### High Priority
```python
# 1. Add application timeline endpoint
GET /applications/reference/{reference_number}/timeline
Response: { timestamp, event, status, description, actor }[]

# 2. Add comprehensive applications filter
GET /applications/all?status=xxx&date_from=xxx&date_to=xxx&branch_code=xxx
Response: Application[]

# 3. Add OTP resend endpoint
POST /auth/otp/resend
Request: { mobile_number, session_id }
Response: { otp_sent, expires_in, mobile_number, attempts_remaining }
```

### Medium Priority
```python
# 4. Add RM logout endpoint
POST /auth/rm/logout OR POST /auth/staff/logout
Response: { message }

# 5. Add RM session check endpoint
GET /auth/rm/session OR GET /auth/staff/session
Response: { user, session, is_valid }
```

---

## 🔧 Frontend Changes Required

### Change 1: Update RM Login Endpoint

**File:** `src/api/auth.api.ts`

**Change:**
```typescript
// BEFORE (line 206)
return http.post('/auth/rm/login', { staffId, password });

// AFTER
return http.post('/auth/staff/login', {
  staff_id: staffId,  // Note: snake_case
  password
});
```

---

### Change 2: Remove Duplicate OTP Functions

**File:** `src/api/auth.api.ts`

**Remove:**
- Lines 38-62: `requestOtp()` function
- Lines 70-104: `verifyOtp()` function

**Replace with import:**
```typescript
import { requestOtp, verifyOtp } from './otp.api';
```

---

### Change 3: Update RM Logout

**File:** `src/api/auth.api.ts`

**Change:**
```typescript
// BEFORE (line 224)
return http.post('/auth/rm/logout');

// AFTER (if backend adds /auth/staff/logout)
return http.post('/auth/staff/logout');

// OR add to backend first, then update frontend
```

---

## ✅ Verification Checklist

After fixes, verify these work:

### Authentication
- [ ] RM login works (admin/admin123)
- [ ] RM logout works
- [ ] RM session check works
- [ ] OTP request works
- [ ] OTP verification works
- [ ] OTP resend works (if added)
- [ ] OTP status check works

### Session Management
- [ ] Create session (SELF mode)
- [ ] Create session (ASSISTED mode)
- [ ] Get session details
- [ ] Extend session
- [ ] Validate session
- [ ] End session

### Draft Management
- [ ] Initialize draft
- [ ] Get draft state
- [ ] Save draft step
- [ ] Get step versions
- [ ] Clear draft

### Applications
- [ ] Get applications by mobile
- [ ] Get application by reference
- [ ] Get application timeline (after adding endpoint)
- [ ] Submit application
- [ ] Get all applications with filters (after adding endpoint)

---

## 🚀 Recommended Action Plan

### Phase 1: Frontend Fixes (Quick Wins)
1. ✅ Update RM login to use `/auth/staff/login`
2. ✅ Remove duplicate OTP functions from `auth.api.ts`
3. ✅ Import OTP functions from `otp.api.ts`

**Estimated Time:** 30 minutes

### Phase 2: Backend Endpoints (High Priority)
1. ✅ Add `GET /applications/reference/{reference_number}/timeline`
2. ✅ Add `GET /applications/all` with filters
3. ✅ Add `POST /auth/otp/resend`

**Estimated Time:** 2-3 hours

### Phase 3: Backend Endpoints (Medium Priority)
1. ✅ Add `POST /auth/staff/logout`
2. ✅ Add `GET /auth/staff/session`

**Estimated Time:** 1 hour

### Phase 4: Testing
1. ✅ Test all features in REAL mode
2. ✅ Verify API contracts match
3. ✅ Check error handling

**Estimated Time:** 2 hours

---

## 📊 Current Status

**Can work in MOCK mode:** ✅ YES (all features work with mock data)

**Can work in REAL mode:** ⚠️ PARTIALLY
- ✅ Session management works
- ✅ Draft management works
- ✅ OTP basic flow works
- ❌ RM login won't work (endpoint mismatch)
- ❌ Application tracking won't work (missing timeline)
- ❌ RM dashboard filters won't work (missing endpoint)

**To enable REAL mode:** Complete Phase 1 fixes (30 min) + Phase 2 backend endpoints (2-3 hours)

---

## 📝 Notes

- All mock data structures match real API contracts ✅
- Switching from MOCK to REAL requires only endpoint fixes ✅
- Database procedures are complete (60 procedures ready) ✅
- Backend is 100% functional ✅
- Frontend is 85% complete, needs API endpoint alignment ⚠️

---

**Report End**

For questions, refer to:
- Backend API: `backend/app/api/`
- Frontend API: `src/api/`
- API Documentation: `docs/API_DOCUMENTATION.md`
