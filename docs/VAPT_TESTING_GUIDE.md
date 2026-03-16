# MTB Credit Card API - VAPT Testing Guide

**Document Version:** 1.0.0
**Purpose:** Vulnerability Assessment and Penetration Testing Guide
**Last Updated:** January 30, 2026

---

## Overview

This document provides security information for performing Vulnerability Assessment and Penetration Testing (VAPT) on the MTB Credit Card Application System API.

### Contact Information

**Security Team Contact:** security@mtb.com.bd
**Development Team Contact:** dev@mtb.com.bd
**Testing Window:** [To be scheduled]

---

## API Endpoints Summary

| Category | Endpoints | Authentication |
|----------|-----------|----------------|
| Reference Data | 4 endpoints | None |
| Authentication | 7 endpoints | OTP/JWT |
| Session Management | 5 endpoints | Session ID |
| Applications | 6 endpoints | Session ID / JWT |
| Drafts | 5 endpoints | Session ID |
| Submission | 4 endpoints | Session ID |
| Dashboard | 3 endpoints | JWT (staff endpoints) |
| Form Steps | 12 endpoints | Session ID |
| Landing Page | 1 endpoint | None |

**Total Endpoints:** 47

**Base URL:** `http://localhost:8000/api/v1`

---

## Authentication & Authorization

### Applicant Authentication (OTP-Based)

**Flow:**
1. Request OTP → Mobile number verification
2. Verify OTP → Session creation
3. Use session ID for subsequent requests

**Security Controls:**
- Rate limiting: 5 OTP requests per hour per mobile
- Max attempts: 5 OTP attempts before 30-minute lockout
- OTP expiry: 5 minutes
- OTP length: 6 digits

**Test Cases:**
- [ ] Brute force OTP (should be blocked after 5 attempts)
- [ ] OTP replay attack (should fail)
- [ ] Session hijacking (validate session binding)
- [ ] Mobile number enumeration (should be rate limited)

### Staff Authentication (JWT-Based)

**Flow:**
1. Login with staff_id + password → JWT tokens
2. Use access token for authenticated requests
3. Refresh token before expiry

**Security Controls:**
- Password hashing: bcrypt (12 rounds)
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Token signing: HS256 algorithm

**Test Cases:**
- [ ] JWT token manipulation
- [ ] Token expiry validation
- [ ] Refresh token reuse prevention
- [ ] Password brute force (rate limited: 10 attempts per 15 min)
- [ ] Session fixation

---

## Rate Limiting

### Rate Limits by Endpoint

| Endpoint Type | Limit | Window | Scope |
|---------------|-------|--------|-------|
| OTP Send | 5 requests | Per hour | Per mobile number |
| OTP Verify | 5 attempts | Per lockout | Per mobile number |
| Draft Save | 10 requests | Per minute | Per session |
| Staff Login | 10 attempts | Per 15 min | Per IP |
| General API | 100 requests | Per minute | Per IP |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1643746800
```

**Test Cases:**
- [ ] Exceed rate limits (should return 429)
- [ ] Distributed rate limit bypass
- [ ] IP rotation to bypass limits
- [ ] Header manipulation

---

## Input Validation

### Validation Controls

- **Framework:** Pydantic schemas
- **Type checking:** Strict type validation
- **Length limits:** Enforced on all string fields
- **Format validation:** Regex patterns for NID, mobile, email

**Test Cases:**
- [ ] SQL injection via all input fields
- [ ] XSS via form fields
- [ ] CSRF token validation
- [ ] Command injection
- [ ] Path traversal
- [ ] LDAP injection
- [ ] XXE (XML External Entity)

### Example Validations

| Field | Validation |
|-------|------------|
| NID Number | 13 digits, numeric |
| Mobile Number | 11 digits, starts with 01, valid format |
| Email | RFC 5322 compliant |
| OTP | 6 digits, numeric |
| Monthly Income | Numeric, positive, max 12 digits |

---

## Session Management

### Session Security

- **Session ID:** UUID-based, cryptographically random
- **Session TTL:** 30 minutes (configurable)
- **Session Storage:** Redis with TLS
- **Session Binding:** IP + User Agent binding

**Test Cases:**
- [ ] Session fixation
- [ ] Session hijacking
- [ ] Session prediction
- [ ] Session timeout validation
- [ ] Concurrent session handling
- [ ] Session revocation

---

## Data Protection

### Data at Rest

- **Passwords:** bcrypt with 12 salt rounds
- **NID Numbers:** Encrypted in database
- **Mobile Numbers:** Masked in logs (last 2 digits visible only)
- **Session Data:** Encrypted in Redis

### Data in Transit

- **TLS Version:** 1.2 or higher required
- **Cipher Suites:** Strong cipher suites only
- **HSTS:** Enabled with max-age=31536000
- **Forward Secrecy:** Supported

**Test Cases:**
- [ ] TLS/SSL vulnerabilities (Heartbleed, POODLE, etc.)
- [ ] Weak cipher suites
- [ ] Certificate validation
- [ ] Man-in-the-Middle attacks
- [ ] Sensitive data in URL parameters
- [ ] Sensitive data in logs

### Data Masking

**Masked Fields in API Responses:**
```json
{
  "mobile_number": "0171******78",  // Only first 4 and last 2 visible
  "nid_number": "1234****5678"       // Partially masked
}
```

**Never Exposed:**
- Full OTP codes (in logs or responses)
- Passwords (in any format)
- Session tokens in URLs
- JWT secrets

---

## CORS Configuration

### Allowed Origins

**Development:**
- `http://localhost:8080`
- `http://localhost:5173`

