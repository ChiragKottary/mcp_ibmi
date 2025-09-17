# MCP Server Testing Suite

This folder contains comprehensive tests for the IBM i/DB2 MCP server endpoints.

## Test Files

### 📊 **API Endpoint Tests**
- **`test_endpoints.js`** - Direct API endpoint testing for all 8 endpoints
- **`test_line_items.js`** - Specific testing for the corrected line items endpoint

### 🔧 **MCP Tool Tests**
- **`test_mcp_tools.js`** - Parameter type validation and MCP tool functionality
- **`final_test_line_items.js`** - Comprehensive validation of line items with field mapping

## Running Tests

### Run All API Endpoint Tests
```bash
node tests/test_endpoints.js
```

### Test MCP Tool Parameter Types
```bash
node tests/test_mcp_tools.js
```

### Test Line Items Functionality
```bash
node tests/test_line_items.js
```

### Final Comprehensive Line Items Test
```bash
node tests/final_test_line_items.js
```

## Test Results Summary

### ✅ Working Endpoints (8/8 - 100%)
1. **search_invoices** - Status: 200, Returns IBM field data
2. **get_invoice_details** - Status: 200, Structured response with header/details/summary
3. **get_all_invoices** - Status: 200, Paginated invoice list
4. **get_customers** - Status: 200, Customer records with IBM fields
5. **get_invoice_statistics** - Status: 200, Overview/monthly/top customers
6. **get_customer_invoices** - Status: 200, Customer-specific invoices
7. **get_invoice_line_items** - Status: 200, **Fixed endpoint with correct field mapping**
8. **get_invoice_header** - Status: 200, Invoice header with IBM fields

### 🔧 Parameter Type Validation
- All number parameters working correctly
- Zod schema validation enforced
- Type consistency across all endpoints

### 🎯 IBM i Field Mapping
- SONUMM, SOKUNA, SOSALP (Invoice headers)
- SDLINE, SDTEK1, SDVARE, SDANTA (Line items)
- SOLKUN, SOKUNA, SOSTED (Customers)
- Currency formatting with safeToFixed()

## Test Environment
- **IBM i API**: http://pub400.com:3012/
- **Real Data**: Live IBM i/DB2 system integration
- **Performance**: Response times 300ms-1700ms
- **Error Handling**: Graceful fallbacks and user-friendly messages
