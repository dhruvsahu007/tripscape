"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Loader2, MessageCircle, Plane, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  packages?: PackageSuggestion[]
}

interface PackageSuggestion {
  id: string
  name: string
  destination: string
  price: number
  dates: string
  type: "tour" | "hotel" | "flight"
  description: string
}

interface AIChatbotProps {
  onFormFill?: (data: { dest: string; date: string; travelers: number }) => void
}

export default function AIChatbot({ onFormFill }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [conversationCount, setConversationCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inactivityTimeoutRef = useRef<NodeJS.Timeout>()

  // Show bubble with fade-in after 3s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-minimize after 2min inactivity
  useEffect(() => {
    if (isOpen && !isMinimized) {
      clearTimeout(inactivityTimeoutRef.current)
      inactivityTimeoutRef.current = setTimeout(() => {
        setIsMinimized(true)
      }, 120000) // 2 minutes
    }
    return () => clearTimeout(inactivityTimeoutRef.current)
  }, [isOpen, isMinimized, messages])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: "Hi! 👋 I'm your AI Trip Guide from Tripscape. Let's plan your dream trip! What's your vibe—beaches 🏖️, cities 🌆, or adventure 🏔️? (Or share your dates, group size, and budget!)",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([greetingMessage])
    }
  }, [isOpen])

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setConversationCount((prev) => prev + 1)

    try {
      // Call backend API (FastAPI)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: "bot",
        timestamp: new Date(),
        packages: data.packages,
      }

      setMessages((prev) => [...prev, botMessage])

      // Auto-fill form if data is provided
      if (data.formData && onFormFill) {
        onFormFill(data.formData)
      }

      // Escalate to agent after 5 exchanges
      if (conversationCount >= 4) {
        setTimeout(() => {
          const escalateMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "Would you like to connect with a live agent for personalized assistance? 🙋‍♂️",
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, escalateMessage])
        }, 1000)
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again or contact our support team.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handlePackageSelect = (pkg: PackageSuggestion) => {
    window.location.href = `/packages/${pkg.id}`
  }

  const handleConnectAgent = () => {
    const agentMessage: Message = {
      id: Date.now().toString(),
      text: "Connecting you to a live agent... Please hold on! 🔄",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, agentMessage])
    
    // Connect to agent via WebSocket
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"
    const customerId = `customer-${Date.now()}`
    const ws = new WebSocket(`${wsUrl}/api/agent/ws/customer/${customerId}`)
    
    ws.onopen = () => {
      console.log("Connected to agent system")
    }
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "agent_message") {
        const agentMsg: Message = {
          id: Date.now().toString(),
          text: data.message,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, agentMsg])
      }
    }
  }

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={cn(
            "fixed bottom-6 right-6 z-50 h-[60px] w-[60px] rounded-full bg-red-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300",
            showBubble ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          aria-label="Open AI Chat"
        >
          <div className="flex items-center justify-center">
            <MessageCircle className="h-6 w-6" />
            <Plane className="absolute h-4 w-4 -top-1 -right-1 rotate-45" />
          </div>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleClose}
          />

          {/* Chat Container */}
          <div
            className={cn(
              "fixed z-50 bg-white shadow-2xl transition-all duration-300 flex flex-col",
              "md:bottom-6 md:right-6 md:w-[380px] md:rounded-2xl",
              "max-md:inset-0 max-md:w-full max-md:h-full",
              isMinimized ? "md:h-[60px]" : "md:h-[600px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Plane className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Trip Guide</h3>
                  <p className="text-xs opacity-90">Powered by Tripscape</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMinimize}
                  className="hidden md:block p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                            message.sender === "user"
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-100 text-gray-900 rounded-bl-none"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          {message.packages && message.packages.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.packages.map((pkg) => (
                                <div
                                  key={pkg.id}
                                  className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-900 text-xs">
                                      {pkg.name}
                                    </h4>
                                    <span className="text-red-600 font-bold text-sm">
                                      ${pkg.price}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">
                                    {pkg.destination} • {pkg.dates}
                                  </p>
                                  <p className="text-xs text-gray-500 mb-2">
                                    {pkg.description}
                                  </p>
                                  <Button
                                    size="sm"
                                    onClick={() => handlePackageSelect(pkg)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                                  >
                                    Select Package
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Powered by AWS Bedrock AI
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}

// Hero Teaser Button Component
export function AIChatTeaser({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm font-medium border border-blue-200"
    >
      <span>AI Trip Guide</span>
      <span className="text-lg">👋</span>
    </button>
  )
}
