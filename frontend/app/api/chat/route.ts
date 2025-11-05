import { NextRequest, NextResponse } from "next/server"
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime"
import {
  BedrockAgentRuntimeClient,
  RetrieveCommand,
} from "@aws-sdk/client-bedrock-agent-runtime"

// Mock packages for fallback when KB is unavailable
const MOCK_PACKAGES = [
  {
    id: "pkg-001",
    name: "Bali Paradise Escape",
    destination: "Bali, Indonesia",
    price: 1299,
    dates: "July 15-22, 2025",
    type: "tour" as const,
    description: "7 nights in luxury resort, daily breakfast, guided tours",
  },
  {
    id: "pkg-002",
    name: "European Grand Tour",
    destination: "Paris, Rome, Barcelona",
    price: 2499,
    dates: "August 10-20, 2025",
    type: "tour" as const,
    description: "10 days exploring Europe's finest cities with all meals included",
  },
  {
    id: "pkg-003",
    name: "Maldives Honeymoon",
    destination: "Maldives",
    price: 3500,
    dates: "September 5-12, 2025",
    type: "hotel" as const,
    description: "Overwater villa, all-inclusive, couples spa treatments",
  },
  {
    id: "pkg-004",
    name: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    price: 1899,
    dates: "October 1-8, 2025",
    type: "tour" as const,
    description: "Cultural immersion, sushi making class, Mt. Fuji day trip",
  },
  {
    id: "pkg-005",
    name: "Safari in Kenya",
    destination: "Maasai Mara, Kenya",
    price: 3200,
    dates: "November 15-23, 2025",
    type: "tour" as const,
    description: "Big 5 safari, luxury tented camp, hot air balloon ride",
  },
]

