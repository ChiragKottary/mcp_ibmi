# 🏗️ Complete MCP Server Architecture Explanation

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR MCP SERVER ECOSYSTEM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   VS Code       │    │  Claude Desktop │    │ MCP Inspector│ │
│  │   + Copilot     │    │                 │    │  (Web UI)    │ │
│  │   + Gemini      │    │                 │    │              │ │
│  └─────────┬───────┘    └─────────┬───────┘    └──────┬───────┘ │
│            │                      │                   │         │
│            └──────────────────────┼───────────────────┘         │
│                                   │                             │
│  ┌─────────────────────────────────▼─────────────────────────┐  │
│  │              MCP SERVER (build/index.js)                 │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Tools Available:                                   │  │  │
│  │  │  • search_invoices                                  │  │  │
│  │  │  • get_invoice_details                              │  │  │
│  │  │  • get_invoices_summary                             │  │  │
│  │  │  • search_orders                                    │  │  │
│  │  │  • get_order_details                                │  │  │
│  │  │  • get_orders_summary                               │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └─────────────────────┬───────────────────────────────────┘  │
│                        │                                       │
│  ┌─────────────────────▼───────────────────────────────────┐  │
│  │           DUMMY API SERVER (dummy-api/server.js)        │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Endpoints:                                         │  │  │
│  │  │  • GET /health                                      │  │  │
│  │  │  • GET /api/invoices                                │  │  │
│  │  │  • GET /api/invoices/:id                            │  │  │
│  │  │  • GET /api/invoices/summary                        │  │  │
│  │  │  • GET /api/orders                                  │  │  │
│  │  │  • GET /api/orders/:id                              │  │  │
│  │  │  • GET /api/orders/summary                          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Section 1: Project Structure

### 📁 File Organization
```
mcp_yt/
├── 📁 src/                    # TypeScript source code
│   ├── index.ts              # Main MCP server entry point
│   ├── config.ts             # Configuration settings
│   └── 📁 services/
│       ├── apiService.ts     # API communication logic
│       └── toolsService.ts   # MCP tools implementation
├── 📁 build/                 # Compiled JavaScript (generated)
│   ├── index.js              # Compiled main server
│   ├── config.js             # Compiled config
│   └── 📁 services/
│       ├── apiService.js     # Compiled API service
│       └── toolsService.js   # Compiled tools service
├── 📁 dummy-api/             # Mock API server
│   ├── server.js             # Express.js mock server
│   ├── package.json          # Dependencies for mock API
│   └── 📁 node_modules/      # Mock API dependencies
├── 📁 .vscode/               # VS Code configuration
│   ├── mcp.json              # MCP server config for VS Code
│   └── settings.json         # VS Code workspace settings
├── package.json              # Main project dependencies
├── tsconfig.json             # TypeScript configuration
├── claude_desktop_config.json # Claude Desktop MCP config
└── README.md                 # Documentation
```

## 🚀 Section 2: How Everything Starts

### Step 1: Dummy API Server (Port 3001)
**File:** `dummy-api/server.js`
**Command:** `node server.js`
**Purpose:** Provides mock data for testing

```javascript
// What happens when you run: node server.js
const express = require('express');
const app = express();
const PORT = 3001;

// Loads 4 sample invoices and 4 sample orders
const invoices = [/* mock data */];
const orders = [/* mock data */];

// Creates REST API endpoints
app.get('/health', (req, res) => { /* health check */ });
app.get('/api/invoices', (req, res) => { /* return invoices */ });
app.get('/api/orders', (req, res) => { /* return orders */ });
// ... more endpoints

app.listen(PORT, () => {
    console.log(`🚀 BuildMate Dummy API Server running on http://localhost:${PORT}`);
});
```

### Step 2: MCP Server (build/index.js)
**File:** `build/index.js` (compiled from `src/index.ts`)
**Command:** `npm run dev` or `node build/index.js`
**Purpose:** Creates MCP protocol server that connects to dummy API

```javascript
// What happens when you run: npm run dev
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 1. Creates MCP Server instance
const server = new Server({
    name: "BuildMate Invoice & Order MCP Server",
    version: "1.0.0"
});

// 2. Registers 6 tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            { name: "search_invoices", description: "..." },
            { name: "get_invoice_details", description: "..." },
            // ... 4 more tools
        ]
    };
});

// 3. Handles tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    switch (name) {
        case "search_invoices":
            return await toolsService.searchInvoices(args);
        // ... handle other tools
    }
});

// 4. Connects via stdio (for MCP protocol)
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Step 3: MCP Inspector (Web UI)
**Command:** `npx @modelcontextprotocol/inspector`
**Purpose:** Provides web interface to test MCP server

```javascript
// What happens when you run: npx @modelcontextprotocol/inspector
// 1. Starts a web server (usually port 3000)
// 2. Creates MCP client that connects to your server
// 3. Provides web UI to test all tools
// 4. Shows real-time API calls and responses
```

## 🔗 Section 3: How Everything Connects

### Connection Flow
```
1. User opens MCP Inspector (web browser)
   ↓
2. MCP Inspector starts MCP client
   ↓
3. MCP client connects to MCP server via stdio
   ↓
4. MCP server receives tool call request
   ↓
5. MCP server calls toolsService.searchInvoices()
   ↓
6. toolsService calls apiService.makeRequest()
   ↓
7. apiService makes HTTP request to dummy API
   ↓
8. Dummy API returns JSON data
   ↓
9. Data flows back through the chain
   ↓
10. MCP Inspector displays result in web UI
```

