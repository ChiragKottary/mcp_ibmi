# BuildMate Invoice & Order MCP Server

A Model Context Protocol (MCP) server for connecting Angular frontend to DB2 invoice and order data through Node.js APIs. This server provides AI-powered natural language queries for invoice and order information.

## 🏗️ Architecture

```
[Angular Chat UI] 
       ⬇️ 
 [Node.js AI Service + MCP Server]
       ⬇️
   [DB2 APIs / Knowledge Base]
```

## 🚀 Features

### Available Tools
- **search_invoices** - Search invoices by customer, status, amount, and date range
- **get_invoice_details** - Get detailed information about a specific invoice
- **get_invoices_summary** - Get summary statistics for all invoices
- **search_orders** - Search orders by customer, status, amount, and date range
- **get_order_details** - Get detailed information about a specific order
- **get_orders_summary** - Get summary statistics for all orders

### Key Features
- ✅ TypeScript with full type safety
- ✅ Comprehensive error handling
- ✅ Professional BuildMate branding
- ✅ Modular service architecture
- ✅ Environment configuration
- ✅ Axios HTTP client with interceptors
- ✅ Zod schema validation
- ✅ MCP protocol compliance

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to BuildMate's Node.js API server
- MCP-compatible client (Claude Desktop, VS Code MCP extension)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp_yt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   echo "NODEJS_API_BASE_URL=http://pub400.com:3011/api" > .env
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Start the MCP Server

```bash
# Development mode
npm run dev

# Production mode
npm start

# With inspector (for debugging)
npm run server:inspect
```

### Connect to MCP Client

#### Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "buildmate-mcp": {
      "command": "node",
      "args": ["path/to/your/mcp_yt/build/index.js"],
      "env": {
        "NODEJS_API_BASE_URL": "http://pub400.com:3011/api"
      }
    }
  }
}
```

#### VS Code MCP Extension
Configure the MCP server in your VS Code settings to connect to the built server.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODEJS_API_BASE_URL` | Base URL for the Node.js API server | `http://pub400.com:3011/api` |
| `API_TIMEOUT` | API request timeout in milliseconds | `5000` |
| `LOG_LEVEL` | Logging level | `info` |

### API Endpoints

The server expects the following API endpoints to be available:

#### Invoice Endpoints
- `GET /api/invoices` - Search invoices with query parameters
- `GET /api/invoices/:id` - Get specific invoice details
- `GET /api/invoices/summary` - Get invoice summary statistics

#### Order Endpoints
- `GET /api/orders` - Search orders with query parameters
- `GET /api/orders/:id` - Get specific order details
- `GET /api/orders/summary` - Get order summary statistics

#### Health Check
- `GET /api/health` - API health check endpoint

## 📊 Sample Queries

When your MCP server is running, you can ask:

### Invoice Queries
- "Show me all pending invoices"
- "Get details for invoice INV-2024-001"
- "What's the total amount of overdue invoices?"
- "Find invoices for customer CUST-001"
- "Show invoices between $1000 and $5000"

### Order Queries
- "Show me orders from customer ABC Corporation"
- "What orders are currently being processed?"
- "Get details for order ORD-2024-001"
- "Show me all shipped orders"
- "Find orders placed last month"

### Summary Queries
- "Give me a summary of all invoices and orders"
- "What's our total revenue from invoices?"
- "How many orders are pending delivery?"

## 🏗️ Project Structure

```
src/
├── index.ts                 # Main MCP server entry point
├── config.ts               # Configuration management
└── services/
    ├── apiService.ts       # API client service
    └── toolsService.ts     # MCP tools implementation
```

## 🔍 Development

### Available Scripts

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Run in production mode
npm start

# Watch mode for development
npm run watch

# Run with MCP inspector
npm run server:inspect
```

### Building

The project uses TypeScript and compiles to the `build/` directory:

```bash
npm run build
```

### Testing

To test the MCP server:

1. Start your Node.js API server
2. Run the MCP server: `npm run dev`
3. Connect with an MCP client
4. Test the available tools

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the `NODEJS_API_BASE_URL` is correct
   - Ensure the API server is running
   - Check network connectivity

2. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration in `tconfig.json`

3. **MCP Client Connection Issues**
   - Verify the server is running: `npm run dev`
   - Check MCP client configuration
   - Review server logs for errors

### Debug Mode

Run with the MCP inspector for debugging:

```bash
npm run server:inspect
```

This opens a web interface to test and debug your MCP server.

## 📝 API Data Models

### Invoice
```typescript
interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string;
  createdDate: string;
  description?: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'delivered' | 'shipped' | 'processing' | 'pending';
  orderDate: string;
  expectedDeliveryDate?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Email: support@buildmate.com
- Phone: 1-800-BUILDMATE
- Documentation: [Model Context Protocol](https://modelcontextprotocol.io/)

---

**BuildMate Building Supplies** - Your trusted partner for quality building materials and supplies.
