# Development Guide

## Project Structure

```
backend/
├── app/
│   ├── api/                 # API routers
│   │   ├── models/         # Pydantic schemas
│   │   └── steps/          # Form step endpoints
│   ├── database/           # Oracle connection & procedures
│   ├── security/           # JWT, password, auth
│   ├── config.py           # Settings management
│   ├── main.py             # FastAPI app entry
│   └── dependencies.py     # Dependency injection
├── tests/                   # Test suite
├── docs/                    # Documentation
└── pyproject.toml          # Dependencies
```

## Setup

1. **Clone and install:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -e .
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start development server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. **Access Swagger UI:**
   ```
   http://localhost:8000/docs
   ```

## Adding New Endpoints

1. **Create Pydantic models** in `app/api/models/`:
   ```python
   class MyRequest(BaseModel):
       field: str = Field(..., description="Field description")

   class MyResponse(BaseModel):
       data: str
   ```

2. **Create router** in `app/api/my_router.py`:
   ```python
   from fastapi import APIRouter, Depends
   from app.database.connection import get_db
   from app.api.models import ApiResponse

   router = APIRouter()

   @router.post("/endpoint", response_model=ApiResponse)
   async def my_endpoint(
       request: MyRequest,
       db: Connection = Depends(get_db)
   ) -> ApiResponse:
       # Call database procedure
       result = await call_procedure(db, "procedure_name", p_json_in=request.dict())
       return ApiResponse(status=200, message="Success", data=result.data)
   ```

3. **Register router** in `app/api/__init__.py`:
   ```python
   from app.api.my_router import router as my_router
   api_router.include_router(my_router, prefix="/my-router", tags=["My Router"])
   ```

## Database Procedures

### Calling a Procedure

```python
from app.database.procedures import call_procedure

# Simple call
result = await call_procedure(db, "get_card_products")

# With input data
result = await call_procedure(
    db,
    "check_eligibility",
    p_json_in={"monthlyIncome": "50000"}
)

# Handle response
if result.is_success:
    data = result.data
else:
    error_code = result.error_code
```

### Creating New Procedure Wrappers

For procedures with non-standard signatures:

```python
from app.database.procedures import call_procedure_with_params

result = await call_procedure_with_params(
    db,
    "custom_procedure",
    p_input1="value1",
    p_input2="value2",
    p_output="OUT",
)
```

## Testing

### Run Tests

```bash
# All tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Specific file
pytest tests/test_auth.py

# Verbose
pytest -v
```

### Writing Tests

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_get_card_products():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/reference/card-products")
        assert response.status_code == 200
        assert "data" in response.json()
```

## Debugging

### Enable Debug Logging

```python
# In .env
LOG_LEVEL=DEBUG
DEBUG=true
```

### Database Queries

```python
import logging
logging.getLogger("oracledb").setLevel(logging.DEBUG)
```

### Check Database Connection

```bash
# Test Oracle connection
sqlplus mtb_credit/your_password@localhost:1521/XE
```

## Code Style

### Formatting

```bash
# Format with black
black app/

# Check with ruff
ruff check app/
```

### Type Checking

```bash
# Run mypy
mypy app/
```

## Common Issues

### Import Errors

```bash
# Reinstall dependencies
pip install --force-reinstall -e .
```

### Database Connection Issues

1. Check Oracle is running:
   ```bash
   lsnrctl status
   ```

2. Verify connection string in `.env`

3. Check firewall settings

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Kill process or change port
uvicorn app.main:app --port 8001
```
