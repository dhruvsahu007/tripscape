import json
import os
from typing import List, Dict, Optional
import boto3
from botocore.exceptions import ClientError

# Mock packages for fallback
MOCK_PACKAGES = [
    {
        "id": "pkg-001",
        "name": "Bali Paradise Escape",
        "destination": "Bali, Indonesia",
        "price": 1299,
        "dates": "July 15-22, 2025",
        "type": "tour",
        "description": "7 nights in luxury resort, daily breakfast, guided tours",
    },
    {
        "id": "pkg-002",
        "name": "European Grand Tour",
        "destination": "Paris, Rome, Barcelona",
        "price": 2499,
        "dates": "August 10-20, 2025",
        "type": "tour",
        "description": "10 days exploring Europe's finest cities with all meals included",
    },
    {
        "id": "pkg-003",
        "name": "Maldives Honeymoon",
        "destination": "Maldives",
        "price": 3500,
        "dates": "September 5-12, 2025",
        "type": "hotel",
        "description": "Overwater villa, all-inclusive, couples spa treatments",
    },
    {
        "id": "pkg-004",
        "name": "Tokyo Adventure",
        "destination": "Tokyo, Japan",
        "price": 1899,
        "dates": "October 1-8, 2025",
        "type": "tour",
        "description": "Cultural immersion, sushi making class, Mt. Fuji day trip",
    },
    {
        "id": "pkg-005",
        "name": "Safari in Kenya",
        "destination": "Maasai Mara, Kenya",
        "price": 3200,
        "dates": "November 15-23, 2025",
        "type": "tour",
        "description": "Big 5 safari, luxury tented camp, hot air balloon ride",
    },
    {
        "id": "pkg-006",
        "name": "Swiss Alps Retreat",
        "destination": "Interlaken, Switzerland",
        "price": 2800,
        "dates": "December 10-17, 2025",
        "type": "tour",
        "description": "Skiing, mountain views, luxury chalet with spa",
    },
    {
        "id": "pkg-007",
        "name": "Dubai Luxury Experience",
        "destination": "Dubai, UAE",
        "price": 2200,
        "dates": "January 5-12, 2026",
        "type": "hotel",
        "description": "5-star hotel, desert safari, Burj Khalifa tickets included",
    },
    {
        "id": "pkg-008",
        "name": "Santorini Sunset Romance",
        "destination": "Santorini, Greece",
        "price": 1799,
        "dates": "May 15-22, 2026",
        "type": "tour",
        "description": "Cliff-side villa, wine tours, sunset sailing cruise",
    },
]