### Data Flow Example
```
User clicks "search_invoices" in MCP Inspector
    ↓
MCP Inspector sends: {"method": "tools/call", "params": {"name": "search_invoices"}}
    ↓
MCP Server receives request
    ↓
MCP Server calls: toolsService.searchInvoices({})
    ↓
toolsService calls: apiService.makeRequest("GET", "/api/invoices")
    ↓
apiService makes HTTP request to: http://pub400.com:3012/api/invoices
    ↓
Dummy API returns: [{"id": "INV-2024-001", "amount": 2500, ...}]
    ↓
MCP Server formats response and sends back
    ↓
MCP Inspector displays the invoice data in web UI
```

## 📋 Section 4: Configuration Files Explained

### 1. `claude_desktop_config.json`
```json
{
    "mcpServers": {
        "buildmate-mcp": {
            "command": "node",
            "args": ["C:\\Users\\ruraj\\Downloads\\mcp_yt\\build\\index.js"],
            "env": {
                "NODEJS_API_BASE_URL": "http://pub400.com:3012/api"
            }
        }
    }
}
```
**Purpose:** Tells Claude Desktop how to connect to your MCP server
**How it works:** Claude Desktop reads this file and starts your MCP server as a subprocess

### 2. `.vscode/mcp.json`
```json
{
    "mcpServers": {
        "buildmate-mcp": {
            "command": "node",
            "args": ["C:\\Users\\ruraj\\Downloads\\mcp_yt\\build\\index.js"],
            "env": {
                "NODEJS_API_BASE_URL": "http://pub400.com:3012/api"
            }
        }
    }
}
```
**Purpose:** VS Code MCP configuration (if VS Code had MCP support)
**How it works:** Would tell VS Code how to connect to your MCP server

### 3. `package.json`
```json
{
    "scripts": {
        "build": "tsc",
        "dev": "tsc && node build/index.js",
        "start": "node build/index.js"
    },
    "dependencies": {
        "@modelcontextprotocol/sdk": "^1.0.4",
        "axios": "^1.6.7"
    }
}
```
**Purpose:** Defines how to build and run your MCP server
**How it works:** 
- `npm run build` compiles TypeScript to JavaScript
- `npm run dev` compiles and runs the server
- `npm start` runs the compiled server

## 🛠️ Section 5: Service Layer Breakdown

### `src/services/toolsService.ts`
**Purpose:** Implements the 6 MCP tools
**How it works:**
```typescript
export const toolsService = {
    async searchInvoices(args: any) {
        // 1. Build query parameters
        const queryParams = new URLSearchParams();
        if (args.customerId) queryParams.append('customerId', args.customerId);
        if (args.status) queryParams.append('status', args.status);
        // ... more filters
        
        // 2. Call API service
        const response = await apiService.makeRequest('GET', `/invoices?${queryParams}`);
        
        // 3. Format response for MCP
        return {
            content: [{
                type: "text",
                text: `Found ${response.data.length} invoices...`
            }]
        };
    }
};
```

### `src/services/apiService.ts`
**Purpose:** Handles HTTP communication with dummy API
**How it works:**
```typescript
export const apiService = {
    async makeRequest(method: string, endpoint: string) {
        const url = `${config.NODEJS_API_BASE_URL}${endpoint}`;
        const response = await axios({
            method,
            url,
            timeout: config.API_TIMEOUT
        });
        return response;
    }
};
```

## 🎯 Section 6: Starting Everything

### Complete Startup Sequence
```powershell
# Terminal 1: Start Dummy API
cd C:\Users\ruraj\Downloads\mcp_yt\dummy-api
node server.js
# Output: 🚀 BuildMate Dummy API Server running on http://localhost:3001

# Terminal 2: Start MCP Server
cd C:\Users\ruraj\Downloads\mcp_yt
npm run dev
# Output: Starting BuildMate Invoice & Order MCP Server v1.0.0...
#         MCP Server connected and ready!

# Terminal 3: Start MCP Inspector
cd C:\Users\ruraj\Downloads\mcp_yt
npx @modelcontextprotocol/inspector
# Output: Starting MCP inspector...
#         Opens web browser to test interface
```

## 🔍 Section 7: Testing Your Setup

### Test 1: API Direct Testing
```powershell
# Test if dummy API is running
curl.exe http://pub400.com:3012/health
# Expected: {"status":"healthy","message":"BuildMate Dummy API is running"}

# Test invoices endpoint
curl.exe http://pub400.com:3012/api/invoices
# Expected: [{"id":"INV-2024-001","amount":2500,...}]
```

### Test 2: MCP Inspector Testing
1. Open web browser to MCP Inspector
2. Click on "search_invoices" tool
3. Click "Call Tool" button
4. See invoice data displayed

### Test 3: Claude Desktop Testing
1. Restart Claude Desktop
2. Ask: "Show me all pending invoices"
3. Claude will use your MCP server to get data

## 🎨 Section 8: Customization Points

### Adding New Tools
1. Add tool definition in `src/index.ts`
2. Add tool handler in `src/index.ts`
3. Implement tool logic in `src/services/toolsService.ts`
4. Rebuild: `npm run build`

### Adding New API Endpoints
1. Add endpoint in `dummy-api/server.js`
2. Add corresponding tool in MCP server
3. Update `toolsService.ts` to call new endpoint

### Changing Mock Data
1. Edit `dummy-api/server.js`
2. Modify the `invoices` and `orders` arrays
3. Restart dummy API server

## 🚨 Section 9: Troubleshooting

### Common Issues
1. **Port 3001 in use**: Kill existing Node processes
2. **MCP Inspector port conflict**: Use different port
3. **JSON parsing errors**: Check MCP server output
4. **API connection failed**: Ensure dummy API is running

### Debug Commands
```powershell
# Check what's running on port 3001
netstat -an | findstr :3001

# Kill all Node processes
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Check MCP server logs
npm run dev
```

This is your complete MCP server ecosystem! Everything is connected and ready to use. 🚀
