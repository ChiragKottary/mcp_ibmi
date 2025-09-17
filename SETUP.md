# BuildMate MCP Server Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the sample environment file
copy env.sample .env

# Edit .env file to set your API URL
# NODEJS_API_BASE_URL=http://pub400.com:3012/api
```

### 3. Build the Project
```bash
npm run build
```

### 4. Start the MCP Server
```bash
# Development mode
npm run dev

# Production mode
npm start

# With MCP inspector (for debugging)
npm run server:inspect
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
NODEJS_API_BASE_URL=http://pub400.com:3012/api

# Optional Configuration
API_TIMEOUT=5000
LOG_LEVEL=info
```

### MCP Client Configuration

#### Claude Desktop
Add to your `claude_desktop_config.json`:

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

#### VS Code MCP Extension
The `.vscode/mcp.json` file is already configured for VS Code.

## 📊 Available Tools

### Invoice Tools
- **search_invoices** - Search invoices by criteria
- **get_invoice_details** - Get specific invoice details
- **get_invoices_summary** - Get invoice statistics

### Order Tools
- **search_orders** - Search orders by criteria
- **get_order_details** - Get specific order details
- **get_orders_summary** - Get order statistics

## 🧪 Testing

### Test with MCP Inspector
```bash
npm run server:inspect
```
This opens a web interface at `http://localhost:3000` to test your MCP server.

### Sample Queries
Once connected to an MCP client, try these queries:

- "Show me all pending invoices"
- "Get details for invoice INV-2024-001"
- "What's the total amount of overdue invoices?"
- "Show me orders from customer ABC Corporation"
- "What orders are currently being processed?"
- "Give me a summary of all invoices and orders"

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure TypeScript is installed: `npm install -g typescript`
   - Check that `tsconfig.json` exists
   - Run `npm install` to ensure all dependencies are installed

2. **API Connection Errors**
   - Verify the `NODEJS_API_BASE_URL` is correct
   - Ensure the API server is running
   - Check network connectivity

3. **MCP Client Connection Issues**
   - Verify the server is running: `npm run dev`
   - Check MCP client configuration
   - Review server logs for errors

### Debug Mode
Run with the MCP inspector for debugging:
```bash
npm run server:inspect
```

## 📁 Project Structure

```
mcp_yt/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── config.ts             # Configuration
│   └── services/
│       ├── apiService.ts     # API client
│       └── toolsService.ts   # Tool implementations
├── build/                    # Compiled JavaScript
├── .vscode/
│   └── mcp.json             # VS Code MCP config
├── package.json
├── tsconfig.json
├── README.md
└── SETUP.md
```

## 🔄 Development Workflow

1. **Make Changes** - Edit TypeScript files in `src/`
2. **Build** - Run `npm run build`
3. **Test** - Use `npm run server:inspect` or connect MCP client
4. **Debug** - Check console logs and MCP inspector

## 📝 Next Steps

1. **Connect to Real API** - Update `NODEJS_API_BASE_URL` to point to your actual API
2. **Add More Tools** - Extend the tools service with additional functionality
3. **Enhance Error Handling** - Add more sophisticated error handling
4. **Add Logging** - Implement structured logging
5. **Add Tests** - Create unit and integration tests

## 🆘 Support

For issues and questions:
- Check the console logs
- Use the MCP inspector for debugging
- Review the README.md for detailed documentation
- Contact support@buildmate.com

---

**BuildMate Building Supplies** - Your trusted partner for quality building materials and supplies.
