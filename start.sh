#!/bin/bash
# Tripscape - Quick Start Script for EC2 Deployment Testing

echo "🚀 Tripscape Deployment Test Script"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Must run from tripscape root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check Python version
if command -v python3.11 &> /dev/null; then
    echo -e "${GREEN}✅ Python 3.11 found${NC}"
    PYTHON_CMD="python3.11"
elif command -v python3 &> /dev/null; then
    PY_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
    echo -e "${YELLOW}⚠️  Python 3.11 not found, using Python $PY_VERSION${NC}"
    PYTHON_CMD="python3"
else
    echo -e "${RED}❌ Python not found${NC}"
    exit 1
fi

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}"
    else
        echo -e "${YELLOW}⚠️  Node.js $NODE_VERSION found (18+ recommended)${NC}"
    fi
else
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔧 Setting up backend...${NC}"
cd backend

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env not found, copying from .env.example${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your settings${NC}"
fi

echo -e "${GREEN}✅ Backend setup complete${NC}"

# Start backend in background
echo "Starting backend on port 8000..."
nohup $PYTHON_CMD main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

cd ..

echo ""
echo -e "${YELLOW}🎨 Setting up frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install --legacy-peer-deps
else
    echo -e "${GREEN}✅ node_modules exists${NC}"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found, copying from .env.example${NC}"
    cp .env.example .env.local
fi

# Build frontend
echo "Building frontend..."
npm run build

# Start frontend in background
echo "Starting frontend on port 3000..."
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Tripscape is now running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Backend PID:  $BACKEND_PID (saved to backend.pid)"
echo "Frontend PID: $FRONTEND_PID (saved to frontend.pid)"
echo ""
echo "Backend logs:  tail -f backend.log"
echo "Frontend logs: tail -f frontend.log"
echo ""
echo -e "${YELLOW}To stop servers:${NC}"
echo "kill \$(cat backend.pid frontend.pid)"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Visit http://localhost:3000"
echo "2. Test packages: http://localhost:3000/packages"
echo "3. Test chatbot (bottom-right bubble)"
echo "4. Test agent: http://localhost:3000/agent"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"
