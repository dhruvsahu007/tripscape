from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from services.chatbot_service import ChatbotService

router = APIRouter(prefix="/api/chat", tags=["chat"])

# Initialize chatbot service
chatbot_service = ChatbotService()


class ConversationMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    conversationHistory: Optional[List[ConversationMessage]] = []


class PackageResponse(BaseModel):
    id: str
    name: str
    destination: str
    price: int
    dates: str
    type: str
    description: str


class FormData(BaseModel):
    dest: Optional[str] = ""
    date: Optional[str] = ""
    travelers: Optional[int] = 1


class ChatResponse(BaseModel):
    message: str
    packages: Optional[List[Dict]] = None
    formData: Optional[Dict] = None


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process chat messages with AI-powered responses
    """
    try:
        if not request.message or not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Convert conversation history to dict format
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in request.conversationHistory
        ]
        
        # Process the message
        result = await chatbot_service.process_message(
            message=request.message,
            conversation_history=conversation_history
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Chat error: {e}")
        # Return friendly error message
        return ChatResponse(
            message="I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team for assistance.",
            packages=None,
            formData=None
        )


@router.get("/health")
async def chat_health():
    """Health check for chat service"""
    return {
        "status": "OK",
        "service": "chatbot",
        "aws_enabled": chatbot_service.aws_enabled
    }
