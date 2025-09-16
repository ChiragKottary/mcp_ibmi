# BuildMate MCP Server API Endpoints

## 🎯 Overview

Your MCP server is now complete with 6 powerful tools for querying invoice and order data. The server connects to your Node.js API backend and provides natural language access to BuildMate's business data.

## 🛠️ Available Tools

### 1. Invoice Management

#### `search_invoices`
**Description:** Search for invoices based on various criteria
**Parameters:**
- `customerId` (optional): Filter by customer ID
- `status` (optional): Filter by status (paid, pending, overdue, draft)
- `minAmount` (optional): Minimum invoice amount
- `maxAmount` (optional): Maximum invoice amount
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Example Usage:**
- "Show me all pending invoices"
- "Find invoices for customer CUST-001"
- "Show invoices between $1000 and $5000"

#### `get_invoice_details`
**Description:** Get detailed information about a specific invoice
**Parameters:**
- `invoiceId` (required): The invoice ID to retrieve

**Example Usage:**
- "Get details for invoice INV-2024-001"
- "Show me invoice INV-2024-002"

#### `get_invoices_summary`
**Description:** Get summary statistics for all invoices
**Parameters:** None

**Example Usage:**
- "What's the total amount of all invoices?"
- "Give me a summary of invoice statistics"

### 2. Order Management

#### `search_orders`
**Description:** Search for orders based on various criteria
**Parameters:**
- `customerId` (optional): Filter by customer ID
- `status` (optional): Filter by status (delivered, shipped, processing, pending)
- `minAmount` (optional): Minimum order amount
- `maxAmount` (optional): Maximum order amount
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Example Usage:**
- "Show me orders from customer ABC Corporation"
- "What orders are currently being processed?"
- "Find orders placed last month"

#### `get_order_details`
**Description:** Get detailed information about a specific order
**Parameters:**
- `orderId` (required): The order ID to retrieve

**Example Usage:**
- "Get details for order ORD-2024-001"
- "Show me order ORD-2024-002"

#### `get_orders_summary`
**Description:** Get summary statistics for all orders
**Parameters:** None

**Example Usage:**
- "What's the total amount of all orders?"
- "Give me a summary of order statistics"

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
Ensure your Node.js API server is running on `http://pub400.com:3011/api`

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
NODEJS_API_BASE_URL=http://pub400.com:3011/api
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