// Initialize AWS clients
const bedrockRuntime = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const bedrockAgent = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      )
    }

    let kbContext = ""
    let retrievedPackages: any[] = []

    // Step 1: Retrieve from Knowledge Base (if configured)
    if (process.env.BEDROCK_KNOWLEDGE_BASE_ID) {
      try {
        const retrieveCommand = new RetrieveCommand({
          knowledgeBaseId: process.env.BEDROCK_KNOWLEDGE_BASE_ID,
          retrievalQuery: {
            text: message,
          },
          retrievalConfiguration: {
            vectorSearchConfiguration: {
              numberOfResults: 3,
            },
          },
        })

        const retrieveResponse = await bedrockAgent.send(retrieveCommand)

        if (retrieveResponse.retrievalResults) {
          kbContext = retrieveResponse.retrievalResults
            .map((result) => result.content?.text || "")
            .join("\n\n")
        }
      } catch (error) {
        console.warn("Knowledge Base retrieval failed, using mock data:", error)
      }
    }

    // Step 2: Parse user intent and match packages
    const lowerMessage = message.toLowerCase()
    const patterns = {
      destination: /(?:to|visit|go to|travel to|see)\s+([a-z\s]+)/i,
      budget: /(?:\$|under|budget|around|up to)\s*(\d+)/i,
      travelers: /(\d+)\s*(?:people|person|travelers|guests)/i,
      dates: /(?:in|on|during)\s+(january|february|march|april|may|june|july|august|september|october|november|december|[\d\/\-]+)/i,
      vibe: /(beach|city|cities|adventure|safari|mountain|cultural|relaxing|romantic|honeymoon)/i,
    }

    let matchedPackages = MOCK_PACKAGES

    // Filter by vibe
    if (patterns.vibe.test(lowerMessage)) {
      const vibe = lowerMessage.match(patterns.vibe)?.[1]
      matchedPackages = matchedPackages.filter((pkg) => {
        const pkgText = `${pkg.name} ${pkg.description}`.toLowerCase()
        if (vibe === "beach") return pkgText.includes("beach") || pkgText.includes("island") || pkgText.includes("maldives") || pkgText.includes("bali")
        if (vibe === "city" || vibe === "cities") return pkgText.includes("city") || pkgText.includes("tokyo") || pkgText.includes("paris")
        if (vibe === "adventure") return pkgText.includes("adventure") || pkgText.includes("safari") || pkgText.includes("balloon")
        if (vibe === "romantic" || vibe === "honeymoon") return pkgText.includes("honeymoon") || pkgText.includes("couples")
        return true
      })
    }

    // Filter by budget
    if (patterns.budget.test(lowerMessage)) {
      const budget = parseInt(lowerMessage.match(patterns.budget)?.[1] || "0")
      matchedPackages = matchedPackages.filter((pkg) => pkg.price <= budget)
    }

    // Filter by destination
    if (patterns.destination.test(lowerMessage)) {
      const dest = lowerMessage.match(patterns.destination)?.[1]?.trim()
      if (dest) {
        matchedPackages = matchedPackages.filter((pkg) =>
          pkg.destination.toLowerCase().includes(dest)
        )
      }
    }

    // Limit to top 3
    retrievedPackages = matchedPackages.slice(0, 3)

    // Step 3: Build context for Claude
    const packageContext =
      retrievedPackages.length > 0
        ? `\n\nAvailable packages:\n${retrievedPackages
            .map(
              (pkg) =>
                `- ${pkg.name} (${pkg.destination}) - $${pkg.price} - ${pkg.dates}: ${pkg.description}`
            )
            .join("\n")}`
        : ""

    // Step 4: Create prompt for Claude
    const systemPrompt = `You are Jetsetwonders's AI Trip Guide, a friendly and knowledgeable travel assistant. Your role is to:

1. Help users plan their dream trips by understanding their preferences (destination, dates, travelers, budget, vibe).
2. Suggest relevant travel packages from our collection based on their needs.
3. Parse user messages to extract: destination, dates, number of travelers, budget, and preferences.
4. Provide warm, personalized recommendations with enthusiasm.
5. When suggesting packages, briefly highlight why they're a great fit.
6. If the user asks for an agent or needs complex help, acknowledge and offer to connect them.
7. Keep responses concise and conversational (2-3 sentences max, unless listing packages).

Knowledge Base Context:
${kbContext || "Use the packages provided below."}
${packageContext}

Conversation so far:
${conversationHistory
  ?.map((msg: ConversationMessage) => `${msg.role}: ${msg.content}`)
  .join("\n") || ""}

User's latest message: ${message}

Respond naturally as the AI Trip Guide. If you're suggesting packages, mention them by name.`

    // Step 5: Invoke Claude via Bedrock
    const modelId = "anthropic.claude-3-sonnet-20240229-v1:0"

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    }

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    })

    let responseMessage = ""

    try {
      const response = await bedrockRuntime.send(command)
      const responseBody = JSON.parse(new TextDecoder().decode(response.body))
      responseMessage = responseBody.content?.[0]?.text || "I'm here to help! What would you like to know about your trip?"
    } catch (bedrockError) {
      console.error("Bedrock invocation failed:", bedrockError)
      
      // Fallback response with mock data
      responseMessage = generateFallbackResponse(message, retrievedPackages)
    }

    // Step 6: Extract form data if applicable
    let formData = null
    if (patterns.destination.test(lowerMessage) || patterns.dates.test(lowerMessage)) {
      formData = {
        dest: lowerMessage.match(patterns.destination)?.[1]?.trim() || "",
        date: lowerMessage.match(patterns.dates)?.[1] || "",
        travelers: parseInt(lowerMessage.match(patterns.travelers)?.[1] || "1"),
      }
    }

    // Step 7: Return response
    return NextResponse.json({
      message: responseMessage,
      packages: retrievedPackages.length > 0 ? retrievedPackages : undefined,
      formData,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat message",
        message:
          "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team.",
      },
      { status: 500 }
    )
  }
}

function generateFallbackResponse(message: string, packages: any[]): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("agent") || lowerMessage.includes("help") || lowerMessage.includes("talk to someone")) {
    return "I'd be happy to connect you with one of our travel experts! They can provide personalized assistance. Would you like me to transfer you?"
  }

  if (packages.length > 0) {
    return `Great choice! I found ${packages.length} amazing package${packages.length > 1 ? "s" : ""} for you. Check out the options below—each one is handpicked to make your trip unforgettable! ✨`
  }

  if (lowerMessage.includes("beach") || lowerMessage.includes("ocean")) {
    return "Beach vibes! 🏖️ I love it. Are you thinking tropical paradise like Bali or Maldives, or maybe a Mediterranean escape? Also, what's your rough budget and when are you looking to travel?"
  }

  if (lowerMessage.includes("city") || lowerMessage.includes("urban")) {
    return "City exploration—awesome! 🌆 Do you prefer historic European cities, vibrant Asian metropolises like Tokyo, or something else? Let me know your dates and group size!"
  }

  if (lowerMessage.includes("adventure") || lowerMessage.includes("active")) {
    return "Adventure awaits! 🏔️ Thinking safari, mountain trekking, or water sports? Tell me your preferred destination, travel dates, and how many adventurers are joining!"
  }

  return "Tell me more about your ideal trip! What's your destination, travel dates, group size, and budget? The more I know, the better I can help you find the perfect package! 🌍"
}
