# Order Service Module Documentation

## Overview
The Order Service module provides integration with an external order management API, allowing the MCP server to fetch detailed order information and map it to the FOHEPF table structure context.

## API Endpoint
- **External URL**: `https://apps-order-service.cloud.test.egapps.no/api/orders/{orderId}`
- **Method**: GET
- **Parameters**:
  - `for-update`: boolean (default: false) - Whether to lock the order for update
  - `lock-source`: string (default: 'NGN') - Source of the lock

## MCP Tool: get_order_details

### Description
Retrieves detailed information about a specific order from the external order service API and provides context mapping to the FOHEPF table structure.

### Input Schema
```json
{
  "orderId": {
    "type": ["number", "string"],
    "description": "The order ID to retrieve details for (e.g., 7319)",
    "required": true
  },
  "forUpdate": {
    "type": "boolean",
    "description": "Whether to lock the order for update (default: false)"
  },
  "lockSource": {
    "type": "string",
    "description": "Source of the lock (default: 'NGN')"
  }
}
```

### Example Usage

#### Via MCP HTTP Server
```bash
POST http://localhost:8080/tools/get_order_details
Content-Type: application/json

{
  "orderId": 7319,
  "forUpdate": false,
  "lockSource": "NGN"
}
```

#### Via Generic Call Tool
```bash
POST http://localhost:8080/call-tool
Content-Type: application/json

{
  "name": "get_order_details",
  "arguments": {
    "orderId": 7319,
    "forUpdate": false,
    "lockSource": "NGN"
  }
}
```

## Response Structure

The tool returns a formatted response that includes:

1. **Order Summary**
   - Order number and status
   - Customer information
   - Order and delivery dates
   - Warehouse and department information

2. **Financial Summary**
   - Purchase prices and costs
   - Order discounts
   - Total amounts (excluding and including VAT)

3. **Contact Information**
   - Sales person details
   - Customer contact information
   - References

4. **Delivery Information**
   - Delivery type and method
   - Delivery address details

5. **Order Lines**
   - Line item details (up to 10 shown)
   - Quantities, prices, and totals
   - Status and delivery information

6. **FOHEPF Table Mapping**
   - Direct field mappings to the Norwegian FOHEPF table structure
   - Includes field names and descriptions

7. **Lock Information**
   - Lock key and details
   - User and source information

## FOHEPF Field Mappings

The response includes explicit mappings to key FOHEPF table fields:

| FOHEPF Field | Field Name | External API Field | Description |
|--------------|------------|-------------------|-------------|
| FONUMM | Order Number | orderNo | Order Number |
| FOFIRM | Company/Parent | parentOrderNo | Parent Order Number |
| FOBDAT | Order Date | orderDate | Order Date |
| FOLDAT | Delivery Date | deliveryDate | Delivery Date |
| FOKUND | Customer Number | customer.customerNo | Customer Number |
| FOKUNA | Customer Name | customer.name | Customer Name |
| FOLAGE | Warehouse | warehouseNo | Warehouse Number |
| FOAVDE | Department | departmentNo | Department Number |
| FOVALK | Currency | currencyCode | Currency Code |
| FOSELG | Sales Rep | salesperson.code | Sales Representative |
| FOLMAT | Delivery Method | deliveryType.code | Delivery Method |
| FOVREF | Our Reference | ourReference | Our Reference |
| FODREF | Customer Reference | customerReference | Customer Reference |
| FORABP | Order Discount % | orderDiscountPercent | Order Discount Percentage |
| FOTOTS | Total Sales | totalDiscountedPriceExVat | Total Sales Amount |

## Error Handling

The tool provides comprehensive error handling for:
- Invalid order IDs
- Network connectivity issues
- API service unavailability
- Authentication/authorization errors
- Timeout scenarios

Error responses include:
- Clear error messages
- Suggested troubleshooting steps
- Proper HTTP status codes

## Testing

Test the order service module using:

```bash
npm test test_order_service.js
```

Or run all tests including the order service:

```bash
npm run test:all
```

The test suite includes:
1. Health check verification
2. Direct API connectivity test
3. MCP tool functionality test
4. Error handling validation
5. Parameter validation testing

## Integration Notes

1. **External Dependency**: This module depends on the external order service API being available
2. **Rate Limiting**: Be aware of potential rate limits on the external API
3. **Authentication**: Currently no authentication is required, but this may change
4. **Data Mapping**: The FOHEPF mappings are based on the Norwegian order management system structure
5. **Caching**: Consider implementing caching for frequently accessed orders

## Future Enhancements

Potential improvements for the order service module:
1. Add support for searching orders by criteria
2. Implement order creation and updates
3. Add batch order processing capabilities
4. Implement caching mechanisms
5. Add authentication support when required
6. Add support for order status updates
7. Implement webhook notifications for order changes