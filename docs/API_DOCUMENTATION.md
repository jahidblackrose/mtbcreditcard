# MTB Credit Card System - API Documentation

**Version:** 1.0.0
**Base URL:** `http://localhost:8000/api/v1`
**Documentation:** http://localhost:8000/docs (Swagger UI)
**Last Updated:** January 30, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Security](#security)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [API Endpoints](#api-endpoints)
   - [Reference Data](#1-reference-data)
   - [Authentication](#2-authentication)
   - [Session Management](#3-session-management)
   - [Applications](#4-applications)
   - [Drafts](#5-drafts)
   - [Submission](#6-submission)
   - [Dashboard](#7-dashboard)
   - [Landing Page](#8-landing-page)
   - [Form Steps](#9-form-steps)
7. [Data Models](#data-models)
8. [Procedure Reference](#procedure-reference)

---

## Overview

The MTB Credit Card Application System API is a RESTful API built with FastAPI that handles credit card applications, OTP authentication, session management, and dashboard operations.

### Key Features

- **60 Database Procedures** - Oracle database integration with PL/SQL procedures
- **JWT Authentication** - Token-based authentication for staff
- **OTP System** - SMS-based verification for applicants
- **Session Management** - Redis-backed session handling
- **Draft Auto-Save** - Automatic form saving
- **Rate Limiting** - Protection against abuse

### Supported Operations

| Operation | Description |
|-----------|-------------|
| Credit Card Application | 12-step application form |
| Reference Data | Banks, occupations, card products |
| Authentication | OTP for applicants, JWT for staff |
| Session Management | Create, validate, extend sessions |
| Draft Management | Save, restore, version drafts |
| Dashboard | Applicant and RM views |

---

## Authentication

### Applicant Authentication (OTP-Based)

Applicants authenticate using One-Time Password (OTP) sent to their mobile number.

```mermaid
sequenceDiagram
    participant A as Applicant
    participant API as API
    participant DB as Database
    participant SMS as SMS Gateway

    A->>API: POST /auth/otp/request
    API->>DB: Request OTP
    DB->>SMS: Send OTP
    SMS-->>A: OTP delivered
    API-->>A: OTP sent confirmation

    A->>API: POST /auth/otp/verify
    API->>DB: Verify OTP
    DB-->>API: Verified
    API-->>A: Authenticated + Session
```

### Staff Authentication (JWT-Based)

Staff members authenticate using username/password and receive JWT tokens.

#### Login

```http
POST /api/v1/auth/staff/login
Content-Type: application/json

{
  "staff_id": "admin",
  "password": "password123"
}
```

#### Response

```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "user_id": "STAFF_001",
      "staff_id": "admin",
      "name": "Administrator",
      "role": "ADMIN",
      "branch_id": "HEAD_OFFICE",
      "branch_name": "Head Office"
    }
  }
}
```

#### Using Access Token

```http
GET /api/v1/dashboard/applications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Refresh Token

```http
POST /api/v1/auth/staff/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Security

### CORS Configuration

The API enforces CORS policies. Only allowed origins can access the API.

**Development Origins:**
- `http://localhost:8080`
- `http://localhost:5173`

**Production Origins:**
- `https://mtb.com.bd`
- `https://app.mtb.com.bd`

### Security Headers

All responses include security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### Data Encryption

- **TLS 1.2+** required for all production communications
- **Passwords** hashed using bcrypt (salt rounds: 12)
- **JWT** signed with HS256 algorithm
- **Sensitive data** masked in API responses (mobile numbers, NIDs)

### Input Validation

- **Pydantic schemas** validate all inputs
- **SQL injection protection** via parameterized queries
- **XSS protection** via content sanitization

---

## Error Handling

### Standard Error Response

```json
{
  "status": 400,
  "message": "Bad Request",
  "detail": "Invalid mobile number format"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Validation Error - Input validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Procedure Error Codes

| Error Code | Description |
|------------|-------------|
| 501-560 | Database procedure errors |
| 511 | Applicant not found |
| 513 | Invalid OTP |
| 515 | OTP verification failed |
| 545 | Session not found |
| 549 | Draft initialization failed |

---

## Rate Limiting

### Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| OTP Send | 5 requests | Per hour per mobile |
| Draft Save | 10 requests | Per minute per session |
| General API | 100 requests | Per minute per IP |
| Staff Login | 10 attempts | Per 15 minutes per IP |

### Rate Limit Response

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1643746800

{
  "status": 429,
  "message": "Rate limit exceeded",
  "detail": "Too many requests. Please try again later."
}
```

---

## API Endpoints

### 1. Reference Data

Endpoints for retrieving reference data (cards, banks, occupations, etc.).

#### 1.1 Get Card Products

Get all available credit card products.

```http
GET /api/v1/reference/card-products
```

**Response:**
```json
{
  "status": 200,
  "message": "Card products retrieved successfully",
  "data": [
    {
      "card_id": 1,
      "product_name": "MTB Titanium",
      "card_network": "VISA",
      "card_tier": "TITANIUM",
      "annual_fee": 2000,
      "features": ["Complimentary lounge access", "Travel insurance"],
      "requirements": {
        "min_monthly_income": 50000,
        "min_age": 21,
        "documents_required": ["NID", "TIN", "Bank Statement"]
      }
    }
  ]
}
```

**Procedure:** 501 (get_card_products)

---

#### 1.2 Get Reference Data

Get reference data by type.

```http
GET /api/v1/reference/reference/{type}
```

**Path Parameters:**
- `type` (required): Reference data type
  - Valid values: `CARD_NETWORK`, `CARD_TIER`, `CARD_CATEGORY`, `CUSTOMER_SEGMENT`,
    `EMPLOYMENT_TYPE`, `PROFESSION`, `NID_TYPE`, `MARITAL_STATUS`, `GENDER`, `EDUCATION`,
    `ADDRESS_TYPE`, `BANK`, `DOCUMENT_TYPE`

**Example:**
```http
GET /api/v1/reference/reference/MARITAL_STATUS
```

**Response:**
```json
{
  "status": 200,
  "message": "Reference data for MARITAL_STATUS retrieved successfully",
  "data": [
    { "value": "SINGLE", "label": "Single" },
    { "value": "MARRIED", "label": "Married" },
    { "value": "DIVORCED", "label": "Divorced" },
    { "value": "WIDOWED", "label": "Widowed" }
  ]
}
```

**Procedure:** 502 (get_reference_data)

---

#### 1.3 Check Eligibility

Check credit card eligibility based on monthly income.

```http
POST /api/v1/reference/check-eligibility?monthly_income=50000
```

**Query Parameters:**
- `monthly_income` (required): Monthly income amount

**Response:**
```json
{
  "status": 200,
  "message": "Eligibility check completed",
  "data": {
    "eligible": true,
    "eligible_cards": [
      {
        "card_id": 2,
        "product_name": "MTB Classic",
        "max_limit": 100000
      }
    ],
    "ineligible_reasons": []
  }
}
```

**Procedure:** 503 (check_eligibility)

---

#### 1.4 Get Banks

Get list of banks for bank account selection.

```http
GET /api/v1/reference/banks
```

**Response:**
```json
{
  "status": 200,
  "message": "Bank list retrieved successfully",
  "data": [
    { "code": "MTB", "name": "Mutual Trust Bank" },
    { "code": "DBBL", "name": "Dutch-Bangla Bank" },
    { "code": "BRAC", "name": "BRAC Bank" }
  ]
}
```

**Procedure:** 504 (get_bank_list)

---

### 2. Authentication

Endpoints for applicant OTP verification and staff JWT authentication.

#### 2.1 Check Existing Applicant

Check if an applicant already exists in the system.

```http
POST /api/v1/auth/check-existing
Content-Type: application/json

{
  "nid_number": "1234567890123",
  "mobile_number": "01712345678"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Applicant check completed",
  "data": {
    "exists": true,
    "applicant_id": "APP_001",
    "has_pending_applications": true
  }
}
```

**Procedure:** 511 (check_existing_applicant)

---

#### 2.2 Request OTP

Request OTP for mobile verification.

```http
POST /api/v1/auth/otp/request
Content-Type: application/json

{
  "mobile_number": "01712345678",
  "session_id": "abc123xyz"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "OTP sent successfully",
  "data": {
    "otp_sent": true,
    "expires_in": 300,
    "mobile_number": "0171******78",
    "attempts_remaining": 5
  }
}
```

**Rate Limit:** 5 requests per hour per mobile number

**Procedure:** 512 (request_otp)

---

#### 2.3 Verify OTP

Verify OTP code.

```http
POST /api/v1/auth/otp/verify
Content-Type: application/json

{
  "mobile_number": "01712345678",
  "otp": "123456",
  "session_id": "abc123xyz"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "OTP verified successfully",
  "data": {
    "verified": true,
    "session_id": "abc123xyz",
    "user_exists": false,
    "has_pending_applications": false
  }
}
```

**Rate Limit:** Max 5 attempts before lockout (30 minutes)

**Procedure:** 513 (verify_otp)

---

#### 2.4 Get OTP Status

Get OTP verification status.

```http
GET /api/v1/auth/otp/status?mobile_number=01712345678&session_id=abc123xyz
```

**Response:**
```json
{
  "status": 200,
  "message": "OTP status retrieved",
  "data": {
    "mobile_number": "0171******78",
    "is_verified": true,
    "attempts_remaining": 4,
    "is_locked": false,
    "lockout_expires_at": null
  }
}
```

**Procedure:** 514 (get_otp_status)

---

#### 2.5 Verify OTP (Extended)

Verify OTP with extended response (includes user details).

```http
POST /api/v1/auth/otp/verify-extended
Content-Type: application/json

{
  "mobile_number": "01712345678",
  "otp": "123456",
  "session_id": "abc123xyz"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "OTP verified successfully",
  "data": {
    "verified": true,
    "user": {
      "applicant_id": "APP_001",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "pending_applications": []
  }
}
```

**Procedure:** 515 (verify_otp_extended)

---

#### 2.6 Staff Login

Staff login with username/password (JWT).

```http
POST /api/v1/auth/staff/login
Content-Type: application/json

{
  "staff_id": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "user_id": "STAFF_001",
      "staff_id": "admin",
      "name": "Administrator",
      "role": "ADMIN",
      "branch_id": "HEAD_OFFICE"
    }
  }
}
```

**Token Expiry:**
- Access Token: 15 minutes
- Refresh Token: 7 days

---

#### 2.7 Refresh Token

Refresh access token using refresh token.

```http
POST /api/v1/auth/staff/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900
  }
}
```

---

### 3. Session Management

Endpoints for managing application sessions.

#### 3.1 Create Session

Create a new application session.

```http
POST /api/v1/session/create
Content-Type: application/json

{
  "mode": "SELF"
}
```

**Request Body:**
- `mode` (required): Application mode
  - `SELF`: Self-application
  - `RM`: RM-assisted application

**Response:**
```json
{
  "status": 200,
  "message": "Session created successfully",
  "data": {
    "session_id": "sess_abc123xyz",
    "mode": "SELF",
    "expires_at": "2026-01-30T15:30:00Z",
    "ttl_seconds": 1800
  }
}
```

**Procedure:** 544 (create_session)

---

#### 3.2 Get Session

Get session details by session ID.

```http
GET /api/v1/session/{session_id}
```

**Response:**
```json
{
  "status": 200,
  "message": "Session retrieved successfully",
  "data": {
    "session_id": "sess_abc123xyz",
    "mode": "SELF",
    "is_active": true,
    "created_at": "2026-01-30T14:00:00Z",
    "expires_at": "2026-01-30T15:30:00Z",
    "mobile_number": "0171******78"
  }
}
```

**Procedure:** 545 (get_session)

---

#### 3.3 Extend Session

Extend session TTL.

```http
POST /api/v1/session/{session_id}/extend
Content-Type: application/json

{
  "extension_minutes": 30
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Session extended successfully",
  "data": {
    "session_id": "sess_abc123xyz",
    "new_expires_at": "2026-01-30T16:00:00Z",
    "ttl_seconds": 1800
  }
}
```

**Procedure:** 546 (extend_session)

---

#### 3.4 End Session

End/delete a session.

```http
DELETE /api/v1/session/{session_id}
```

**Response:**
```json
{
  "status": 200,
  "message": "Session ended successfully",
  "data": null
}
```

**Procedure:** 547 (end_session)

---

#### 3.5 Validate Session

Validate a session (check if active and not expired).

```http
GET /api/v1/session/{session_id}/validate
```

**Response:**
```json
{
  "status": 200,
  "message": "Session validation completed",
  "data": {
    "is_valid": true,
    "is_active": true,
    "is_expired": false,
    "time_remaining_seconds": 1200
  }
}
```

**Procedure:** 548 (validate_session)

---

### 4. Applications

Application CRUD operations.

#### 4.1 Create Application

Create a new credit card application.

```http
POST /api/v1/applications
Content-Type: application/json

{
  "mode": "SELF",
  "card_id": 1
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Application created successfully",
  "data": {
    "application_id": "APP_20260130_001",
    "reference_number": "MTBCC-20260130-001",
    "status": "DRAFT",
    "created_at": "2026-01-30T14:00:00Z"
  }
}
```

**Procedure:** 505 (create_application)

---

#### 4.2 Get Application

Get application by ID.

```http
GET /api/v1/applications/{application_id}
```

**Response:**
```json
{
  "status": 200,
  "message": "Application retrieved successfully",
  "data": {
    "application_id": "APP_20260130_001",
    "reference_number": "MTBCC-20260130-001",
    "status": "DRAFT",
    "card": {
      "product_name": "MTB Titanium"
    },
    "applicant": {
      "name": "John Doe",
      "mobile_number": "0171******78"
    },
    "created_at": "2026-01-30T14:00:00Z",
    "updated_at": "2026-01-30T14:30:00Z"
  }
}
```

**Procedure:** 506 (get_application)

---

#### 4.3 Get Application by Reference

Get application by reference number.

```http
GET /api/v1/applications/reference/{reference_number}
```

**Procedure:** 507 (get_application_by_reference)

---

#### 4.4 Get Applications by Mobile

Get applications by mobile number (paginated).

```http
GET /api/v1/applications/mobile/01712345678?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "status": 200,
  "message": "Applications retrieved successfully",
  "data": {
    "applications": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

**Procedure:** 508 (get_application_by_mobile)

---

#### 4.5 Update Application Status

Update application status.

```http
PATCH /api/v1/applications/{application_id}/status
Content-Type: application/json

{
  "status": "UNDER_REVIEW",
  "reason": "Application submitted for review"
}
```

**Status Values:**
- `DRAFT`: Draft state
- `SUBMITTED`: Submitted for review
- `UNDER_REVIEW`: Under review
- `APPROVED`: Approved
- `REJECTED`: Rejected
- `DOCUMENTS_REQUIRED`: Additional documents needed

**Procedure:** 509 (update_application_status)

---

#### 4.6 Submit Application

Submit a credit card application.

```http
POST /api/v1/applications/{application_id}/submit
Content-Type: application/json

{
  "session_id": "sess_abc123xyz"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Application submitted successfully",
  "data": {
    "application_id": "APP_20260130_001",
    "reference_number": "MTBCC-20260130-001",
    "status": "SUBMITTED",
    "submitted_at": "2026-01-30T14:30:00Z"
  }
}
```

**Procedure:** 510 (submit_application)

---

### 5. Drafts

Draft management endpoints for auto-save functionality.

#### 5.1 Initialize Draft

Initialize a new draft for a session.

```http
POST /api/v1/drafts/initialize
Content-Type: application/json

{
  "session_id": "sess_abc123xyz",
  "mode": "SELF"
}
```

**Procedure:** 549 (initialize_draft)

---

#### 5.2 Get Draft

Get draft by session ID.

```http
GET /api/v1/drafts/{session_id}
```

**Response:**
```json
{
  "status": 200,
  "message": "Draft retrieved successfully",
  "data": {
    "draft_id": "draft_001",
    "session_id": "sess_abc123xyz",
    "steps": {
      "1": {
        "step_name": "card_selection",
        "data": { "card_id": 1 },
        "is_complete": true
      },
      "2": {
        "step_name": "personal_info",
        "data": { "name": "John Doe" },
        "is_complete": false
      }
    },
    "last_saved_at": "2026-01-30T14:25:00Z"
  }
}
```

**Procedure:** 550 (get_draft)

---

#### 5.3 Save Draft Step

Save a draft step.

```http
POST /api/v1/drafts/save
Content-Type: application/json

{
  "session_id": "sess_abc123xyz",
  "step_number": 2,
  "step_name": "personal_info",
  "data": {
    "name": "John Doe",
    "nid_number": "1234567890123",
    "mobile_number": "01712345678"
  },
  "is_complete": true
}
```

**Rate Limit:** 10 requests per minute per session

**Procedure:** 551 (save_draft_step)

---

#### 5.4 Clear Draft

Clear/delete a draft.

```http
DELETE /api/v1/drafts/{session_id}
```

**Procedure:** 552 (clear_draft)

---

#### 5.5 Get Step Versions

Get all step versions for a draft.

```http
GET /api/v1/drafts/{session_id}/versions
```

**Response:**
```json
{
  "status": 200,
  "message": "Draft versions retrieved successfully",
  "data": {
    "step_2": [
      {
        "version": 1,
        "saved_at": "2026-01-30T14:20:00Z",
        "data": { "name": "John" }
      },
      {
        "version": 2,
        "saved_at": "2026-01-30T14:25:00Z",
        "data": { "name": "John Doe" }
      }
    ]
  }
}
```

**Procedure:** 553 (get_step_versions)

---

### 6. Submission

Submission endpoints for final application submission.

#### 6.1 Submit by Session

Submit application by session ID.

```http
POST /api/v1/submission/by-session
Content-Type: application/json

{
  "session_id": "sess_abc123xyz"
}
```

**Procedure:** 554 (submit_by_session)

---

#### 6.2 Submit Full Application

Submit full application with all data at once.

```http
POST /api/v1/submission/full
Content-Type: application/json

{
  "application_data": {
    "card_id": 1,
    "applicant": {
      "name": "John Doe",
      "nid_number": "1234567890123",
      "mobile_number": "01712345678",
      "email": "john@example.com"
    },
    "step_1": { "card_id": 1 },
    "step_2": { "name": "John Doe" },
    ...
  }
}
```

**Procedure:** 555 (submit_full_application)

---

#### 6.3 Get Submission Status

Get submission status for an application.

```http
GET /api/v1/submission/status/{application_id}
```

**Response:**
```json
{
  "status": 200,
  "message": "Submission status retrieved",
  "data": {
    "application_id": "APP_001",
    "reference_number": "MTBCC-20260130-001",
    "status": "UNDER_REVIEW",
    "submitted_at": "2026-01-30T14:30:00Z",
    "is_complete": true,
    "completed_steps": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }
}
```

**Procedure:** 556 (get_submission_status)

---

#### 6.4 Save Full Application

Save full application (without submitting).

```http
POST /api/v1/submission/save-full
Content-Type: application/json

{
  "application_data": { ... }
}
```

**Procedure:** 543 (save_full_application)

---

### 7. Dashboard

Dashboard endpoints for applicants and staff.

#### 7.1 Applicant Dashboard

Get applicant dashboard data.

```http
GET /api/v1/dashboard/applicant/{session_id}
```

**Response:**
```json
{
  "status": 200,
  "message": "Dashboard data retrieved",
  "data": {
    "applicant": {
      "name": "John Doe",
      "mobile_number": "0171******78"
    },
    "applications": [
      {
        "application_id": "APP_001",
        "reference_number": "MTBCC-20260130-001",
        "card": "MTB Titanium",
        "status": "UNDER_REVIEW",
        "submitted_at": "2026-01-30T14:30:00Z"
      }
    ],
    "documents": [
      {
        "document_type": "NID",
        "status": "UPLOADED",
        "uploaded_at": "2026-01-30T14:15:00Z"
      }
    ]
  }
}
```

---

#### 7.2 RM Dashboard

Get RM dashboard data (requires authentication).

```http
GET /api/v1/dashboard/rm/applications
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

---

#### 7.3 Staff Statistics

Get staff statistics (requires authentication).

```http
GET /api/v1/dashboard/staff/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Statistics retrieved",
  "data": {
    "total_applications": 150,
    "pending_reviews": 25,
    "approved_today": 10,
    "rejected_today": 3,
    "conversion_rate": 68.5
  }
}
```

---

### 8. Landing Page

Landing page content endpoints.

#### 8.1 Get Features

Get product features for landing page.

```http
GET /api/v1/landing/features
```

**Response:**
```json
{
  "status": 200,
  "message": "Features retrieved",
  "data": [
    {
      "title": "Instant Approval",
      "description": "Get approved in 24 hours",
      "icon": "zap"
    },
    {
      "title": "No Hidden Charges",
      "description": "Transparent fee structure",
      "icon": "shield"
    }
  ]
}
```

---

### 9. Form Steps

12-step form endpoints for application process.

#### Step 1: Card Selection

```http
POST /api/v1/applications/{application_id}/step1/card-selection
Content-Type: application/json

{
  "card_id": 1
}
```

**Procedure:** 517 (save_card_selection)

---

#### Step 2: Personal Info

```http
POST /api/v1/applications/{application_id}/step2/personal-info
Content-Type: application/json

{
  "nid_number": "1234567890123",
  "nid_type": "NATIONAL",
  "name": "John Doe",
  "father_name": "Jane Doe",
  "mother_name": "Jane Smith",
  "date_of_birth": "1990-01-01",
  "gender": "MALE",
  "marital_status": "SINGLE",
  "education": "BACHELOR"
}
```

**Procedure:** 518 (save_personal_info)

---

#### Step 3: Professional Info

```http
POST /api/v1/applications/{application_id}/step3/professional-info
Content-Type: application/json

{
  "employment_type": "EMPLOYED",
  "profession": "PRIVATE_SECTOR",
  "employer_name": "ABC Company",
  "designation": "Manager",
  "office_address": "123 Business Street",
  "years_in_current_job": 3
}
```

**Procedure:** 519 (save_professional_info)

---

#### Step 4: Monthly Income

```http
POST /api/v1/applications/{application_id}/step4/monthly-income
Content-Type: application/json

{
  "monthly_income": 80000,
  "other_income": 20000,
  "income_source": "SALARY"
}
```

**Procedure:** 520 (save_monthly_income)

---

#### Step 5: Bank Accounts

```http
POST /api/v1/applications/{application_id}/step5/bank-accounts
Content-Type: application/json

{
  "bank_accounts": [
    {
      "bank_code": "MTB",
      "account_number": "1234567890",
      "account_type": "SAVINGS"
    }
  ]
}
```

**Procedure:** 521 (save_bank_accounts)

---

#### Step 6: Credit Facilities

```http
POST /api/v1/applications/{application_id}/step6/credit-facilities
Content-Type: application/json

{
  "has_existing_cards": true,
  "existing_cards": [
    {
      "bank": "DBBL",
      "limit": 100000
    }
  ],
  "has_existing_loans": false
}
```

**Procedure:** 522 (save_credit_facilities)

---

#### Step 7: Nominee

```http
POST /api/v1/applications/{application_id}/step7/nominee
Content-Type: application/json

{
  "nominee_name": "Jane Doe",
  "nominee_nid": "9876543210987",
  "nominee_mobile": "01812345678",
  "nominee_relation": "SPOUSE",
  "nominee_percentage": 100
}
```

**Procedure:** 523 (save_nominee)

---

#### Step 8: Supplementary Card

```http
POST /api/v1/applications/{application_id}/step8/supplementary
Content-Type: application/json

{
  "want_supplementary": true,
  "supplementary_cards": [
    {
      "name": "Jane Doe",
      "nid_number": "9876543210987",
      "mobile_number": "01812345678",
      "relation": "SPOUSE"
    }
  ]
}
```

**Procedure:** 524 (save_supplementary)

---

#### Step 9: References

```http
POST /api/v1/applications/{application_id}/step9/references
Content-Type: application/json

{
  "references": [
    {
      "name": "Reference 1",
      "mobile_number": "01912345678",
      "relation": "FRIEND",
      "address": "456 Reference Street"
    },
    {
      "name": "Reference 2",
      "mobile_number": "01612345678",
      "relation": "COLLEAGUE",
      "address": "789 Reference Road"
    }
  ]
}
```

**Procedure:** 525 (save_references)

---

#### Step 10: Documents

```http
POST /api/v1/applications/{application_id}/step10/documents
Content-Type: multipart/form-data

nid_document: [file]
photo: [file]
signature: [file]
other_documents: [files]
```

**Procedure:** 526 (save_documents)

---

#### Step 11: Auto Debit

```http
POST /api/v1/applications/{application_id}/step11/auto-debit
Content-Type: application/json

{
  "enable_auto_debit": true,
  "bank_code": "MTB",
  "account_number": "1234567890",
  "account_type": "SAVINGS"
}
```

**Procedure:** 527 (save_auto_debit)

---

#### Step 12: Declarations

```http
POST /api/v1/applications/{application_id}/step12/declarations
Content-Type: application/json

{
  "terms_accepted": true,
  "privacy_accepted": true,
  "data_accuracy_confirmed": true,
  "electronic_communication_accepted": true
}
```

**Procedure:** 528 (save_declarations)

---

## Data Models

### ApiResponse

Standard API response wrapper.

```typescript
{
  status: number,           // HTTP status code
  message: string,          // Response message
  data?: T | null          // Response data (generic)
}
```

### ErrorResponse

Standard error response.

```typescript
{
  status: number,          // HTTP error code
  message: string,         // Error message
  detail?: string          // Detailed error information
}
```

### ApplicationStatus

Application status enum.

```typescript
enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DOCUMENTS_REQUIRED = "DOCUMENTS_REQUIRED"
}
```

### ApplicationMode

Application mode enum.

```typescript
enum ApplicationMode {
  SELF = "SELF",           // Self-application
  RM = "RM"                // RM-assisted
}
```

### UserRole

Staff user role enum.

```typescript
enum UserRole {
  ADMIN = "ADMIN",
  RM = "RM",
  VERIFIER = "VERIFIER",
  APPROVER = "APPROVER"
}
```

---

## Procedure Reference

The API integrates with 60 Oracle database procedures. Each procedure is identified by an error code (501-560).

| Procedure Code | Name | Purpose |
|----------------|------|---------|
| 501 | get_card_products | Get available credit cards |
| 502 | get_reference_data | Get reference data by type |
| 503 | check_eligibility | Check eligibility based on income |
| 504 | get_bank_list | Get list of banks |
| 505 | create_application | Create new application |
| 506 | get_application | Get application by ID |
| 507 | get_application_by_reference | Get by reference number |
| 508 | get_application_by_mobile | Get applications by mobile |
| 509 | update_application_status | Update application status |
| 510 | submit_application | Submit application |
| 511 | check_existing_applicant | Check if applicant exists |
| 512 | request_otp | Request OTP |
| 513 | verify_otp | Verify OTP |
| 514 | get_otp_status | Get OTP status |
| 515 | verify_otp_extended | Verify OTP with extended data |
| 517-528 | Form Step Procedures | Save form steps 1-12 |
| 543 | save_full_application | Save complete application |
| 544 | create_session | Create new session |
| 545 | get_session | Get session details |
| 546 | extend_session | Extend session TTL |
| 547 | end_session | End session |
| 548 | validate_session | Validate session |
| 549-553 | Draft Procedures | Draft management |
| 554-556 | Submission Procedures | Submission management |
| 557-560 | Dashboard Procedures | Dashboard data |

---

## Testing

### Using Swagger UI

1. Start backend server: `uvicorn app.main:app --reload --port 8000`
2. Open: http://localhost:8000/docs
3. Select endpoint
4. Click "Try it out"
5. Fill parameters
6. Click "Execute"

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Get card products
curl http://localhost:8000/api/v1/reference/card-products

# Request OTP
curl -X POST http://localhost:8000/api/v1/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "01712345678", "session_id": "test123"}'
```

---

## Support

For API support, contact:
- **Email:** api-support@mtb.com.bd
- **Documentation:** [Internal Wiki]
- **Issue Tracker:** [JIRA/GitHub Issues]

---

**Document Version:** 1.0.0
**Last Updated:** January 30, 2026
**Maintained By:** MTB Development Team
