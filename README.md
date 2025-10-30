# 🌍 Tripscape - AI-Powered Travel Platform

A modern travel website with Next.js frontend, FastAPI backend, and real-time AI chatbot powered by AWS Bedrock.

## ✨ Features

- 🏖️ **Package Management**: Browse 7 curated travel packages (Dubai, Bhutan, Ladakh, Kerala, etc.)
- 🤖 **AI Chatbot**: Intelligent travel assistant powered by AWS Bedrock
- 👨‍💼 **Agent Dashboard**: Real-time customer support system with WebSocket
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components
- 🔐 **Production-Ready**: Security best practices, environment variables, IAM roles

## 📦 Project Structure

```
tripscape/
├── frontend/              # Next.js 14 + React 19 + TypeScript
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── packages/          # Package listing & details
│   │   │   ├── page.tsx       # All packages
│   │   │   └── [id]/page.tsx  # Package details
│   │   └── agent/             # Real-time agent dashboard
│   │       └── page.tsx
│   ├── components/
│   │   ├── ai-chatbot.tsx     # AI chat component
│   │   └── ui/                # Reusable UI components
│   └── .env.production        # Production environment config
├── backend/               # FastAPI + Python 3.11
│   ├── main.py                # FastAPI application
│   ├── routers/
│   │   ├── chat.py            # AI chatbot endpoints
│   │   └── agent.py           # WebSocket agent system
│   ├── services/
│   │   └── agent_service.py   # Agent management logic
│   └── .env                   # Backend config (production-ready)
├── DEPLOYMENT.md          # 📖 Complete EC2 deployment guide
└── CHECKLIST.md          # ✅ Pre-deployment verification
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- AWS Account (for AI chatbot - optional for development)

### Development Setup

#### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
The frontend will run on **http://localhost:3000**

**Available Routes:**
- `/` - Home page
- `/packages` - Browse all travel packages
- `/packages/pkg-001` - Package details
- `/agent` - Agent dashboard (for support team)

#### Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
The backend will run on **http://localhost:8000**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health
- WebSocket: ws://localhost:8000/api/agent/ws/*

## 🔧 Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **WebSocket** - Real-time agent communication

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **WebSocket** - Real-time bidirectional communication
- **AWS Bedrock** - AI/ML foundation models
- **Boto3** - AWS SDK for Python
- **Pydantic** - Data validation

## 🌐 Production Deployment

### Quick Deployment (EC2)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for comprehensive step-by-step guide.

**Before deploying:**
1. Read `CHECKLIST.md` - All deployment blockers are fixed ✅
2. Update `.env.production` with your EC2 IP
3. Update `backend/.env` with production domain
4. Attach IAM role to EC2 (no AWS keys needed!)

**Quick deploy commands:**
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run build
npm start  # Runs on port 3000
```

### Deployment Checklist ✅

- [x] AWS credentials removed from code
- [x] Strong SECRET_KEY generated
- [x] WebSocket URLs use environment variables
- [x] CORS properly configured
- [x] IAM role setup documented
- [x] Production environment variables ready

## 🔐 Environment Variables

### Backend (`backend/.env`)
```bash
PORT=8000
ENVIRONMENT=production
DEBUG=False
CORS_ORIGINS=http://YOUR_EC2_IP:3000,https://your-domain.com
SECRET_KEY=qE19WNTB_ZGdqPdx9arNwgB4wYWSZ7seqGZxzceRAkM

# AWS Bedrock (use IAM role on EC2)
AWS_REGION=us-east-1
BEDROCK_KNOWLEDGE_BASE_ID=QE5T7XCXWZ
```

### Frontend (`frontend/.env.production`)
```bash
NEXT_PUBLIC_API_URL=http://YOUR_EC2_IP:8000
NEXT_PUBLIC_WS_URL=ws://YOUR_EC2_IP:8000
```

## 🎯 Key Features Breakdown

### 1. Travel Packages
- 7 pre-loaded destinations with complete details
- Day-by-day itinerary
- Pricing with savings calculations
- High-quality images
- Inclusions/exclusions lists

### 2. AI Chatbot
- Powered by AWS Bedrock
- Natural language understanding
- Package recommendations
- Auto-escalation to live agent after 5 exchanges
- Form auto-fill capability

### 3. Agent Dashboard
- Real-time customer queue
- WebSocket-based messaging
- Multi-agent support
- Connection status monitoring
- Message history

## 📡 API Endpoints

### Backend API
- `GET /` - API info
- `GET /api/health` - Health check
- `POST /api/chat` - AI chatbot (JSON body)
- `WS /api/agent/ws/agent` - Agent WebSocket
- `WS /api/agent/ws/customer/{id}` - Customer WebSocket
- `GET /api/agent/stats` - Agent statistics

### Frontend Routes
- `/` - Homepage with hero, destinations, testimonials
- `/packages` - All travel packages
- `/packages/[id]` - Individual package details
- `/agent` - Agent support dashboard

## 🧪 Testing

### Local Testing
```bash
# Test backend health
curl http://localhost:8000/api/health

# Test AI chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Show me beach destinations","conversationHistory":[]}'

# Test frontend build
cd frontend
npm run build
```

### Production Testing
1. Visit frontend: `http://YOUR_EC2_IP:3000`
2. Test chatbot (click bubble bottom-right)
3. Test packages: `/packages`
4. Test agent dashboard: `/agent`
5. Verify WebSocket connection (green badge)

## 🛠️ Development

Both frontend and backend can run simultaneously:
```bash
# Terminal 1 - Backend
cd backend && python main.py

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🔒 Security

- ✅ No hardcoded credentials
- ✅ IAM roles for AWS access
- ✅ CORS properly configured
- ✅ Environment-based configuration
- ✅ Strong SECRET_KEY (32 bytes)
- ✅ Production mode enabled
- ✅ HTTPS ready (with nginx + Let's Encrypt)

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete EC2 deployment guide
- **[CHECKLIST.md](./CHECKLIST.md)** - Pre-deployment verification
- **Backend API Docs**: http://localhost:8000/docs (Swagger UI)
- **Backend ReDoc**: http://localhost:8000/redoc

## 🐛 Troubleshooting

### Frontend won't start
```bash
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run dev
```

### Backend errors
```bash
# Check Python version (need 3.11+)
python --version

# Reinstall dependencies
pip install -r requirements.txt
```

### WebSocket connection fails
- Verify backend is running: `curl http://localhost:8000/api/health`
- Check environment variables in `.env.local` or `.env.production`
- Ensure no firewall blocking ports 3000/8000

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Ready to Deploy!

All deployment blockers have been fixed. Your project is production-ready!

Follow these steps:
1. Read `CHECKLIST.md` to verify everything
2. Follow `DEPLOYMENT.md` for step-by-step EC2 setup
3. Update environment variables with your EC2 IP/domain
4. Deploy and enjoy! 🚀

---

**Made with ❤️ by the Tripscape Team**
