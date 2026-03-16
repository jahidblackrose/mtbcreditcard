# MTB Credit Card API Documentation

## Base URL

```
Development: http://localhost:8000/api/v1
Production: https://api.mtb.com.bd/v1
```

## Authentication

### Applicant Authentication (OTP-based)

#### Request OTP
```http
POST /api/v1/auth/otp/request
Content-Type: application/json

{
  "mobile_number": "01712345678",
  "session_id": "optional-session-id"
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
    "mobile_number": "0171****78",
    "attempts_remaining": 5
  }
}
```

#### Verify OTP
```http
POST /api/v1/auth/otp/verify
Content-Type: application/json

{
  "mobile_number": "01712345678",
  "otp": "123456",
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "OTP verified successfully",
  "data": {
    "verified": true,
    "session_id": "abc123",
    "user_exists": true,
    "has_pending_applications": false
  }
}
```

### Staff Authentication (JWT)

#### Staff Login
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

**Use the access token in subsequent requests:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Reference Data

### Get Card Products
```http
GET /api/v1/reference/card-products
```

### Get Reference Data by Type
```http
GET /api/v1/reference/{type}
```

**Valid Types:**
- `CARD_NETWORK`
- `CARD_TIER`
- `CARD_CATEGORY`
- `CUSTOMER_SEGMENT`
- `EMPLOYMENT_TYPE`
- `PROFESSION`
- `NID_TYPE`
- `MARITAL_STATUS`
- `GENDER`
- `EDUCATION`
- `ADDRESS_TYPE`
- `BANK`
- `DOCUMENT_TYPE`

### Check Eligibility
```http
POST /api/v1/reference/check-eligibility?monthly_income=50000
```

### Get Banks
```http
GET /api/v1/reference/banks
```

## Session Management

### Create Session
```http
POST /api/v1/session/create
Content-Type: application/json

{
  "mode": "SELF"
}
```

### Get Session
```http
GET /api/v1/session/{session_id}
```

### Extend Session
```http
POST /api/v1/session/{session_id}/extend
Content-Type: application/json

{
  "extension_minutes": 30
}
```

### End Session
```http
DELETE /api/v1/session/{session_id}
```

### Validate Session
```http
GET /api/v1/session/{session_id}/validate
```

## Application CRUD

### Create Application
```http
POST /api/v1/applications
Content-Type: application/json

{
  "mode": "SELF",
  "card_id": "VISA_PLATINUM"
}
```

### Get Application
```http
GET /api/v1/applications/{application_id}
```

### Get Application by Reference
```http
GET /api/v1/applications/reference/{reference_number}
```

### Get Applications by Mobile
```http
GET /api/v1/applications/mobile/{mobile_number}?page=1&limit=10
```

### Update Application Status
```http
PATCH /api/v1/applications/{application_id}/status
Content-Type: application/json

{
  "status": "UNDER_REVIEW",
  "reason": "Submitted for review"
}
```

### Submit Application
```http
POST /api/v1/applications/{application_id}/submit
Content-Type: application/json

{
  "session_id": "optional-session-id"
}
```

## Draft Management

### Initialize Draft
```http
POST /api/v1/drafts/initialize
Content-Type: application/json

{
  "session_id": "abc123",
  "mode": "SELF"
}
```

### Get Draft
```http
GET /api/v1/drafts/{session_id}
```

### Save Draft Step
```http
POST /api/v1/drafts/save
Content-Type: application/json

{
  "session_id": "abc123",
  "step_number": 1,
  "step_name": "Card Selection",
  "data": {...},
  "is_complete": true
}
```

### Clear Draft
```http
DELETE /api/v1/drafts/{session_id}
```

### Get Step Versions
```http
GET /api/v1/drafts/{session_id}/versions
```

## Application Form Steps

### Step 1: Card Selection
```http
POST /api/v1/applications/{application_id}/card-selection
Content-Type: application/json

{
  "card_id": "VISA_PLATINUM",
  "network": "VISA",
  "tier": "PLATINUM",
  "category": "CLASSIC",
  "requested_limit": "50000"
}
```

### Step 2: Personal Info
```http
POST /api/v1/applications/{application_id}/personal-info
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "gender": "MALE",
  "marital_status": "SINGLE",
  "education": "GRADUATE",
  "nationality": "Bangladeshi",
  "nid_number": "1234567890123",
  "nid_type": "NID",
  "mobile_number": "01712345678",
  "email_address": "john@example.com"
}
```

### Step 2b: Addresses
```http
POST /api/v1/applications/{application_id}/addresses
Content-Type: application/json

{
  "present_address": {
    "address_type": "PRESENT",
    "address_line1": "House 123, Road 10",
    "address_line2": "Dhanmondi",
    "city": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka",
    "post_code": "1205",
    "country": "Bangladesh",
    "ownership_type": "OWNED"
  },
  "permanent_address": {...},
  "same_as_permanent": false
}
```

### Steps 3-12

Similar structure for remaining steps:
- `/applications/{id}/professional-info`
- `/applications/{id}/monthly-income`
- `/applications/{id}/bank-accounts`
- `/applications/{id}/credit-facilities`
- `/applications/{id}/nominee`
- `/applications/{id}/supplementary`
- `/applications/{id}/references`
- `/applications/{id}/media`
- `/applications/{id}/documents`
- `/applications/{id}/auto-debit`
- `/applications/{id}/declarations`

## Submission

### Submit by Session
```http
POST /api/v1/submission/by-session
Content-Type: application/json

{
  "session_id": "abc123"
}
```

### Submit Full Application
```http
POST /api/v1/submission/full
Content-Type: application/json

{
  "application_data": {
    // Complete application data
  }
}
```

### Get Submission Status
```http
GET /api/v1/submission/status/{application_id}
```

## Dashboard

### My Applications
```http
GET /api/v1/dashboard/my-applications?page=1&limit=10
```

### Track by Reference
```http
GET /api/v1/dashboard/track/{reference_number}
```

### Dashboard Stats
```http
GET /api/v1/dashboard/stats?branch_id=optional
```

### Application Details
```http
GET /api/v1/dashboard/application/{application_id}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests (Rate Limit) |
| 500 | Internal Server Error |

## Database Procedure Error Codes

| Code | Procedure | Description |
|------|-----------|-------------|
| 501 | get_card_products | Failed to get card products |
| 502 | get_reference_data | Failed to get reference data |
| 503 | check_eligibility | Eligibility check failed |
| 504 | get_bank_list | Failed to get bank list |
| 505-560 | Various | See database procedures |