**Production:**
- `https://mtb.com.bd`
- `https://app.mtb.com.bd`

**CORS Headers:**
```
Access-Control-Allow-Origin: [allowed origin]
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

**Test Cases:**
- [ ] CORS misconfiguration
- [ ] Origin reflection
- [ ] Null origin bypass
- [ ] Cross-origin request forgery

---

## Security Headers

### Implemented Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Test Cases:**
- [ ] Header validation
- [ ] Clickjacking protection
- [ ] MIME-type sniffing
- [ ] XSS protection bypass

---

## Error Handling

### Safe Error Messages

**Production Mode:**
- Generic error messages
- No stack traces exposed
- No database errors shown
- No internal paths revealed

**Development Mode:**
- Detailed error messages
- Stack traces shown
- Debug information

**Test Cases:**
- [ ] Information disclosure via errors
- [ ] Stack trace exposure
- [ ] Database error leakage
- [ ] Verbose error messages

---

## File Upload (Documents)

### Upload Security

**Allowed File Types:**
- Images: JPG, JPEG, PNG
- Documents: PDF

**File Size Limit:** 5 MB

**Security Controls:**
- Content-type validation
- File extension validation
- Magic number verification
- Virus scanning (recommended)
- Random filename generation
- Separate storage domain (recommended)

**Test Cases:**
- [ ] Malicious file upload
- [ ] File size limit bypass
- [ ] File type bypass (double extension, etc.)
- [ ] Path traversal via filename
- [ ] Virus/malware upload

---

## API Security Best Practices

### Implemented Controls

✅ **Input Validation:** All inputs validated via Pydantic
✅ **Output Encoding:** JSON encoding prevents XSS
✅ **Authentication:** OTP for users, JWT for staff
✅ **Authorization:** Role-based access control
✅ **Session Management:** Secure session handling
✅ **Rate Limiting:** Multiple rate limit tiers
✅ **CORS:** Whitelist-based CORS
✅ **Security Headers:** Comprehensive header set
✅ **Encryption:** TLS 1.2+, bcrypt, data masking
✅ **Logging:** Audit logging for sensitive operations
✅ **Error Handling:** Safe error messages

---

## Known Security Considerations

### Items for Review

1. **File Upload:** Virus scanning not yet implemented
2. **2FA:** Staff 2FA not yet implemented
3. **API Versioning:** No versioning strategy yet
4. **GraphQL:** N/A (REST only)
5. **Webhooks:** N/A (no webhooks yet)

### Future Enhancements

- [ ] API key authentication for partners
- [ ] IP whitelisting for admin endpoints
- [ ] Request signing for sensitive operations
- [ ] Web Application Firewall (WAF)
- [ ] Database activity monitoring
- [ ] API anomaly detection

---

## Testing Checklist

### Authentication & Authorization

- [ ] OTP brute force protection
- [ ] JWT token security
- [ ] Session management
- [ ] Authorization bypass
- [ ] Privilege escalation

### Input Validation

- [ ] SQL injection
- [ ] XSS
- [ ] CSRF
- [ ] Command injection
- [ ] LDAP injection
- [ ] XXE

### Rate Limiting & DoS

- [ ] Rate limit enforcement
- [ ] DoS protection
- [ ] Resource exhaustion
- [ ] Slowloris attacks

### Data Protection

- [ ] Sensitive data exposure
- [ ] Data encryption
- [ ] Log sanitization
- [ ] Cache control

### API Security

- [ ] Parameter tampering
- [ ] Mass assignment
- [ ] IDOR (Insecure Direct Object Reference)
- [ ] API key management

### Configuration

- [ ] CORS configuration
- [ ] Security headers
- [ ] TLS configuration
- [ ] Default credentials

---

## Reporting Vulnerabilities

### How to Report

1. **Email:** security@mtb.com.bd
2. **Subject:** [VAPT Finding] - [Brief Description]
3. **Include:**
   - Vulnerability description
   - Steps to reproduce
   - Proof of concept (if applicable)
   - Severity assessment
   - Recommended fix

### Severity Ratings

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | Immediate risk, data exposure | 24 hours |
| High | Significant security impact | 48 hours |
| Medium | Moderate security impact | 1 week |
| Low | Minor security issue | 2 weeks |
| Info | Informational | Best effort |

---

## Appendix

### Test Environment Setup

```bash
# 1. Clone repository
git clone [repository-url]
cd mtbcreditcard

# 2. Install dependencies
cd backend
pip install -e .

# 3. Configure environment
cp .env.example .env
# Edit .env with test credentials

# 4. Start services
docker-compose up -d

# 5. Run backend
uvicorn app.main:app --reload --port 8000
```

### Test Credentials

**Staff Login:**
- Username: `admin`
- Password: `admin123` (change in production)

**Test Mobile:** `01712345678`
**Test NID:** `1234567890123`

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-30 | MTB Dev Team | Initial release |

**Approved By:** [Security Lead]
**Review Date:** [To be scheduled]

---

**Disclaimer:** This document is for authorized security testing only. Unauthorized testing is prohibited.
