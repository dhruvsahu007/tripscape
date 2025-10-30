from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from dotenv import load_dotenv
from config import settings
from routers import chat, agent

# Load environment variables
load_dotenv()

# Create FastAPI app with conditional docs
app = FastAPI(
    title=settings.app_name,
    description="Tripscape - Travel application backend API",
    version="1.0.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    openapi_url="/openapi.json" if not settings.is_production else None,
)

# Security Middleware - Trusted Host
if settings.is_production:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # Configure with your domain in production
    )

# GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(agent.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Tripscape",
        "version": "1.0.0",
        "environment": settings.environment
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "OK",
        "message": "Server is running",
        "environment": settings.environment
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=not settings.is_production,
        log_level="info" if settings.is_production else "debug"
    )