class ChatbotService:
    def __init__(self):
        self.aws_region = os.getenv("AWS_REGION", "us-east-1")
        self.kb_id = os.getenv("BEDROCK_KNOWLEDGE_BASE_ID")
        
        # Initialize Bedrock clients if credentials are available
        try:
            self.bedrock_runtime = boto3.client(
                service_name="bedrock-runtime",
                region_name=self.aws_region,
            )
            self.bedrock_agent = boto3.client(
                service_name="bedrock-agent-runtime",
                region_name=self.aws_region,
            )
            self.aws_enabled = True
        except Exception as e:
            print(f"AWS Bedrock not configured: {e}")
            self.aws_enabled = False

    def retrieve_from_kb(self, query: str) -> str:
        """Retrieve context from Knowledge Base"""
        if not self.aws_enabled or not self.kb_id:
            return ""
        
        try:
            response = self.bedrock_agent.retrieve(
                knowledgeBaseId=self.kb_id,
                retrievalQuery={"text": query},
                retrievalConfiguration={
                    "vectorSearchConfiguration": {"numberOfResults": 3}
                },
            )
            
            if "retrievalResults" in response:
                contexts = [
                    result.get("content", {}).get("text", "")
                    for result in response["retrievalResults"]
                ]
                return "\n\n".join(contexts)
        except ClientError as e:
            print(f"KB retrieval error: {e}")
        
        return ""

    def match_packages(self, message: str) -> List[Dict]:
        """Match packages based on user message"""
        lower_message = message.lower()
        matched = MOCK_PACKAGES.copy()
        
        # Filter by vibe/type
        if any(word in lower_message for word in ["beach", "island", "tropical", "ocean"]):
            matched = [p for p in matched if any(kw in p["name"].lower() or kw in p["description"].lower() 
                      for kw in ["beach", "island", "bali", "maldives", "santorini"])]
        elif any(word in lower_message for word in ["city", "cities", "urban", "cultural"]):
            matched = [p for p in matched if any(kw in p["name"].lower() or kw in p["destination"].lower()
                      for kw in ["city", "tokyo", "paris", "dubai", "european"])]
        elif any(word in lower_message for word in ["adventure", "safari", "mountain", "ski"]):
            matched = [p for p in matched if any(kw in p["description"].lower()
                      for kw in ["safari", "adventure", "mountain", "ski"])]
        elif any(word in lower_message for word in ["romantic", "honeymoon", "couple"]):
            matched = [p for p in matched if any(kw in p["description"].lower()
                      for kw in ["honeymoon", "romantic", "couple"])]
        elif any(word in lower_message for word in ["luxury", "5-star", "premium"]):
            matched = [p for p in matched if any(kw in p["description"].lower()
                      for kw in ["luxury", "5-star", "premium", "villa"])]
        
        # Filter by budget
        import re
        budget_match = re.search(r'(?:\$|under|budget|around|up to)\s*(\d+)', lower_message)
        if budget_match:
            budget = int(budget_match.group(1))
            matched = [p for p in matched if p["price"] <= budget]
        
        # Filter by destination
        dest_match = re.search(r'(?:to|visit|go to|travel to|see)\s+([a-z\s]+?)(?:\s+in|\s+for|$)', lower_message)
        if dest_match:
            dest = dest_match.group(1).strip()
            if dest:
                matched = [p for p in matched if dest in p["destination"].lower() or dest in p["name"].lower()]
        
        return matched[:3]  # Return max 3 packages

    def invoke_claude(self, message: str, conversation_history: List[Dict], kb_context: str, packages: List[Dict]) -> str:
        """Invoke Claude model via Bedrock"""
        if not self.aws_enabled:
            return self._generate_fallback_response(message, packages)
        
        # Build package context
        package_context = ""
        if packages:
            package_context = "\n\nAvailable packages:\n" + "\n".join([
                f"- {p['name']} ({p['destination']}) - ${p['price']} - {p['dates']}: {p['description']}"
                for p in packages
            ])
        
        # Build conversation context
        conv_context = ""
        if conversation_history:
            conv_context = "\nConversation so far:\n" + "\n".join([
                f"{msg['role']}: {msg['content']}" for msg in conversation_history[-4:]  # Last 4 messages
            ])
        
        # System prompt
        system_prompt = f"""You are Tripscape's AI Trip Guide, a friendly and knowledgeable travel assistant. Your role is to:

1. Help users plan their dream trips by understanding their preferences (destination, dates, travelers, budget, vibe).
2. Suggest relevant travel packages from our collection based on their needs.
3. Parse user messages to extract: destination, dates, number of travelers, budget, and preferences.
4. Provide warm, personalized recommendations with enthusiasm.
5. When suggesting packages, briefly highlight why they're a great fit.
6. If the user asks for an agent or needs complex help, acknowledge and offer to connect them.
7. Keep responses concise and conversational (2-3 sentences max, unless listing packages).

Knowledge Base Context:
{kb_context or "No additional context available."}
{package_context}
{conv_context}

User's latest message: {message}

Respond naturally as the AI Trip Guide. If you're suggesting packages, mention them by name and be enthusiastic!"""
        
        try:
            # Prepare the request for Claude 3 Sonnet
            model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
            
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 500,
                "messages": [
                    {
                        "role": "user",
                        "content": system_prompt
                    }
                ],
                "temperature": 0.7,
            }
            
            response = self.bedrock_runtime.invoke_model(
                modelId=model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(request_body)
            )
            
            response_body = json.loads(response["body"].read())
            
            if "content" in response_body and len(response_body["content"]) > 0:
                return response_body["content"][0].get("text", self._generate_fallback_response(message, packages))
            
        except ClientError as e:
            print(f"Bedrock invocation error: {e}")
        
        return self._generate_fallback_response(message, packages)

    def _generate_fallback_response(self, message: str, packages: List[Dict]) -> str:
        """Generate a fallback response when AWS is not available"""
        lower_message = message.lower()
        
        if any(word in lower_message for word in ["agent", "help", "talk to someone", "human"]):
            return "I'd be happy to connect you with one of our travel experts! They can provide personalized assistance. Would you like me to transfer you?"
        
        if packages:
            pkg_names = ", ".join([p["name"] for p in packages[:2]])
            return f"Great choice! I found {len(packages)} amazing package{'s' if len(packages) > 1 else ''} for you, including {pkg_names}. Check out the options below—each one is handpicked to make your trip unforgettable! ✨"
        
        if any(word in lower_message for word in ["beach", "ocean", "tropical", "island"]):
            return "Beach vibes! 🏖️ I love it. Are you thinking tropical paradise like Bali or Maldives, or maybe a Mediterranean escape? Also, what's your rough budget and when are you looking to travel?"
        
        if any(word in lower_message for word in ["city", "urban", "metropolitan"]):
            return "City exploration—awesome! 🌆 Do you prefer historic European cities, vibrant Asian metropolises like Tokyo, or modern marvels like Dubai? Let me know your dates and group size!"
        
        if any(word in lower_message for word in ["adventure", "active", "hiking", "safari"]):
            return "Adventure awaits! 🏔️ Thinking safari in Kenya, skiing in Swiss Alps, or mountain trekking? Tell me your preferred destination, travel dates, and how many adventurers are joining!"
        
        if any(word in lower_message for word in ["romantic", "honeymoon", "couple", "anniversary"]):
            return "How romantic! 💕 Perfect for a honeymoon or couples getaway. Are you dreaming of Maldives overwater villas, Santorini sunsets, or Bali's tropical romance? What's your budget and travel timeframe?"
        
        return "Tell me more about your ideal trip! What's your destination, travel dates, group size, and budget? The more I know, the better I can help you find the perfect package! 🌍✈️"

    def extract_form_data(self, message: str) -> Optional[Dict[str, any]]:
        """Extract form data from user message"""
        import re
        lower_message = message.lower()
        
        form_data = {}
        
        # Extract destination
        dest_match = re.search(r'(?:to|visit|go to|travel to|see)\s+([a-z\s]+?)(?:\s+in|\s+for|$)', lower_message)
        if dest_match:
            form_data["dest"] = dest_match.group(1).strip()
        
        # Extract dates
        date_match = re.search(r'(?:in|on|during)\s+(january|february|march|april|may|june|july|august|september|october|november|december|[\d\/\-]+)', lower_message)
        if date_match:
            form_data["date"] = date_match.group(1)
        
        # Extract travelers
        travelers_match = re.search(r'(\d+)\s*(?:people|person|travelers|guests)', lower_message)
        if travelers_match:
            form_data["travelers"] = int(travelers_match.group(1))
        else:
            form_data["travelers"] = 1
        
        return form_data if form_data else None

    async def process_message(self, message: str, conversation_history: List[Dict]) -> Dict:
        """Main method to process chat message"""
        # Step 1: Retrieve from Knowledge Base
        kb_context = self.retrieve_from_kb(message)
        
        # Step 2: Match packages
        matched_packages = self.match_packages(message)
        
        # Step 3: Invoke Claude
        response_message = self.invoke_claude(message, conversation_history, kb_context, matched_packages)
        
        # Step 4: Extract form data
        form_data = self.extract_form_data(message)
        
        # Step 5: Build response
        result = {
            "message": response_message,
        }
        
        if matched_packages:
            result["packages"] = matched_packages
        
        if form_data:
            result["formData"] = form_data
        
        return result
