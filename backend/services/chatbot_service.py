import json
import os
from typing import List, Dict, Optional
import boto3
from botocore.exceptions import ClientError

# Tripscape Travel Packages - Actual Data
MOCK_PACKAGES = [
    {
        "id": "pkg-001",
        "name": "Exotic Dubai Escape",
        "destination": "Dubai, UAE",
        "price": 95999,
        "dates": "Available year-round",
        "type": "tour",
        "description": "5N/6D - Discover glitz and glamour with desert safaris, Burj Khalifa visits, and luxury shopping. Includes flights, 4-star hotel, meals, visa, city tours.",
        "duration": "5 Nights / 6 Days",
        "suitable_for": ["Couples", "Families", "Youth"],
        "inclusions": ["Return flights", "4-star hotel", "Breakfast & dinner", "Visa assistance", "City tours", "Desert safari"],
    },
    {
        "id": "pkg-002",
        "name": "Bhutan Bliss Tour",
        "destination": "Bhutan",
        "price": 25999,
        "dates": "Fixed departure: Nov 2, 2025",
        "type": "tour",
        "description": "6N/7D - Explore serene landscapes with Thimphu, Paro, and Phuntsholing. Ideal for cultural immersion. Includes 3-star hotels, all meals, guided tours.",
        "duration": "6 Nights / 7 Days",
        "suitable_for": ["Solo Travelers", "Families"],
        "inclusions": ["3-star accommodation", "All meals", "Guided sightseeing", "Entry fees", "Transport"],
    },
    {
        "id": "pkg-003",
        "name": "Ladakh Adventure",
        "destination": "Ladakh, India",
        "price": 45000,
        "dates": "May-September 2025",
        "type": "tour",
        "description": "7N/8D - High-altitude thrills in Leh with Pangong Lake, Nubra Valley, and monastery tours. Perfect for thrill-seekers. 4x4 vehicles included.",
        "duration": "7 Nights / 8 Days",
        "suitable_for": ["Adventure Seekers", "Youth"],
        "inclusions": ["Accommodation", "Meals", "Inner line permits", "4x4 vehicles", "Sightseeing"],
    },
    {
        "id": "pkg-004",
        "name": "Kerala Backwaters",
        "destination": "Kerala, India",
        "price": 28500,
        "dates": "October-March 2026",
        "type": "tour",
        "description": "4N/5D - Relax in God's Own Country with houseboat cruises, Ayurvedic spas, and wildlife sanctuaries. Romantic getaway with houseboat stay.",
        "duration": "4 Nights / 5 Days",
        "suitable_for": ["Couples", "Families"],
        "inclusions": ["Houseboat stay", "Hotel accommodation", "Meals", "Houseboat cruise"],
    },
    {
        "id": "pkg-005",
        "name": "Rajasthan Royals",
        "destination": "Rajasthan, India",
        "price": 55000,
        "dates": "October-March 2026",
        "type": "tour",
        "description": "8N/9D - Journey through palaces and forts of Jaipur, Udaipur, and Jodhpur. History and heritage focus with heritage hotel stays.",
        "duration": "8 Nights / 9 Days",
        "suitable_for": ["History Buffs", "Families"],
        "inclusions": ["Heritage hotels", "All meals", "Guided tours", "Train transfers"],
    },
    {
        "id": "pkg-006",
        "name": "Himachal Hill Retreat",
        "destination": "Himachal Pradesh, India",
        "price": 35000,
        "dates": "Year-round",
        "type": "tour",
        "description": "6N/7D - Snow-capped mountains and apple orchards in Manali, Shimla, and Dharamshala. Nature escape with hill resort stays.",
        "duration": "6 Nights / 7 Days",
        "suitable_for": ["Nature Lovers", "Couples"],
        "inclusions": ["Hill resort accommodation", "Meals", "Local transfers"],
    },
    {
        "id": "pkg-007",
        "name": "Northeast Wonders",
        "destination": "Northeast India",
        "price": 60000,
        "dates": "October-April 2026",
        "type": "tour",
        "description": "9N/10D - Vibrant cultures and tea gardens in Assam, Meghalaya, and Arunachal Pradesh. Offbeat exploration with luxury camps and tribal visits.",
        "duration": "9 Nights / 10 Days",
        "suitable_for": ["Explorers", "Groups"],
        "inclusions": ["Luxury camps", "Meals", "Tribal village visits", "Sightseeing"],
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
        
        # Filter by specific destinations
        if any(word in lower_message for word in ["dubai", "uae", "emirates"]):
            matched = [p for p in matched if "dubai" in p["destination"].lower()]
        elif any(word in lower_message for word in ["bhutan", "himalayan"]):
            matched = [p for p in matched if "bhutan" in p["destination"].lower()]
        elif any(word in lower_message for word in ["ladakh", "leh"]):
            matched = [p for p in matched if "ladakh" in p["destination"].lower()]
        elif any(word in lower_message for word in ["kerala", "backwater", "houseboat"]):
            matched = [p for p in matched if "kerala" in p["destination"].lower()]
        elif any(word in lower_message for word in ["rajasthan", "jaipur", "udaipur", "jodhpur", "palace", "fort"]):
            matched = [p for p in matched if "rajasthan" in p["destination"].lower()]
        elif any(word in lower_message for word in ["himachal", "manali", "shimla", "dharamshala"]):
            matched = [p for p in matched if "himachal" in p["destination"].lower()]
        elif any(word in lower_message for word in ["northeast", "assam", "meghalaya", "arunachal"]):
            matched = [p for p in matched if "northeast" in p["destination"].lower()]
        
        # Filter by vibe/type if no destination match
        if len(matched) == len(MOCK_PACKAGES):
            if any(word in lower_message for word in ["beach", "water", "backwater", "cruise"]):
                matched = [p for p in matched if any(kw in p["description"].lower() 
                          for kw in ["backwater", "cruise", "houseboat"])]
            elif any(word in lower_message for word in ["city", "urban", "luxury", "shopping"]):
                matched = [p for p in matched if any(kw in p["description"].lower()
                          for kw in ["city", "luxury", "shopping", "dubai"])]
            elif any(word in lower_message for word in ["adventure", "mountain", "trek", "high-altitude"]):
                matched = [p for p in matched if any(kw in p["description"].lower()
                          for kw in ["adventure", "mountain", "trek", "high-altitude"])]
            elif any(word in lower_message for word in ["romantic", "honeymoon", "couple"]):
                matched = [p for p in matched if "Couples" in str(p.get("suitable_for", []))]
            elif any(word in lower_message for word in ["cultural", "heritage", "history", "palace"]):
                matched = [p for p in matched if any(kw in p["description"].lower()
                          for kw in ["cultural", "heritage", "history", "palace", "fort"])]
            elif any(word in lower_message for word in ["nature", "serene", "peaceful"]):
                matched = [p for p in matched if any(kw in p["description"].lower()
                          for kw in ["serene", "nature", "peaceful"])]
            elif any(word in lower_message for word in ["family", "kids", "children"]):
                matched = [p for p in matched if "Families" in str(p.get("suitable_for", []))]
            elif any(word in lower_message for word in ["solo", "alone", "backpack"]):
                matched = [p for p in matched if "Solo" in str(p.get("suitable_for", []))]
        
        # Filter by budget (₹ or INR)
        import re
        budget_match = re.search(r'(?:₹|rupees?|inr|under|budget|around|up to)\s*(\d+)', lower_message)
        if budget_match:
            budget = int(budget_match.group(1))
            matched = [p for p in matched if p["price"] <= budget]
        
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
        system_prompt = f"""You are Tripscape's AI Trip Guide, a friendly and knowledgeable travel assistant specializing in Indian and international packages. Your role is to:

1. Help users plan their dream trips by understanding their preferences (destination, dates, travelers, budget in ₹, vibe).
2. Suggest relevant packages from Tripscape's collection (Dubai, Bhutan, Ladakh, Kerala, Rajasthan, Himachal, Northeast India).
3. All prices are per person (twin-sharing basis) in Indian Rupees (₹).
4. Parse user messages to extract: destination, dates, number of travelers, budget, and preferences.
5. Provide warm, personalized recommendations with enthusiasm.
6. When suggesting packages, briefly highlight why they're a great fit (e.g., "Dubai Escape is perfect for families with city tours and desert safaris").
7. If the user asks for an agent, offer to connect them to chat@tripscape.com.
8. Keep responses concise and conversational (2-3 sentences max, unless listing packages).
9. Packages range from ₹25,999 (Bhutan Bliss) to ₹95,999 (Dubai Escape).
10. Mention key features like duration, inclusions (hotels, meals, tours), and suitability (couples, families, adventure seekers).

Knowledge Base Context:
{kb_context or "Tripscape offers 7 curated packages: Dubai Escape, Bhutan Bliss, Ladakh Adventure, Kerala Backwaters, Rajasthan Royals, Himachal Hill Retreat, Northeast Wonders."}
{package_context}
{conv_context}

User's latest message: {message}

Respond naturally as the AI Trip Guide. If suggesting packages, mention them by name with prices (e.g., "Exotic Dubai Escape - ₹95,999"). Be enthusiastic and helpful!"""
        
        try:
            # Prepare the request for Claude Sonnet 4 (latest model)
            model_id = "anthropic.claude-sonnet-4-20250514-v1:0"
            
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
            return "I'd be happy to connect you with one of our travel experts at chat@tripscape.com! They can provide personalized assistance. Would you like me to transfer you?"
        
        if packages:
            pkg_names = ", ".join([p["name"] for p in packages[:2]])
            prices = " starting from ₹" + "{:,}".format(min(p["price"] for p in packages))
            return f"Perfect! I found {len(packages)} amazing package{'s' if len(packages) > 1 else ''} for you, including {pkg_names}{prices}. Check out the details below—each package is curated for an unforgettable experience! ✨"
        
        if any(word in lower_message for word in ["dubai", "uae"]):
            return "Dubai is spectacular! ✨ Our Exotic Dubai Escape (₹95,999) includes desert safaris, Burj Khalifa, and luxury shopping. Perfect for families and couples. When are you planning to visit?"
        
        if any(word in lower_message for word in ["beach", "water", "backwater"]):
            return "Love the water! �️ Kerala Backwaters package (₹28,500) offers houseboat cruises, Ayurvedic spas, and serene landscapes. Perfect for a romantic getaway. Interested?"
        
        if any(word in lower_message for word in ["mountain", "adventure", "trek"]):
            return "Adventure awaits! 🏔️ We have Ladakh Adventure (₹45,000) for high-altitude thrills or Himachal Hill Retreat (₹35,000) for snow-capped beauty. Which sounds exciting to you?"
        
        if any(word in lower_message for word in ["romantic", "honeymoon", "couple"]):
            return "How romantic! 💕 Kerala Backwaters (₹28,500) is perfect with houseboat stays, or try Himachal Hill Retreat (₹35,000) for mountain romance. What's your budget and preferred dates?"
        
        if any(word in lower_message for word in ["cultural", "heritage", "history"]):
            return "History lover! 🏰 Rajasthan Royals (₹55,000) takes you through Jaipur's palaces, Udaipur's forts, and Jodhpur's heritage. Or explore Bhutan's serene culture (₹25,999). Which interests you?"
        
        if any(word in lower_message for word in ["family", "kids"]):
            return "Family trip! 👨‍👩‍👧‍👦 Dubai Escape (₹95,999), Kerala Backwaters (₹28,500), or Rajasthan Royals (₹55,000) are all family-friendly. What's your budget and how many travelers?"
        
        return "Welcome to Tripscape! 🌍 I can help you find the perfect Indian or international holiday package. Tell me: What's your destination preference, budget (in ₹), travel dates, and group size? We have packages from ₹25,999 to ₹95,999!"

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
