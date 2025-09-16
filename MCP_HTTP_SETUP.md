# 🚀 Complete MCP HTTP Server Setup Guide

## 🎯 **Problem Solved: HTTP URL for MCP Server**

I've created an **HTTP wrapper** around your MCP server that provides REST API endpoints. Now your Angular frontend can directly communicate with the MCP server via HTTP!

## 📊 **New Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular App   │───▶│  Backend Proxy  │───▶│   Claude API    │
│  (Port 4200)    │    │   (Port 3000)   │    │  (Anthropic)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ MCP HTTP Server │───▶│   MCP Server    │───▶│   IBM i API     │
│   (Port 8080)   │    │ (stdio process) │    │ (pub400.com)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Step-by-Step Startup (3 Servers)**

### **Terminal 1: Start MCP HTTP Server**
```bash
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi"
npm run http-server
```

**Expected Output:**
```
🚀 Starting MCP Server process...
📝 MCP Server: Starting BuildMate Invoice & Order MCP Server v1.0.0...
📝 MCP Server: API Base URL: http://pub400.com:3011/
📝 MCP Server: MCP Server connected and ready!
🌐 MCP HTTP Server running on port 8080
📍 Health check: http://localhost:8080/health
🔧 Tools list: http://localhost:8080/tools
📞 Call tool: POST http://localhost:8080/call-tool
🎯 Ready to accept requests!
```

### **Terminal 2: Start Backend Proxy**
```bash
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi\backend"
npm start
```

**Expected Output:**
```
🚀 MCP Backend Proxy running on port 3000
📍 Health check: http://localhost:3000/health
🤖 Claude API proxy: http://localhost:3000/api/claude/messages
```

### **Terminal 3: Start Angular Frontend**
```bash
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi\frontend"
ng serve
```

**Expected Output:**
```
✔ Browser application bundle generation complete.
Local: http://localhost:4200/
```

## 🔧 **Available HTTP Endpoints**

### **MCP Server HTTP API (Port 8080):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/tools` | List available MCP tools |
| POST | `/call-tool` | Execute any MCP tool |
| POST | `/tools/search_invoices` | Search invoices directly |
| POST | `/tools/get_invoice_details` | Get invoice details |
| POST | `/tools/get_invoice_line_items` | Get line items |

### **Example API Calls:**

**1. Health Check:**
```bash
curl http://localhost:8080/health
```

**2. List Tools:**
```bash
curl http://localhost:8080/tools
```

**3. Search Invoices:**
```bash
curl -X POST http://localhost:8080/tools/search_invoices \
  -H "Content-Type: application/json" \
  -d '{"customer": "ABC Corp"}'
```

**4. Get Invoice Details:**
```bash
curl -X POST http://localhost:8080/tools/get_invoice_details \
  -H "Content-Type: application/json" \
  -d '{"invoiceNumber": "12345"}'
```

## 🎯 **Testing Your Setup**

### **1. Test MCP HTTP Server:**
```bash
# Health check
curl http://localhost:8080/health

# List available tools
curl http://localhost:8080/tools

# Test invoice search
curl -X POST http://localhost:8080/tools/search_invoices \
  -H "Content-Type: application/json" \
  -d '{}'
```

### **2. Test Full Integration:**
1. Open browser to `http://localhost:4200`
2. Enter your Claude API key
3. Ask: "Show me all invoices"
4. Ask: "Search for customer ABC Corp"
5. Ask: "Get details for invoice 12345"

## 🔍 **Troubleshooting**

### **MCP HTTP Server Issues:**
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Force kill if needed
taskkill /F /PID <PID_NUMBER>
```

### **Connection Issues:**
1. Verify all 3 servers are running
2. Check each health endpoint:
   - http://localhost:8080/health (MCP HTTP)
   - http://localhost:3000/health (Backend Proxy)
   - http://localhost:4200 (Angular App)

### **API Issues:**
1. Check IBM i API: `curl http://pub400.com:3011/api/health`
2. Check MCP tools: `curl http://localhost:8080/tools`
3. Check browser console for errors

## 📝 **Development Scripts**

```bash
# Start MCP HTTP server in development mode (auto-restart)
npm run http-server:dev

# Start MCP stdio server (original)
npm run dev

# Build TypeScript
npm run build

# Run tests
npm run test
```

## 🎉 **Success! You Now Have:**

✅ **HTTP URL for MCP Server**: `http://localhost:8080`  
✅ **REST API endpoints** for all MCP tools  
✅ **Direct frontend integration** with MCP server  
✅ **Real-time communication** with IBM i data  
✅ **Professional error handling** and logging  

Your Angular frontend can now directly call the MCP server at `http://localhost:8080` and get IBM i data through proper HTTP endpoints!

## 🚀 **Quick Start Command:**

Open 3 terminals and run:
```bash
# Terminal 1
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi" && npm run http-server

# Terminal 2  
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi\backend" && npm start

# Terminal 3
cd "c:\Users\chkot\Desktop\COMPILER_TOOL_PGM\mcp repo\mcp_ibmi\frontend" && ng serve
```

Then open: http://localhost:4200