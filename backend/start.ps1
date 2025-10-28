# Production startup script for Tripscape backend (Windows)

Write-Host "Starting Tripscape Backend in Production Mode..." -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install/update dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found. Please create one based on .env.example" -ForegroundColor Red
    exit 1
}

# Run with uvicorn
Write-Host "Starting server..." -ForegroundColor Green
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
