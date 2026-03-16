# MTB Credit Card Application System - Backend

FastAPI-based backend service for the MTB Credit Card Online Application System.

## Overview

This backend provides a RESTful API that connects the React frontend with Oracle database procedures. It handles:

- Credit card application submissions
- OTP-based authentication
- Session management
- Draft auto-save
- Dashboard and reporting
- RM/Staff dashboard

## Features

- **FastAPI Framework**: High-performance async API
- **Oracle Database**: Connection pooling with 60 database procedures
- **JWT Authentication**: Secure token-based auth for staff
- **OTP System**: SMS-based verification for applicants
- **Redis Storage**: Session management and rate limiting
- **Bank-Grade Security**: Rate limiting, CORS, security headers
- **Auto Documentation**: Interactive Swagger UI

## Tech Stack

- **Python**: 3.11+
- **Framework**: FastAPI
- **Database**: Oracle Database (oracledb driver)
- **Cache**: Redis
- **Authentication**: JWT + OTP
- **API Docs**: Swagger/OpenAPI

## Quick Start

### Prerequisites

- Python 3.11 or higher
- Oracle Database (XE or full version)
- Redis server
- pip or poetry

### Installation

1. **Clone and navigate to backend**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -e .
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run database migrations** (if needed):
   ```bash
   # Execute database/packages/pkg_credit_card_application_body.sql
   # in your Oracle database
   ```

6. **Start the development server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Access API documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## Docker Setup

### Using Docker Compose (Recommended for Local Dev)

```bash
# Start all services (API + Oracle XE + Redis)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Build Production Image

```bash
docker build -t mtb-credit-card-api:latest .
docker run -p 8000:8000 --env-file .env mtb-credit-card-api:latest
```

## Environment Variables

See `.env.example` for all available variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Oracle database host | localhost |
| `DB_PORT` | Oracle database port | 1521 |
| `DB_SERVICE_NAME` | Oracle service name | XE |
| `REDIS_HOST` | Redis server host | localhost |
| `REDIS_PORT` | Redis server port | 6379 |
| `JWT_SECRET_KEY` | JWT signing key | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## API Structure

```
/api/v1/
├── reference/          # Reference data (cards, banks, etc.)
├── landing/            # Landing page data
├── session/            # Session management
├── auth/               # OTP & staff authentication
├── applications/       # Application CRUD
├── drafts/             # Draft management
├── submission/         # Submission flows
└── dashboard/          # User & RM dashboards
```

## Database Procedures

The backend integrates with 60 Oracle procedures (error codes 501-560):

- **501-504**: Reference data (cards, eligibility, banks)
- **505-510**: Application CRUD operations
- **511-516**: OTP and authentication
- **517-542**: Application form steps (1-12)
- **543-548**: Full application save & session management
- **549-553**: Draft management
- **554-560**: Submission & dashboard

See `database/packages/pkg_credit_card_application_body.sql` for details.

## Security Features

- **Rate Limiting**:
  - OTP: 5 requests/hour per mobile
  - Draft save: 10 requests/minute per session
  - General: 100 requests/minute per IP
- **JWT Authentication**: Access tokens (15min) + refresh tokens (7 days)
- **CORS**: Whitelist for frontend domains
- **Security Headers**: HSTS, X-Frame-Options, CSP
- **Input Validation**: Pydantic schemas on all endpoints

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

## Project Structure

```
backend/
├── app/
│   ├── api/              # API routers
│   ├── database/         # Oracle connection & procedures
│   ├── security/         # JWT, password, auth dependencies
│   └── utils/            # Utilities
├── tests/                # Test suite
├── docs/                 # Documentation
└── pyproject.toml        # Dependencies
```

## Development Guide

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for:
- Code structure explanation
- Adding new endpoints
- Testing procedures
- Debugging guide

## API Documentation

See [API.md](docs/API.md) for:
- All endpoints documented
- Request/response examples
- Error codes reference
- Authentication guide

## Deployment Guide

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for:
- Docker deployment
- Production configuration
- Database setup
- Redis setup
- Nginx configuration

## Troubleshooting

### Database Connection Issues

```bash
# Test Oracle connection
sqlplus mtb_credit/your_password@localhost:1521/XE

# Check listener
lsnrctl status
```

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# Check Redis logs
docker-compose logs redis
```

### Import Errors

```bash
# Reinstall dependencies
pip install --force-reinstall -e .
```

## License

Copyright (c) 2024 MTB (Mutual Trust Bank Ltd.)

## Support

For issues and questions, contact the development team.
