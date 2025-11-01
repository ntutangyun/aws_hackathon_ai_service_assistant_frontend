# Backend API Endpoints Required for Debug Panel

This document outlines the API endpoints needed in your FastAPI backend to support the Debug Panel frontend.

## Base URL
```
http://localhost:8000
```

## 1. UDM (Unified Data Management) Endpoints

### Get All Subscriptions
```
GET /mcp/udm/subscriptions
Query Parameters:
  - status (optional): ACTIVE, SUSPENDED, TERMINATED
Response: List of subscription objects
```

### Get Subscription by ID
```
GET /mcp/udm/subscriptions/{subscriber_id}
Response: Subscription object
```

### Get Subscription Summary
```
GET /mcp/udm/summary
Response: {
  totalSubscriptions: number,
  activeSubscriptions: number,
  suspendedSubscriptions: number,
  totalEdgeAIServices: number,
  totalDataUsed: number,
  averageDataPerUser: number
}
```

### Get QoS Profile
```
GET /mcp/udm/subscriptions/{subscriber_id}/qos
Response: QoS profile object
```

### Get Edge AI Subscriptions
```
GET /mcp/udm/subscriptions/{subscriber_id}/edge-ai
Response: List of Edge AI subscription objects
```

---

## 2. Edge Server Endpoints

### Get All Edge Servers
```
GET /mcp/edge/servers
Query Parameters:
  - status (optional): ONLINE, OFFLINE, MAINTENANCE
  - health (optional): HEALTHY, WARNING, CRITICAL
Response: List of edge server objects
```

### Get Edge Server by ID
```
GET /mcp/edge/servers/{server_id}
Response: Edge server object
```

### Get Server Resources
```
GET /mcp/edge/servers/{server_id}/resources
Response: Resource information (CPU, Memory, GPU, Storage, Network)
```

### Get GPU Resources
```
GET /mcp/edge/servers/{server_id}/gpu
Response: GPU resource information
```

### Get Deployed Services
```
GET /mcp/edge/servers/{server_id}/services
Response: List of deployed service objects
```

### Get Network Summary
```
GET /mcp/edge/network-summary
Response: {
  totalServers: number,
  onlineServers: number,
  offlineServers: number,
  maintenanceServers: number,
  totalDeployments: number,
  totalCPU: number,
  usedCPU: number,
  availableCPU: number,
  cpuUtilization: number,
  totalMemory: number,
  usedMemory: number,
  availableMemory: number,
  memoryUtilization: number,
  totalGPUs: number,
  totalGPUMemory: number,
  usedGPUMemory: number,
  availableGPUMemory: number,
  gpuUtilization: number
}
```

### Get Health Status
```
GET /mcp/edge/health-status
Response: List of server health status objects
```

### Find Servers with Capacity
```
GET /mcp/edge/servers/find-capacity
Query Parameters:
  - cpu_required (optional): number
  - memory_required (optional): number
  - gpu_memory_required (optional): number
  - min_gpu_count (optional): number
Response: List of suitable edge server objects
```

---

## 3. AI Service Repository Endpoints

### Get All AI Services
```
GET /mcp/ai-services/services
Query Parameters:
  - category (optional): COMPUTER_VISION, GAMING, NLP, ROBOTICS, HEALTHCARE, INDUSTRIAL_IOT
  - status (optional): AVAILABLE, DEPRECATED, BETA, MAINTENANCE
  - gpu_required (optional): true/false
Response: List of AI service objects
```

### Get AI Service by ID
```
GET /mcp/ai-services/services/{service_id}
Response: AI service object
```

### Search Services
```
GET /mcp/ai-services/services/search
Query Parameters:
  - keyword: search keyword
Response: List of matching AI service objects
```

### Get Categories
```
GET /mcp/ai-services/categories
Response: List of category objects with service counts
```

### Get Catalog Summary
```
GET /mcp/ai-services/summary
Response: {
  totalServices: number,
  availableServices: number,
  betaServices: number,
  deprecatedServices: number,
  gpuRequiredServices: number,
  cpuOnlyServices: number,
  totalCategories: number,
  averageCPUPerInstance: number,
  averageMemoryPerInstance: number
}
```

### Get Service Requirements
```
GET /mcp/ai-services/services/{service_id}/requirements
Response: Service resource and QoS requirements
```

### Get Deployment Info
```
GET /mcp/ai-services/services/{service_id}/deployment
Response: Service deployment configuration
```

### Find Services by Resources
```
GET /mcp/ai-services/services/find-by-resources
Query Parameters:
  - max_cpu (optional): number
  - max_memory (optional): number
  - max_gpu_memory (optional): number
  - gpu_optional (optional): true/false
Response: List of suitable AI service objects
```

---

## Example FastAPI Implementation

```python
from fastapi import FastAPI, Query
from typing import Optional
import httpx

app = FastAPI()

# MCP Server URLs
UDM_MCP_URL = "http://localhost:9000"
EDGE_MCP_URL = "http://localhost:9001"
AI_SERVICE_MCP_URL = "http://localhost:9002"

# UDM Endpoints
@app.get("/mcp/udm/subscriptions")
async def get_all_subscriptions(status: Optional[str] = None):
    async with httpx.AsyncClient() as client:
        # Call UDM MCP server tool
        response = await client.post(
            f"{UDM_MCP_URL}/tools/get_all_subscriptions",
            json={"status": status} if status else {}
        )
        return response.json()

@app.get("/mcp/udm/summary")
async def get_subscription_summary():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{UDM_MCP_URL}/tools/get_subscription_summary",
            json={}
        )
        return response.json()

# Edge Server Endpoints
@app.get("/mcp/edge/servers")
async def get_all_edge_servers(
    status: Optional[str] = None,
    health: Optional[str] = None
):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{EDGE_MCP_URL}/tools/get_all_edge_servers",
            json={"status": status, "health": health}
        )
        return response.json()

@app.get("/mcp/edge/network-summary")
async def get_network_summary():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{EDGE_MCP_URL}/tools/get_network_summary",
            json={}
        )
        return response.json()

# AI Service Endpoints
@app.get("/mcp/ai-services/services")
async def get_all_services(
    category: Optional[str] = None,
    status: Optional[str] = None,
    gpu_required: Optional[bool] = None
):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AI_SERVICE_MCP_URL}/tools/get_all_services",
            json={
                "category": category,
                "status": status,
                "gpu_required": gpu_required
            }
        )
        return response.json()

@app.get("/mcp/ai-services/summary")
async def get_catalog_summary():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AI_SERVICE_MCP_URL}/tools/get_catalog_summary",
            json={}
        )
        return response.json()
```

---

## Notes

1. All MCP server tools are accessed via POST requests to `/tools/{tool_name}`
2. Tool parameters are passed in the JSON body
3. The backend acts as a proxy between the frontend and MCP servers
4. Make sure all MCP servers are running on their configured ports:
   - UDM: port 9000
   - Edge Server: port 9001
   - AI Service Repository: port 9002
