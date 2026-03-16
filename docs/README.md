# MTB Credit Card System - Documentation

This folder contains comprehensive documentation for the MTB Credit Card Application System.

---

## 📚 Documentation Files

### 1. Setup Guide (HTML)
**File:** `SETUP_GUIDE.html`

Complete developer setup guide with tabbed navigation covering:
- **Tab 1:** Database Setup (Oracle installation, DDL scripts, user creation)
- **Tab 2:** Backend API Setup (Python, FastAPI, environment configuration)
- **Tab 3:** Frontend Setup (React, Vite, TypeScript, environment config)

**How to Use:**
Simply open the HTML file in any modern web browser. No server required.

```
Open: docs/SETUP_GUIDE.html
```

---

### 2. API Documentation (Markdown)
**File:** `API_DOCUMENTATION.md`

Comprehensive API reference including:
- All 47 API endpoints with examples
- Request/response schemas
- Authentication flows (OTP + JWT)
- Error handling and status codes
- Rate limiting details
- Data models
- Database procedure reference (60 procedures)

**How to Use:**
Open in any Markdown viewer or IDE with Markdown preview.

```
View: docs/API_DOCUMENTATION.md
```

---

### 3. Postman Collection (JSON)
**File:** `MTB_Credit_Card_API.postman_collection.json`

Complete Postman collection for API testing including:
- All endpoints organized by category
- Environment variables
- Pre-configured requests with examples
- Test scripts for automatic token extraction
- Documentation for each endpoint

**How to Import:**
1. Open Postman
2. Click "Import" in top left
3. Select the file `MTB_Credit_Card_API.postman_collection.json`
4. Collection will be imported with all folders and requests

**Environment Variables Required:**
```
base_url: http://localhost:8000
api_prefix: /api/v1
session_id: (auto-populated)
application_id: (set during testing)
access_token: (auto-populated)
refresh_token: (auto-populated)
```

---

### 4. VAPT Testing Guide (Markdown)
**File:** `VAPT_TESTING_GUIDE.md`

Security testing guide for penetration testing including:
- Authentication & authorization testing
- Rate limiting verification
- Input validation tests
- Session security checks
- Data protection controls
- CORS and security headers
- File upload security
- Known security considerations
- Vulnerability reporting process

**Target Audience:**
- Security teams
- Penetration testers
- QA teams
- DevOps engineers

---

## 🚀 Quick Start

### For Developers

1. **Setup Your Environment:**
   ```
   Open docs/SETUP_GUIDE.html
   Follow tabs: Database → Backend → Frontend
   ```

2. **Test the API:**
   ```
   Import docs/MTB_Credit_Card_API.postman_collection.json into Postman
   Run requests from Health Check folder first
   ```

3. **Reference Documentation:**
   ```
   Open docs/API_DOCUMENTATION.md for detailed API reference
   ```

### For Security Teams

1. **Review Security Controls:**
   ```
   Open docs/VAPT_TESTING_GUIDE.md
   Review implemented controls
   Follow testing checklist
   ```

2. **Test API Security:**
   ```
   Use Postman collection for security testing
   Focus on authentication, rate limiting, input validation
   ```

3. **Report Findings:**
   ```
   Email: security@mtb.com.bd
   Subject: [VAPT Finding] - [Description]
   ```

---

## 📋 Documentation Index

| Document | Format | Purpose | Audience |
|----------|--------|---------|----------|
| Setup Guide | HTML | Developer onboarding | Developers |
| API Documentation | Markdown | API reference | Developers, Integrators |
| Postman Collection | JSON | API testing | QA, Developers |
| VAPT Guide | Markdown | Security testing | Security teams, QA |

---

## 🔗 External Documentation

- **Swagger UI:** http://localhost:8000/docs (when backend is running)
- **ReDoc:** http://localhost:8000/redoc (when backend is running)
- **OpenAPI Spec:** http://localhost:8000/api/v1/openapi.json (when backend is running)

---

## 📝 Document Maintenance

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-30 | Initial documentation release |

### Update Process

1. Update source files in `/docs` folder
2. Update version number in each document
3. Update this README's version history
4. Commit with message: `docs: Update documentation to v{version}`

### Style Guide

- **Code blocks:** Use language-specific syntax highlighting
- **Endpoints:** Use HTTP method + path format (e.g., `GET /api/v1/users`)
- **Placeholders:** Use `{{variable_name}}` format
- **Warnings:** Use ⚠️ emoji
- **Notes:** Use 💡 or 📝 emojis

---

## 🆘 Support

### Documentation Issues

If you find errors or need clarification:

1. **Check:** Is the information in the correct document?
2. **Search:** Use Ctrl+F to find keywords
3. **Ask:** Contact the development team

### Contact Information

**Development Team:** dev@mtb.com.bd
**API Support:** api-support@mtb.com.bd
**Security Team:** security@mtb.com.bd

---

## 📄 License

This documentation is part of the MTB Credit Card Application System.

Copyright (c) 2024 MTB (Mutual Trust Bank Ltd.)

---

**Last Updated:** January 30, 2026
**Documentation Version:** 1.0.0
