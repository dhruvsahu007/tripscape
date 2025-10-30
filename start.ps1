# Tripscape - Quick Start Script for Windows

Write-Host "🚀 Tripscape Development Startup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "❌ Error: Must run from tripscape root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Setting up backend..." -ForegroundColor Yellow
Set-Location backend

# Create virtual environment if not exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

# Activate virtual environment
& .\venv\Scripts\Activate.ps1

# Install requirements
Write-Host "Installing Python dependencies..."
pip install -q -r requirements.txt

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env not found, copying from .env.example" -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit backend/.env with your settings" -ForegroundColor Yellow
}

Write-Host "✅ Backend setup complete" -ForegroundColor Green

# Start backend in new window
Write-Host "Starting backend on port 8000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\venv\Scripts\Activate.ps1; python main.py"

Set-Location ..

Write-Host ""
Write-Host "🎨 Setting up frontend..." -ForegroundColor Yellow
Set-Location frontend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Node dependencies (this may take a while)..."
    npm install --legacy-peer-deps
} else {
    Write-Host "✅ node_modules exists" -ForegroundColor Green
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found, copying from .env.example" -ForegroundColor Yellow
    Copy-Item .env.example .env.local
}

# Start frontend in new window
Write-Host "Starting frontend on port 3000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Tripscape is starting up!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servers are starting in separate windows..." -ForegroundColor Yellow
Write-Host "Wait 10-15 seconds for both servers to start" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Wait for servers to start (check console windows)"
Write-Host "2. Visit http://localhost:3000"
Write-Host "3. Test packages: http://localhost:3000/packages"
Write-Host "4. Test chatbot (bottom-right bubble)"
Write-Host "5. Test agent: http://localhost:3000/agent"
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green
