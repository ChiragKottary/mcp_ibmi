# IBM i Invoice & Order MCP Server

A Model Context Protocol (MCP) server for connecting to IBM i DB2 invoice and order data through external APIs. This server provides AI-powered natural language queries for invoice and order information using external cloud services.

## 🏗️ Architecture

```
[AI Client (Claude/VS Code)] 
       ⬇️ MCP Protocol
 [MCP Server (Node.js/TypeScript)]
       ⬇️ HTTPS APIs
   [External Cloud Services]
       ├── Invoice Cloud API (invoice.cloud.test.egapps.no)
       └── Order Service API (apps-order-service.cloud.test.egapps.no)
```

## 🚀 Features

### Available Tools
- **get_order_details** - Get detailed information about specific orders from external order service
- **get_customer_invoices** - Get invoices for a specific customer from invoice cloud service  
- **get_customer_project_invoices** - Get invoices filtered by customer and project number

### Key Features
- ✅ TypeScript with full type safety
- ✅ Comprehensive error handling  
- ✅ External API integration (Invoice Cloud & Order Service)
- ✅ Modular service architecture
- ✅ Environment configuration
- ✅ Axios HTTP client with interceptors
- ✅ Zod schema validation
- ✅ MCP protocol compliance
- ✅ Project-specific invoice filtering
- ✅ Pagination support

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to external cloud APIs:
  - Invoice Cloud Service (invoice.cloud.test.egapps.no)
  - Order Service API (apps-order-service.cloud.test.egapps.no)
- Valid API tokens for external services
- MCP-compatible client (Claude Desktop, VS Code MCP extension)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp_ibmi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment template
   cp env.sample .env
   
   # Edit .env file with your API tokens:
   # INVOICE_SERVICE_TOKEN=your_invoice_api_token
   # ORDER_SERVICE_TOKEN=your_order_api_token
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
    "ibmi-mcp": {
      "command": "node",
      "args": ["path/to/your/mcp_ibmi/build/index.js"],
      "env": {
        "INVOICE_SERVICE_TOKEN": "your_invoice_api_token",
        "ORDER_SERVICE_TOKEN": "your_order_api_token"
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
| `INVOICE_SERVICE_TOKEN` | API token for invoice cloud service | Required |
| `ORDER_SERVICE_TOKEN` | API token for order service | Required |
| `API_TIMEOUT` | API request timeout in milliseconds | `30000` |
| `SERVER_NAME` | MCP server name | `BuildMate Invoice & Order MCP Server` |
| `SERVER_VERSION` | MCP server version | `1.0.0` |

### API Endpoints

The server connects to the following external API endpoints:

#### Invoice Cloud Service
- **Base URL**: `https://invoice.cloud.test.egapps.no`
- `GET /api/v2/companies/{companyId}/customers/{customerNo}/invoices` - Get customer invoices
- `GET /api/companies/{companyId}/customers/{customerNo}/projects/{projectNo}/invoices` - Get project-specific invoices

#### Order Service API  
- **Base URL**: `https://apps-order-service.cloud.test.egapps.no`
- `GET /api/orders/externalsystem/{externalSystem}/order/{orderNumber}` - Get order details

## 📊 Sample Queries

When your MCP server is running, you can ask:

### Order Queries
- "Get details for order 534955"
- "Show me order information for order number 90929"
- "What are the line items for order 534955-0?"
- "Get order details including FOHEPF table mapping"

### Invoice Queries  
- "Show me all invoices for customer 310001"
- "Get invoices for customer 310001 with pagination"
- "What invoices exist for customer 310001 project 75932?"
- "Show project-specific invoices for customer 310001 and project 75933"
- "Get the outstanding balance for customer 310001"

### Combined Analysis
- "Compare invoice totals against order values for customer 310001"
- "Show project breakdown for customer 310001 invoices"
- "Get all financial data for customer 310001"

## 🏗️ Project Structure

```
src/
├── index.ts                 # Main MCP server entry point
├── config.ts               # Configuration management  
├── services/
│   ├── apiService.ts       # External API client service
│   └── toolsService.ts     # MCP tools implementation
└── utils/
    └── formatters.ts       # Utility functions for formatting
build/                      # Compiled JavaScript output (gitignored)
tests/                      # Test files
├── run-all-tests.js       # Test runner
└── test_*.js              # Individual test files
db_schema/                 # Database schema documentation
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

1. **Start the MCP server**: `npm run dev`
2. **Test with MCP Inspector**: `npm run server:inspect` 
3. **Connect with an MCP client** (Claude Desktop, VS Code)
4. **Test the available tools**:
   - Try getting order details: "Get details for order 534955"
   - Try customer invoices: "Show invoices for customer 310001"
   - Try project invoices: "Get invoices for customer 310001 project 75932"

5. **Run test suite**: `node tests/run-all-tests.js`

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the `INVOICE_SERVICE_TOKEN` and `ORDER_SERVICE_TOKEN` are correct
   - Ensure the external API services are accessible
   - Check network connectivity and firewall settings

2. **Authentication Errors**
   - Verify API tokens are valid and not expired
   - Check token format and permissions
   - Ensure tokens have access to the required endpoints

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration in `tsconfig.json`
   - Ensure Node.js version is 18+

4. **MCP Client Connection Issues**
   - Verify the server is running: `npm run dev`
   - Check MCP client configuration paths
   - Review server logs for errors

### Debug Mode

Run with the MCP inspector for debugging:

```bash
npm run server:inspect
```

This opens a web interface to test and debug your MCP server.

## 📝 API Data Models

### Order Details
```typescript
interface OrderDetails {
  orderNo: number;
  orderFlowIndicator: string;
  customer: {
    customerNo: string;
    name: string;
  };
  orderDate?: string;
  deliveryDate?: string;
  totalDiscountedPriceExVat?: number;
  totalDiscountedPriceIncVat?: number;
  orderLines?: OrderLine[];
  // Maps to FOHEPF table structure for IBM i integration
}
```

### Invoice Summary
```typescript
interface InvoiceSummary {
  id: string;
  invoiceNo: string;
  customerNo: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  amountExVAT: number;
  amountIncVAT: number;
  customerProject?: {
    projectNo: string;
    projectName: string;
  };
  kid?: string;
  paymentMode?: string;
}
```

### Customer Invoice Response
```typescript
interface CustomerInvoicesResponse {
  offset: number;
  limit: number;
  invoiceSummaries: InvoiceSummary[];
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
- Repository Issues: [GitHub Issues](https://github.com/ChiragKottary/mcp_ibmi/issues)
- Documentation: [Model Context Protocol](https://modelcontextprotocol.io/)
- IBM i Integration: See `db_schema/` folder for database documentation

## 🔗 Related Documentation
- `PROJECT_INVOICES_ENDPOINT.md` - Details about the new project-specific invoice endpoint
- `SETUP.md` - Additional setup instructions
- `db_schema/` - IBM i database schema documentation
- `CLEANUP_SUMMARY.md` - Repository cleanup and structure information

---

**IBM i Invoice & Order MCP Server** - Connecting AI clients to IBM i business data through modern APIs.
