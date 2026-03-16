"""
FastAPI application entry point.
"""

import logging
from contextlib import asynccontextmanager
from typing import Callable

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.security.middleware import add_security_headers

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.

    Args:
        app: FastAPI application instance
    """
    # Startup
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")

    # Initialize database connection pool
    from app.database.connection import init_db_pool

    try:
        await init_db_pool()
        logger.info("Database pool initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database pool: {e}")
        # Don't fail startup for development - allow API to start without DB

    # Initialize Redis connection
    # Will be implemented in Phase 3
    # await init_redis()

    yield

    # Shutdown
    logger.info("Shutting down application...")
    from app.database.connection import close_db_pool

    await close_db_pool()
    # await close_redis()


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="MTB Credit Card Application System API",
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.api_v1_prefix}/openapi.json",
    lifespan=lifespan,
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "X-Request-ID"],
)

# Security Headers Middleware
app.middleware("http")(add_security_headers)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next: Callable) -> JSONResponse:
    """
    Log all incoming requests.

    Args:
        request: FastAPI request
        call_next: Next middleware/route handler

    Returns:
        Response from the next handler
    """
    logger.info(f"{request.method} {request.url.path}")

    response = await call_next(request)

    # Log response status
    logger.info(
        f"{request.method} {request.url.path} - Status: {response.status_code}"
    )

    return response


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler for unhandled exceptions.

    Args:
        request: FastAPI request
        exc: Exception instance

    Returns:
        JSON response with error details
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": 500,
            "message": "Internal server error",
            "detail": str(exc) if settings.debug else "An unexpected error occurred",
        },
    )


@app.exception_handler(status.HTTP_404_NOT_FOUND)
async def not_found_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle 404 Not Found errors.

    Args:
        request: FastAPI request
        exc: Exception instance

    Returns:
        JSON 404 response
    """
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "status": 404,
            "message": "Resource not found",
            "path": request.url.path,
        },
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.

    Returns:
        Health status response
    """
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint.

    Returns:
        Welcome message and links
    """
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "api_v1": settings.api_v1_prefix,
    }


# Include API routers
from app.api import api_router

app.include_router(api_router, prefix=settings.api_v1_prefix)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
