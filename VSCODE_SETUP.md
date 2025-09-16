# VS Code Setup for MCP Server with GitHub Copilot & Gemini

## 🎯 Overview

While there isn't a direct MCP extension for VS Code yet, you can still use your MCP server with VS Code in several ways. This guide shows you how to set up VS Code with GitHub Copilot, Gemini, and your MCP server.

## 🚀 Method 1: Using MCP Inspector (Recommended)

The MCP Inspector is the best way to test and interact with your MCP server.

### Step 1: Install MCP Inspector
```bash
npm install -g @modelcontextprotocol/inspector
```

### Step 2: Start Your Servers
```powershell
# Terminal 1: Start Dummy API
cd C:\Users\ruraj\Downloads\mcp_yt\dummy-api
node server.js

# Terminal 2: Start MCP Server
cd C:\Users\ruraj\Downloads\mcp_yt
npm run dev
```

### Step 3: Launch MCP Inspector
```powershell
# Terminal 3: Start MCP Inspector
cd C:\Users\ruraj\Downloads\mcp_yt
npx @modelcontextprotocol/inspector
```

This will open a web interface where you can:
- Test all your MCP tools
- See real-time API calls
- Debug your server
- View JSON responses

## 🤖 Method 2: VS Code with GitHub Copilot & Gemini

### Step 1: Install Extensions

1. **GitHub Copilot:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "GitHub Copilot"
   - Install the official extension
   - Sign in with your GitHub account

2. **Gemini Code Assist:**
   - In Extensions, search for "Gemini Code Assist"
   - Install the extension
   - Get API key from Google AI Studio
   - Set API key: Ctrl+Shift+P → "Gemini: Set API Key"

### Step 2: Configure VS Code

Your `.vscode/settings.json` is already configured with:
```json
{
  "mcp.servers": {
    "buildmate-mcp": {
      "command": "node",
      "args": ["C:\\Users\\ruraj\\Downloads\\mcp_yt\\build\\index.js"],
      "env": {
        "NODEJS_API_BASE_URL": "http://pub400.com:3011/"
      }
    }
  }
}
```

## 🔧 Method 3: Custom VS Code Extension (Advanced)

### Create a Simple MCP Client Extension

1. **Install Extension Generator:**
```bash
npm install -g yo generator-code
```

2. **Create Extension:**
```bash
mkdir mcp-vscode-extension
cd mcp-vscode-extension
yo code
```

3. **Add MCP Client Code:**
```typescript
// src/extension.ts
import * as vscode from 'vscode';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export function activate(context: vscode.ExtensionContext) {
    const mcpClient = new Client({
        name: "buildmate-mcp-client",
        version: "1.0.0"
    }, {
        capabilities: {}
    });

    // Connect to MCP server
    const transport = new StdioClientTransport({
        command: 'node',
        args: ['C:\\Users\\ruraj\\Downloads\\mcp_yt\\build\\index.js'],
        env: {
            NODEJS_API_BASE_URL: 'http://pub400.com:3011/'
        }
    });

    mcpClient.connect(transport);

    // Register commands
    const searchInvoices = vscode.commands.registerCommand('mcp.searchInvoices', async () => {
        // Call MCP tool
        const result = await mcpClient.callTool({
            name: 'search_invoices',
            arguments: {}
        });
        
        vscode.window.showInformationMessage(JSON.stringify(result));
    });

    context.subscriptions.push(searchInvoices);
}
```

## 🎯 Method 4: Using Terminal Integration

### Create VS Code Tasks

Add to `.vscode/tasks.json`:
```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Dummy API",
            "type": "shell",
            "command": "node",
            "args": ["server.js"],
            "options": {
                "cwd": "${workspaceFolder}/dummy-api"
            },
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            }
        },
        {
            "label": "Start MCP Server",
            "type": "shell",
            "command": "npm",
            "args": ["run", "dev"],
            "options": {
                "cwd": "${workspaceFolder}"
            },
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            }
        },
        {
            "label": "Test API",
            "type": "shell",
            "command": "curl.exe",
            "args": ["http://pub400.com:3011/health"],
            "group": "test"
        }
    ]
}
```

## 🧪 Testing Your Setup

### Test 1: MCP Inspector
1. Start both servers
2. Run `npx @modelcontextprotocol/inspector`
3. Open the web interface
4. Test tools like "search_invoices"

### Test 2: API Direct Testing
```powershell
# Test health
curl.exe http://pub400.com:3011/health

# Test invoices
curl.exe http://pub400.com:3011/api/invoices

# Test orders
curl.exe http://pub400.com:3011/api/orders
```

### Test 3: VS Code Integration
1. Open VS Code in your project folder
2. Use Ctrl+Shift+P to open command palette
3. Run tasks: "Start Dummy API", "Start MCP Server"
4. Use GitHub Copilot for code suggestions
5. Use Gemini for AI assistance

## 📊 Available MCP Tools

Your MCP server provides these tools:
- `search_invoices` - Search invoices with filters
- `get_invoice_details` - Get specific invoice details
- `get_invoices_summary` - Get invoice statistics
- `search_orders` - Search orders with filters
- `get_order_details` - Get specific order details
- `get_orders_summary` - Get order statistics

## 🎨 Sample Queries

### For MCP Inspector:
- "Show me all pending invoices"
- "What's the total amount of all orders?"
- "Get details for invoice INV-2024-001"
- "Find orders for customer ABC Corporation"

### For GitHub Copilot:
- Write comments like "// Search for invoices with status pending"
- Copilot will suggest code to call your API

### For Gemini:
- Ask "How do I call the MCP server API?"
- Request code examples for your endpoints

## 🚀 Quick Start Commands

```powershell
# Start everything
cd C:\Users\ruraj\Downloads\mcp_yt
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ruraj\Downloads\mcp_yt\dummy-api'; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ruraj\Downloads\mcp_yt'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ruraj\Downloads\mcp_yt'; npx @modelcontextprotocol/inspector"
```

## 🎯 Next Steps

1. **Start with MCP Inspector** - Best way to test your server
2. **Add GitHub Copilot** - For AI-powered code completion
3. **Add Gemini** - For additional AI assistance
4. **Create custom extension** - For full VS Code integration

Your MCP server is ready to use with any of these methods! 🚀
