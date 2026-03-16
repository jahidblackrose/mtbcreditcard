"""
API router initialization.
"""

from fastapi import APIRouter

# Import routers
from app.api.applications import router as applications_router
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.drafts import router as drafts_router
from app.api.landing import router as landing_router
from app.api.reference import router as reference_router
from app.api.session import router as session_router
from app.api.submission import router as submission_router

# Import step routers
from app.api.steps.bank_accounts import router as bank_accounts_router
from app.api.steps.card_selection import router as card_selection_router
from app.api.steps.credit_facilities import router as credit_facilities_router
from app.api.steps.declarations import router as declarations_router
from app.api.steps.documents import router as documents_router
from app.api.steps.monthly_income import router as monthly_income_router
from app.api.steps.nominee import router as nominee_router
from app.api.steps.personal_info import router as personal_info_router
from app.api.steps.professional_info import router as professional_info_router
from app.api.steps.references import router as references_router
from app.api.steps.supplementary import router as supplementary_router
from app.api.steps.auto_debit import router as auto_debit_router

# Create main API router
api_router = APIRouter()

# Include individual routers
api_router.include_router(reference_router, prefix="/reference", tags=["Reference Data"])
api_router.include_router(landing_router, prefix="/landing", tags=["Landing Page"])
api_router.include_router(session_router, prefix="/session", tags=["Session"])
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(applications_router, prefix="/applications", tags=["Applications"])
api_router.include_router(drafts_router, prefix="/drafts", tags=["Drafts"])
api_router.include_router(submission_router, prefix="/submission", tags=["Submission"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])

# Form step endpoints (under /applications/{app_id}/...)
api_router.include_router(card_selection_router, prefix="/applications", tags=["Step 1: Card Selection"])
api_router.include_router(personal_info_router, prefix="/applications", tags=["Step 2: Personal Info"])
api_router.include_router(professional_info_router, prefix="/applications", tags=["Step 3: Professional Info"])
api_router.include_router(monthly_income_router, prefix="/applications", tags=["Step 4: Monthly Income"])
api_router.include_router(bank_accounts_router, prefix="/applications", tags=["Step 5: Bank Accounts"])
api_router.include_router(credit_facilities_router, prefix="/applications", tags=["Step 6: Credit Facilities"])
api_router.include_router(nominee_router, prefix="/applications", tags=["Step 7: Nominee"])
api_router.include_router(supplementary_router, prefix="/applications", tags=["Step 8: Supplementary Card"])
api_router.include_router(references_router, prefix="/applications", tags=["Step 9: References"])
api_router.include_router(documents_router, prefix="/applications", tags=["Step 10: Documents"])
api_router.include_router(auto_debit_router, prefix="/applications", tags=["Step 11: Auto Debit"])
api_router.include_router(declarations_router, prefix="/applications", tags=["Step 12: Declarations"])

__all__ = ["api_router"]
