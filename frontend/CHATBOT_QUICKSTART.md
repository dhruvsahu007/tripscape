# AI Chatbot - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies ✅
Already installed! The AWS SDK packages are now available.

### Step 2: Environment Variables
Create `.env.local` in the `frontend` directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Then edit `.env.local` and add your AWS credentials:

```env
AWS_ACCESS_KEY_ID=AKIA...your_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
BEDROCK_KNOWLEDGE_BASE_ID=your_kb_id  # Optional
```

### Step 3: Test Without AWS (Mock Mode)
You can test the chatbot UI immediately without AWS credentials!

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Click the red floating bubble in the bottom-right corner
4. Chat with the AI (uses mock data for testing)

### Step 4: Enable AWS Bedrock (Optional)
To use real AI responses:

1. **Get AWS Access**:
   - Go to AWS IAM Console
   - Create a user with `AmazonBedrockFullAccess` policy
   - Generate access keys

2. **Enable Claude Model**:
   - Go to AWS Bedrock Console
   - Navigate to "Model access"
   - Request access to **Anthropic Claude 3 Sonnet**

3. **Update `.env.local`** with your real credentials

4. **Restart the server**: The chatbot will now use AWS Bedrock!

## 🎨 Features

- **Floating Chat Bubble**: Red button with plane icon (bottom-right)
- **Smart Suggestions**: AI analyzes user input and suggests travel packages
- **Package Cards**: Inline booking options with prices
- **Auto-Fill**: Can populate the search form with user preferences
- **Escalation**: Connects to live agent after 5 exchanges
- **Responsive**: Full-screen on mobile, modal on desktop
- **Auto-Minimize**: Minimizes after 2 minutes of inactivity

## 💬 Test Messages

Try these in the chat:
- "I want a beach vacation in Bali"
- "Romantic honeymoon under $3000"
- "Adventure safari in Kenya for 2 people"
- "Show me European city tours"
- "I need help from an agent"

## 📁 Files Created

```
frontend/
├── components/
│   └── ai-chatbot.tsx           ← Main chatbot component
├── app/api/chat/
│   └── route.ts                 ← API endpoint for AWS Bedrock
├── AI_CHATBOT_SETUP.md          ← Detailed setup guide
└── CHATBOT_QUICKSTART.md        ← This file
```

## 🔧 Customization

### Change Colors
Edit `components/ai-chatbot.tsx`:
- Line 163: `bg-red-600` → Change red color
- Line 237: `from-blue-600 to-blue-700` → Change header gradient

### Modify Packages
Edit `app/api/chat/route.ts`:
- Update the `MOCK_PACKAGES` array (lines 12-55)

## 🐛 Troubleshooting

**Problem**: Chatbot not visible
- **Solution**: Hard refresh (Ctrl+Shift+R) or check browser console

**Problem**: "AWS credentials not configured"
- **Solution**: Create `.env.local` and restart the dev server

**Problem**: Chatbot responds but shows errors
- **Solution**: Check AWS Bedrock model access in AWS Console

## 📚 Documentation

- Full setup guide: `AI_CHATBOT_SETUP.md`
- AWS Bedrock docs: https://docs.aws.amazon.com/bedrock/

## 💰 Cost

- **Mock Mode**: FREE (no AWS needed)
- **With AWS Bedrock**: ~$0.02-0.05 per conversation (5-10 messages)

---

**Need help?** Check `AI_CHATBOT_SETUP.md` for detailed instructions!
