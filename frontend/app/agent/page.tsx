"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Clock, CheckCircle, XCircle, Users } from "lucide-react"

interface Message {
  sender: string
  message: string
  timestamp: string
}

interface Customer {
  customer_id: string
  customer_name: string
  created_at: string
  status: string
}

interface ActiveChat {
  customer_id: string
  customer_name: string
  messages: Message[]
}

export default function AgentDashboard() {
  const [connected, setConnected] = useState(false)
  const [waitingCustomers, setWaitingCustomers] = useState<Customer[]>([])
  const [activeChats, setActiveChats] = useState<Map<string, ActiveChat>>(new Map())
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [stats, setStats] = useState({ waiting: 0, active: 0 })
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"
    const ws = new WebSocket(`${wsUrl}/api/agent/ws/agent`)
    ws.onopen = () => setConnected(true)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "initial_state") {
        setWaitingCustomers(data.waiting_customers || [])
        setStats({ waiting: data.waiting_customers?.length || 0, active: data.active_sessions?.length || 0 })
      } else if (data.type === "new_customer") {
        setWaitingCustomers((prev) => [...prev, { customer_id: data.customer_id, customer_name: data.customer_name, created_at: data.created_at, status: "waiting" }])
        setStats((prev) => ({ ...prev, waiting: prev.waiting + 1 }))
      } else if (data.type === "customer_message") {
        setActiveChats((prev) => {
          const newChats = new Map(prev)
          const chat = newChats.get(data.customer_id) || { 
            customer_id: data.customer_id, 
            customer_name: data.customer_name, 
            messages: [] as Message[]
          }
          chat.messages.push({ 
            sender: "customer", 
            message: data.message, 
            timestamp: data.timestamp 
          })
          newChats.set(data.customer_id, chat)
          return newChats
        })
      }
    }
    ws.onerror = () => setConnected(false)
    ws.onclose = () => setConnected(false)
    wsRef.current = ws
    return () => ws.close()
  }, [])

  const acceptCustomer = (customerId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "accept_customer", customer_id: customerId }))
      const customer = waitingCustomers.find((c) => c.customer_id === customerId)
      if (customer) {
        setActiveChats((prev) => { 
          const newChats = new Map(prev)
          newChats.set(customerId, { customer_id: customerId, customer_name: customer.customer_name, messages: [] })
          return newChats 
        })
        setWaitingCustomers((prev) => prev.filter((c) => c.customer_id !== customerId))
        setSelectedCustomer(customerId)
        setStats((prev) => ({ waiting: Math.max(0, prev.waiting - 1), active: prev.active + 1 }))
      }
    }
  }

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedCustomer || !wsRef.current) return
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "send_message", customer_id: selectedCustomer, message: messageInput }))
      setActiveChats((prev) => {
        const newChats = new Map(prev)
        const chat = newChats.get(selectedCustomer)
        if (chat) { 
          chat.messages.push({ sender: "agent", message: messageInput, timestamp: new Date().toISOString() })
          newChats.set(selectedCustomer, chat) 
        }
        return newChats
      })
      setMessageInput("")
    }
  }

  const selectedChat = selectedCustomer ? activeChats.get(selectedCustomer) : null

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="border-b border-slate-700 bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Jetsetwonders Agent Dashboard</h1>
              <Badge variant={connected ? "default" : "destructive"}>
                {connected ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div className="flex gap-4">
              <div className="bg-yellow-500/20 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-400 inline mr-2" />
                <span className="text-xs">Waiting: </span>
                <span className="text-lg font-bold">{stats.waiting}</span>
              </div>
              <div className="bg-green-500/20 px-4 py-2 rounded-lg">
                <Users className="h-5 w-5 text-green-400 inline mr-2" />
                <span className="text-xs">Active: </span>
                <span className="text-lg font-bold">{stats.active}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-80 border-r border-slate-700 bg-slate-900/30 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold mb-3">Waiting Queue ({waitingCustomers.length})</h2>
            <ScrollArea className="h-48">
              {waitingCustomers.length === 0 ? (
                <div className="text-center text-slate-400 py-8 text-sm">No customers</div>
              ) : (
                <div className="space-y-2">
                  {waitingCustomers.map((c) => (
                    <Card key={c.customer_id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8 bg-rose-500">
                            <AvatarFallback>{c.customer_name.substring(0,2)}</AvatarFallback>
                          </Avatar>
                          <div className="text-white text-sm">{c.customer_name}</div>
                        </div>
                        <Button size="sm" className="w-full bg-green-600" onClick={() => acceptCustomer(c.customer_id)}>
                          Accept
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          <div className="flex-1 p-4">
            <h2 className="text-lg font-semibold mb-3">Active ({activeChats.size})</h2>
            <ScrollArea className="h-full">
              {Array.from(activeChats.values()).map((chat) => (
                <Card 
                  key={chat.customer_id} 
                  className={`cursor-pointer mb-2 border-slate-700 ${selectedCustomer === chat.customer_id ? "bg-rose-600/30" : "bg-slate-800/50"}`}
                  onClick={() => setSelectedCustomer(chat.customer_id)}
                >
                  <CardContent className="p-3">
                    <Avatar className="h-8 w-8 bg-blue-500 inline-block mr-2">
                      <AvatarFallback>{chat.customer_name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm">{chat.customer_name}</span>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold">{selectedChat.customer_name}</h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedChat.messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === "agent" ? "bg-rose-600" : "bg-slate-800"}`}>
                        <div className="text-sm">{msg.message}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <Input 
                    value={messageInput} 
                    onChange={(e) => setMessageInput(e.target.value)} 
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()} 
                    placeholder="Message..." 
                    className="flex-1 bg-slate-800 text-white" 
                  />
                  <Button onClick={sendMessage} className="bg-rose-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold">No Chat Selected</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}