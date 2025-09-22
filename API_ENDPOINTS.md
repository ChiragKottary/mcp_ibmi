# BuildMate MCP Server API Endpoints

## 🎯 Overview

Your MCP server provides powerful tools for querying invoice and order data. The server connects to external APIs and provides natural language access to BuildMate's business data.

## 🛠️ Available Tools

### 1. Order Management

#### `get_order_details`
**Description:** Get detailed information about a specific order from the external order service API using external system and order number. Maps response to FOHEPF table structure context.
**Parameters:**
- `orderNumber` (required): The order number to retrieve details for (e.g., '534955-0')
- `externalSystem` (optional): The external system name (default: 'NEXSTEP')
- `forUpdate` (optional): Whether to lock the order for update (default: false)
- `lockSource` (optional): Source of the lock (default: 'NGN')
- `includeDeleted` (optional): Whether to include deleted orders (default: true)

**API Endpoint:** `https://apps-order-service.cloud.test.egapps.no/api/orders/externalsystem/{externalSystem}/order/{orderNumber}`

**Example Usage:**
- "Get details for order 534955-0"
- "Show me order 534955-0 for update"
- "Get order 123456-1 from NEXSTEP system"

### 2. Invoice Management

#### `get_customer_invoices`
**Description:** Get invoices for a specific customer from the invoice cloud service API. Returns paginated invoice summaries including amounts, dates, and project information.
**Parameters:**
- `customerNo` (required): The customer number to retrieve invoices for (e.g., '310001')
- `companyId` (optional): The company ID (default: 0)
- `offset` (optional): Pagination offset (default: 0)
- `limit` (optional): Maximum number of invoices to return (default: 10)

**API Endpoint:** `https://invoice.cloud.test.egapps.no/api/v2/companies/{companyId}/customers/{customerNo}/invoices`

**Example Usage:**
- "Get invoices for customer 310001"
- "Show me invoices for customer 310001 with limit 5"
- "Get invoices for customer 310001 starting from offset 10"

## 🔌 API Integration

### Expected Backend Endpoints

Your MCP server expects these endpoints to be available:

```
GET /api/invoices              # Search invoices
GET /api/invoices/:id          # Get invoice details
GET /api/invoices/summary      # Get invoice summary
GET /api/orders                # Search orders
GET /api/orders/:id            # Get order details
GET /api/orders/summary        # Get order summary
GET /health                    # Health check
```

### Data Models

#### Invoice
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

#### Order
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

## 🚀 Getting Started

### 1. Start Your Backend API
Ensure your Node.js API server is running on `http://pub400.com:3012/api`

### 2. Start the MCP Server
```bash
npm run build
npm run dev
```

### 3. Connect MCP Client
Configure your MCP client (Claude Desktop, VS Code) to connect to the server.

### 4. Test the Tools
Try natural language queries like:
- "Show me all pending invoices"
- "What's our total revenue from orders?"
- "Find overdue invoices for customer ABC Corporation"

## 🎨 BuildMate Branding

The server includes professional BuildMate branding:
- Company name and description
- Professional error messages
- Friendly customer service tone
- Emojis for better user experience

## 🔧 Configuration

### Environment Variables
```env
NODEJS_API_BASE_URL=http://pub400.com:3012/api
API_TIMEOUT=5000
LOG_LEVEL=info
```

### MCP Client Configuration
See `.vscode/mcp.json` for VS Code configuration or add to Claude Desktop config.

## 📊 Sample Responses

### Invoice Search Response
```
Found 3 invoices matching your criteria:

📄 Invoice INV-2024-001 - ABC Corporation
   Amount: $2,500.00 | Status: pending
   Due Date: 2024-02-15 | Created: 2024-01-15

📄 Invoice INV-2024-002 - XYZ Industries
   Amount: $1,200.00 | Status: overdue
   Due Date: 2024-01-30 | Created: 2024-01-10

Is there anything else I can help you with today?
```

### Order Details Response
```
📦 Order Details for ORD-2024-001:

Customer: ABC Corporation (CUST-001)
Amount: $2,500.00
Status: ✅ delivered
Order Date: 2024-01-15
Expected Delivery: 2024-01-20

Items:
   • Steel Beams (PROD-001)
     Quantity: 10 @ $150.00 each
   • Concrete Mix (PROD-002)
     Quantity: 5 @ $200.00 each

Is there anything else I can help you with today?
```

## 🎯 Next Steps

1. **Test with Real Data** - Connect to your actual API
2. **Customize Responses** - Modify the response formatting
3. **Add More Tools** - Extend with additional functionality
4. **Enhance Error Handling** - Add more sophisticated error handling
5. **Add Logging** - Implement structured logging

## 🆘 Support

For technical support:
- Check console logs for errors
- Use `npm run server:inspect` for debugging
- Review the README.md for detailed documentation
- Contact support@buildmate.com

---

**Your MCP server is now ready to power BuildMate's AI chatbot! 🚀**
