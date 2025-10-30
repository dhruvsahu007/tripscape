from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from typing import Dict, List
import json
import asyncio

router = APIRouter(prefix="/api/agent", tags=["Agent"])

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_agents: Dict[str, WebSocket] = {}
        self.active_customers: Dict[str, WebSocket] = {}
        self.customer_queue: List[str] = []
    
    async def connect_agent(self, agent_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_agents[agent_id] = websocket
        print(f"Agent {agent_id} connected. Total agents: {len(self.active_agents)}")
    
    async def connect_customer(self, customer_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_customers[customer_id] = websocket
        self.customer_queue.append(customer_id)
        print(f"Customer {customer_id} connected. Queue size: {len(self.customer_queue)}")
    
    def disconnect_agent(self, agent_id: str):
        if agent_id in self.active_agents:
            del self.active_agents[agent_id]
        print(f"Agent {agent_id} disconnected. Total agents: {len(self.active_agents)}")
    
    def disconnect_customer(self, customer_id: str):
        if customer_id in self.active_customers:
            del self.active_customers[customer_id]
        if customer_id in self.customer_queue:
            self.customer_queue.remove(customer_id)
        print(f"Customer {customer_id} disconnected. Queue size: {len(self.customer_queue)}")
    
    async def send_to_agent(self, agent_id: str, message: dict):
        if agent_id in self.active_agents:
            await self.active_agents[agent_id].send_json(message)
    
    async def send_to_customer(self, customer_id: str, message: dict):
        if customer_id in self.active_customers:
            await self.active_customers[customer_id].send_json(message)
    
    async def broadcast_to_agents(self, message: dict):
        for agent_id, connection in self.active_agents.items():
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting to agent {agent_id}: {e}")

manager = ConnectionManager()

@router.websocket("/ws/agent")
async def agent_websocket(websocket: WebSocket):
    """WebSocket endpoint for agents"""
    agent_id = f"agent_{len(manager.active_agents) + 1}"
    await manager.connect_agent(agent_id, websocket)
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "connected",
            "agent_id": agent_id,
            "queue_size": len(manager.customer_queue)
        })
        
        # Listen for messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "get_queue":
                await websocket.send_json({
                    "type": "queue_update",
                    "queue": manager.customer_queue,
                    "queue_size": len(manager.customer_queue)
                })
            
            elif message.get("type") == "message_to_customer":
                customer_id = message.get("customer_id")
                content = message.get("content")
                await manager.send_to_customer(customer_id, {
                    "type": "agent_message",
                    "from": agent_id,
                    "content": content
                })
            
    except WebSocketDisconnect:
        manager.disconnect_agent(agent_id)
    except Exception as e:
        print(f"Agent websocket error: {e}")
        manager.disconnect_agent(agent_id)

@router.websocket("/ws/customer/{customer_id}")
async def customer_websocket(websocket: WebSocket, customer_id: str):
    """WebSocket endpoint for customers"""
    await manager.connect_customer(customer_id, websocket)
    
    try:
        # Notify agents about new customer
        await manager.broadcast_to_agents({
            "type": "new_customer",
            "customer_id": customer_id,
            "queue_size": len(manager.customer_queue)
        })
        
        # Send welcome message
        await websocket.send_json({
            "type": "connected",
            "customer_id": customer_id,
            "message": "Connected to Tripscape support"
        })
        
        # Listen for messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast customer messages to all agents
            if message.get("type") == "message":
                await manager.broadcast_to_agents({
                    "type": "customer_message",
                    "from": customer_id,
                    "content": message.get("content")
                })
            
    except WebSocketDisconnect:
        manager.disconnect_customer(customer_id)
        # Notify agents
        await manager.broadcast_to_agents({
            "type": "customer_disconnected",
            "customer_id": customer_id,
            "queue_size": len(manager.customer_queue)
        })
    except Exception as e:
        print(f"Customer websocket error: {e}")
        manager.disconnect_customer(customer_id)

@router.get("/stats")
async def get_agent_stats():
    """Get current agent statistics"""
    return {
        "active_agents": len(manager.active_agents),
        "active_customers": len(manager.active_customers),
        "queue_size": len(manager.customer_queue),
        "agents": list(manager.active_agents.keys()),
        "customers": list(manager.active_customers.keys())
    }
