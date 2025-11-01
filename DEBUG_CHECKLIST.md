# Debug Checklist for Subscriptions Not Showing

## 🔍 Steps to Debug

### 1. Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab** for errors or warnings
- Look for these log messages:
  - `Raw API Response: ...`
  - `Processed subscriptions: ...`
  - Any error messages in red

### 2. Check Network Tab
In DevTools → Network tab:
- Click "All Subscriptions" button
- Look for the API request to `/mcp/udm/subscriptions`
- Check:
  - ✅ Request is sent (should appear in list)
  - ✅ Status code (should be 200)
  - ✅ Response data (click on request → Preview/Response tab)

### 3. Common Issues & Solutions

#### Issue A: CORS Error
**Symptoms**: Console shows `CORS policy` error
**Solution**:
- Backend needs to enable CORS
- Add to FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Issue B: Backend Not Running
**Symptoms**: Console shows `Failed to fetch` or `ERR_CONNECTION_REFUSED`
**Solution**:
- Start your FastAPI backend server
- Verify it's running on the correct port
- Check `VITE_API_URL` environment variable

#### Issue C: Backend Returns Wrong Format
**Symptoms**: Console shows `Unexpected data format`
**Solution**:
- Check console log for actual data structure
- Backend should return array of subscriptions directly
- Or wrap in `{ result: [...] }` or `{ data: [...] }`

#### Issue D: Backend Not Implemented Yet
**Symptoms**: 404 or 500 error in Network tab
**Solution**:
- Implement the backend endpoint `/mcp/udm/subscriptions`
- Should call UDM MCP server and return results

### 4. Backend Endpoint Requirements

Your FastAPI backend should have:

```python
from fastapi import FastAPI
import httpx

app = FastAPI()

UDM_MCP_URL = "http://localhost:9000"  # Update with your UDM MCP server URL

@app.get("/mcp/udm/subscriptions")
async def get_all_subscriptions(status: str = None):
    """Get all subscriptions from UDM MCP server"""
    async with httpx.AsyncClient() as client:
        # Call UDM MCP server tool
        payload = {}
        if status:
            payload["status"] = status

        response = await client.post(
            f"{UDM_MCP_URL}/tools/get_all_subscriptions",
            json=payload,
            timeout=10.0
        )

        data = response.json()

        # MCP servers return results in a specific format
        # Extract the actual result from the response
        if isinstance(data, dict) and "result" in data:
            return data["result"]
        elif isinstance(data, dict) and "content" in data:
            # Some MCP servers wrap in content
            return data["content"]
        else:
            return data
```

### 5. MCP Server Check

Verify UDM MCP server is running:
```bash
# Should be running on port 9000 (or configured port)
curl http://localhost:9000/health
# or test the tool directly
curl -X POST http://localhost:9000/tools/get_all_subscriptions \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 6. Quick Test with Mock Data

If backend isn't ready, you can test frontend with mock data by temporarily modifying `mcpApi.js`:

```javascript
export const udmApi = {
  getAllSubscriptions: async (status = null) => {
    // TEMPORARY MOCK DATA - REMOVE AFTER BACKEND IS READY
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            "subscriberId": "sub-001",
            "imsi": "310150123456789",
            "msisdn": "+1234567890",
            "subscriberName": "Alice Johnson",
            "subscriptionStatus": "ACTIVE",
            "createdAt": "2024-01-15 10:30:00",
            "updatedAt": "2024-01-15 10:30:00",
            "cellularSubscription": {
              "planType": "UNLIMITED",
              "dataLimit": null,
              "dataUsed": 15.5,
              "qos": {
                "qci": 9,
                "priority": "STANDARD",
                "maxBitRateDL": 100,
                "maxBitRateUL": 50,
                "guaranteedBitRateDL": 10,
                "guaranteedBitRateUL": 5,
                "latency": 20
              }
            },
            "edgeAISubscriptions": []
          }
        ]);
      }, 500);
    });
  },
  // ... other methods
};
```

### 7. Environment Variable Check

Verify `.env` or `.env.local` file exists in frontend folder:

```env
VITE_API_URL=http://localhost:8000
```

Restart Vite dev server after changing .env files:
```bash
npm run dev
```

### 8. Debug Info Panel

The yellow debug panel at the bottom will show:
- How many subscriptions were received
- This helps verify data is being fetched

---

## ✅ What Should Work

After clicking "All Subscriptions":
1. ✅ Loading spinner appears
2. ✅ API request sent to backend
3. ✅ Backend forwards request to UDM MCP server
4. ✅ Data returned and processed
5. ✅ Beautiful subscription cards displayed

---

## 🆘 Still Not Working?

Check the browser console and share:
1. Any error messages (red text)
2. The console.log output showing "Raw API Response"
3. The Network tab showing the request/response

This will help identify exactly where the issue is!
