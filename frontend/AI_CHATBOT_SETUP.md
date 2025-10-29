# AI Chatbot Setup Guide

## Overview
The AI-powered chatbot widget provides intelligent travel assistance using AWS Bedrock (Claude 3 Sonnet) with optional Knowledge Base integration for RAG-enhanced responses.

## Features
- ✅ Floating chat bubble (bottom-right, red accent #FF0000)
- ✅ Expandable chat modal (300px desktop, full-screen mobile)
- ✅ AWS Bedrock integration with Claude 3 Sonnet
- ✅ Knowledge Base retrieval (optional RAG)
- ✅ Guided conversation flow (greeting → personalize → suggest → book → escalate)
- ✅ Package suggestions with inline cards
- ✅ Auto-minimize after 2min inactivity
- ✅ Escalation to live agent after 5 exchanges
- ✅ Form auto-fill capability
- ✅ Mock data fallback when KB unavailable
- ✅ Error handling with retry logic
- ✅ Responsive design with Tailwind CSS

## Installation

### 1. Install Required Dependencies
```bash
cd frontend
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/client-bedrock-agent-runtime
```

### 2. Configure Environment Variables
Create or update `.env.local` in the `frontend` directory:

```env
# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
BEDROCK_KNOWLEDGE_BASE_ID=your_kb_id_here  # Optional, for RAG
```

**Security Note**: Never commit `.env.local` to version control. The `.gitignore` should already exclude it.

### 3. AWS Setup

#### A. Create IAM User/Role
1. Go to AWS IAM Console
2. Create a new user or role with the following policies:
   - `AmazonBedrockFullAccess` (or custom policy with `bedrock:InvokeModel`)
   - If using Knowledge Base: Add `bedrock:Retrieve` permission
3. Generate access keys and add to `.env.local`

#### B. Enable Bedrock Models
1. Go to AWS Bedrock Console
2. Navigate to "Model access"
3. Request access to: **Anthropic Claude 3 Sonnet**
4. Wait for approval (usually instant)

#### C. Create Knowledge Base (Optional)
1. Go to AWS Bedrock Console → Knowledge Bases
2. Create a new KB:
   - Data source: S3 bucket with travel package info (JSON/CSV/TXT)
   - Vector store: Amazon OpenSearch Serverless or Pinecone
   - Embedding model: Amazon Titan Embeddings
3. Copy the Knowledge Base ID to `.env.local`

**Sample KB Document Structure**:
```json
{
  "packages": [
    {
      "id": "pkg-001",
      "name": "Bali Paradise Escape",
      "destination": "Bali, Indonesia",
      "price": 1299,
      "dates": "July 15-22, 2025",
      "type": "tour",
      "description": "7 nights luxury resort, daily breakfast, guided tours",
      "inclusions": ["Airport transfers", "Breakfast", "Tours"],
      "tags": ["beach", "relaxation", "cultural"]
    }
  ]
}
```

### 4. File Structure
```
frontend/
├── components/
│   ├── ai-chatbot.tsx          # Main chatbot component
│   └── hero.tsx                # Updated with chatbot integration
├── app/
│   └── api/
│       └── chat/
│           └── route.ts        # Backend API for Bedrock
├── .env.local                  # Environment variables (create this)
└── .env.example                # Template (already created)
```

## Usage

### Basic Implementation
The chatbot is already integrated into the Hero component:

```tsx
import AIChatbot from "./ai-chatbot"

export default function Hero() {
  const handleFormFill = (data) => {
    console.log("Auto-fill data:", data)
    // Populate your search form here
  }

  return (
    <>
      {/* Your hero content */}
      <AIChatbot onFormFill={handleFormFill} />
    </>
  )
}
```

### API Endpoint
The chat API is available at `/api/chat` (POST):

**Request**:
```json
{
  "message": "I want to go to Bali in July for 2 people under $2000",
  "conversationHistory": [
    { "role": "assistant", "content": "Hi! How can I help?" },
    { "role": "user", "content": "Previous message" }
  ]
}
```

**Response**:
```json
{
  "message": "Great choice! I found 2 amazing packages for you...",
  "packages": [
    {
      "id": "pkg-001",
      "name": "Bali Paradise Escape",
      "destination": "Bali, Indonesia",
      "price": 1299,
      "dates": "July 15-22, 2025",
      "type": "tour",
      "description": "7 nights luxury resort..."
    }
  ],
  "formData": {
    "dest": "Bali",
    "date": "July",
    "travelers": 2
  }
}
```

## Testing

### 1. Without AWS (Mock Mode)
The chatbot will automatically fall back to mock data if AWS credentials are not configured. You can test the UI immediately.

### 2. With AWS Bedrock
1. Set up environment variables
2. Run the dev server: `npm run dev`
3. Click the red floating bubble
4. Try these test messages:
   - "I want to visit Bali for a beach vacation"
   - "Looking for a romantic honeymoon under $3000"
   - "Adventure trip to Kenya in November for 2 people"
   - "Show me city tours in Europe"
   - "I need help from an agent"

## Customization

### Change Colors
Edit `ai-chatbot.tsx`:
```tsx
// Chat bubble
className="bg-red-600 hover:bg-red-700"  // Change red-600 to your color

// Header
className="from-blue-600 to-blue-700"  // Change blue to your brand color
```

### Adjust Behavior
- **Auto-minimize timer**: Change `120000` (2min) in the `useEffect`
- **Escalation threshold**: Change `conversationCount >= 4` to your preferred number
- **Fade-in delay**: Change `3000` (3s) in the bubble animation

### Add More Packages
Edit `app/api/chat/route.ts` and update the `MOCK_PACKAGES` array.

## Troubleshooting

### Error: "AWS credentials not configured"
- Ensure `.env.local` exists with valid AWS keys
- Restart the dev server after adding environment variables

### Error: "Model access denied"
- Go to AWS Bedrock Console → Model access
- Request access to Claude 3 Sonnet
- Wait for approval (check email)

### Chatbot not responding
- Check browser console for errors
- Verify API route is working: `curl http://localhost:3000/api/chat`
- Check AWS CloudWatch Logs for Bedrock errors

### Knowledge Base not working
- Verify `BEDROCK_KNOWLEDGE_BASE_ID` is correct
- Check KB sync status in AWS Console
- Ensure IAM policy includes `bedrock:Retrieve`

## Production Deployment

1. **Environment Variables**: Add to your hosting platform (Vercel, Netlify, etc.)
2. **Rate Limiting**: Implement on the API route to prevent abuse
3. **Monitoring**: Enable CloudWatch Logs for Bedrock API calls
4. **Caching**: Consider caching common queries with Redis
5. **Security**: Use AWS Secrets Manager instead of environment variables

## Cost Estimation

AWS Bedrock pricing (us-east-1):
- Claude 3 Sonnet: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
- Knowledge Base retrieval: ~$0.0004 per query
- Estimated cost: **$0.02-0.05 per conversation** (5-10 exchanges)

## Support
For issues or questions:
- Check AWS Bedrock documentation: https://docs.aws.amazon.com/bedrock/
- Review component code comments
- Contact development team

---

**Version**: 1.0.0  
**Last Updated**: October 29, 2025
