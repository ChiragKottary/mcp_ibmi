# MCP Server Setup Guide

## 🎯 **Understanding Your Setup**

You have **3 components** that need to work together:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular App   │───▶│  Backend Proxy  │───▶│   Claude API    │    │   IBM i API     │
│  (Port 4200)    │    │   (Port 3000)   │    │  (Anthropic)    │    │ (pub400.com)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                                              ▲
                                ▼                                              │
                       ┌─────────────────┐                                     │
                       │   MCP Server    │─────────────────────────────────────┘
                       │ (Tool Provider) │
                       └─────────────────┘
```

## 🚀 **Step-by-Step Setup**

### **Step 1: Start the MCP Server (IBM i Data Access)**

```bash
# Navigate to root MCP directory
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi"

# Build the MCP server
npm run build

# Start the MCP server in development mode
npm run dev
```

**Expected Output:**
```
Starting BuildMate Invoice & Order MCP Server v1.0.0...
API Base URL: http://pub400.com:3012/
MCP Server connected and ready!
Available tools: search_invoices, get_invoice_details, get_all_invoices, get_customer_invoices, get_invoice_statistics, get_invoice_line_items, get_invoice_header, get_customers
```

### **Step 2: Start the Backend Proxy Server**

```bash
# Navigate to backend directory
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi\backend"

# Start the proxy server
npm start
```

**Expected Output:**
```
🚀 MCP Backend Proxy running on port 3000
📍 Health check: http://localhost:3000/health
🤖 Claude API proxy: http://localhost:3000/api/claude/messages
```

### **Step 3: Start the Angular Frontend**

```bash
# Navigate to frontend directory
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi\frontend"

# Start the Angular app
ng serve
```

**Expected Output:**
```
✔ Browser application bundle generation complete.
Local: http://localhost:4200/
```

## 🔧 **MCP Server URLs and Configuration**

### **Current Configuration:**

1. **MCP Server**: Uses stdio transport (not HTTP) - communicates via process pipes
2. **Backend Proxy**: `http://localhost:3000` - Handles Claude API calls
3. **IBM i API**: `http://pub400.com:3012/` - Your IBM i data source
4. **Frontend**: `http://localhost:4200` - Angular application

### **Environment Configuration:**

**Root `.env` file:**
```env
NODEJS_API_BASE_URL=http://pub400.com:3012/
DEBUG=false
API_TIMEOUT=5000
LOG_LEVEL=info
```

**Backend `.env` file:**
```env
PORT=3000
MCP_SERVER_URL=http://localhost:8080
```

**Frontend `environment.ts`:**
```typescript
export const environment = {
  production: false,
  mcpServerUrl: 'http://localhost:3000/api/mcp',
  claudeApiUrl: 'https://api.anthropic.com/v1/messages',
  appName: 'IBM i Building Supply Chatbot'
};
```

## 🧪 **Testing Your Setup**

### **1. Test Backend Proxy:**
```bash
curl http://localhost:3000/health
```

### **2. Test MCP Server:**
```bash
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi"
npm run test
```

### **3. Test IBM i API:**
```bash
curl http://pub400.com:3012/api/health
```

## 🔍 **Troubleshooting**

### **If MCP Server Won't Start:**
1. Check if port 8080 is available
2. Verify Node.js version (requires Node 16+)
3. Check IBM i API connectivity: `curl http://pub400.com:3012/`

### **If Backend Proxy Won't Start:**
1. Check if port 3000 is available
2. Verify all npm dependencies are installed
3. Check firewall settings

### **If Frontend Can't Connect:**
1. Verify both backend servers are running
2. Check browser console for CORS errors
3. Verify API key is properly entered

## 🎯 **How the MCP Integration Works**

1. **User types message** in Angular chat
2. **Frontend sends to Backend Proxy** at `http://localhost:3000/api/claude/messages`
3. **Backend Proxy forwards to Claude API** with your API key
4. **Claude decides if it needs data** and requests MCP tools
5. **MCP Server fetches data** from IBM i API at `http://pub400.com:3012/`
6. **Data flows back** through the chain to the user

## 📝 **Next Steps**

1. Start all three servers in the order shown above
2. Open `http://localhost:4200` in your browser
3. Enter your Claude API key when prompted
4. Test with queries like: "Show me invoice 12345" or "Search for customer ABC Corp"

The MCP server URL is not a traditional HTTP URL since it uses stdio transport, but the integration works through the backend proxy system we've set up.