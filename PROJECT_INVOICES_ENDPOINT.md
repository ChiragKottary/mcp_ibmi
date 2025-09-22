# New MCP Tool: get_customer_project_invoices

## Overview
I've successfully added a new MCP tool called `get_customer_project_invoices` to your MCP server. This tool allows you to retrieve invoices for a specific customer filtered by project number.

## Tool Details

### Endpoint
- **URL**: `https://invoice.cloud.test.egapps.no/api/companies/{companyId}/customers/{customerNo}/projects/{projectNo}/invoices`
- **Method**: GET
- **Based on your curl example**: The exact URL format you provided

### Parameters
- `customerNo` (required): Customer number (e.g., "310001")
- `projectNo` (required): Project number to filter invoices by (e.g., "75932")
- `companyId` (optional): Company ID (default: 0)
- `offset` (optional): Pagination offset (default: 0)
- `limit` (optional): Maximum number of invoices to return (default: 10)

### Usage Examples

#### MCP Tool Call
```json
{
    "name": "get_customer_project_invoices",
    "arguments": {
        "customerNo": "310001",
        "projectNo": "75932",
        "companyId": 0,
        "limit": 10
    }
}
```

#### Original curl command equivalent
```bash
curl -X 'GET' \
  'https://invoice.cloud.test.egapps.no/api/companies/0/customers/310001/projects/75932/invoices?offset=0&limit=10' \
  -H 'accept: application/json;charset=UTF-8' \
  -H 'eg-apps-token: [your-token]'
```

## Files Modified

### 1. `src/services/apiService.ts`
- Added `getCustomerProjectInvoices()` method
- Implements the HTTP client call to the project-specific invoice endpoint

### 2. `src/services/toolsService.ts`
- Added `GetCustomerProjectInvoicesSchema` for input validation
- Added `getCustomerProjectInvoices()` tool implementation
- Formats response with project-specific information

### 3. `src/index.ts`
- Registered the new tool in the MCP server
- Added tool to the available tools list
- Added endpoint mapping for logging

## Response Format
The tool returns a formatted response showing:
- Customer and project information
- Invoice summaries with amounts, dates, and project details
- Pagination information
- API endpoint details

## Project Numbers Found in Data
From your existing invoice data for customer 310001, I noticed these project numbers:
- 75932 (VEDLIKEHOLD)
- 75933 (PRIVAT)
- Various invoices with no specific project (N/A)

## Usage in Claude/MCP
Once the server is running, you can use queries like:
- "Show me invoices for customer 310001 project 75932"
- "Get project-specific invoices for customer 310001 and project 75933"

## Build Status
✅ **Successfully built and compiled**
- TypeScript compilation completed without errors
- All new methods included in build output
- Ready for use

## Testing
The tool has been tested and is functional. If a project has no invoices, it will return an appropriate "no invoices found" message.

## Integration
The new tool is now available alongside your existing tools:
- `get_order_details`
- `get_customer_invoices` 
- `get_customer_project_invoices` ← **NEW**

Your MCP server now supports the exact endpoint format you requested!