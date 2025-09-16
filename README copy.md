# API Documentation

## Endpoints

### 1. Search invoices with filtering
**Endpoint:** `GET /api/direct-invoices`

**Description:** Retrieve invoices with multiple filtering options.

**Request Parameters:**
- **Query Parameters:**
  - `customerNumber` (optional): Customer number.
  - `customerName` (optional): Customer name (case-insensitive).
  - `fromDate` (optional): Start date (format: YYYY-MM-DD).
  - `toDate` (optional): End date (format: YYYY-MM-DD).
  - `orderNumber` (optional): Order number.
  - `invoiceNumber` (optional): Invoice number.
  - `limit` (optional, default: 100): Number of results to fetch.
  - `offset` (optional, default: 0): Offset for pagination.

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [/* Array of invoices */],
    "count": 10,
    "pagination": {
      "total": 100,
      "limit": 10,
      "offset": 0,
      "page": 1,
      "pages": 10
    }
  }
  ```
- **Error (500):**
  ```json
  {
    "error": "Database query failed",
    "details": "Error details"
  }
  ```

---

### 2. Get invoice by ID
**Endpoint:** `GET /api/direct-invoice/:invoiceId`

**Description:** Retrieve a specific invoice by its ID.

**Request Parameters:**
- **Path Parameters:**
  - `invoiceId` (required): Invoice ID.

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "data": {
      "header": {/* Invoice header */},
      "details": [/* Invoice details */],
      "summary": {
        "invoiceNumber": 123,
        "customerName": "John Doe",
        "orderDate": "2025-09-15",
        "totalLines": 5,
        "totalAmount": 1000.00,
        "totalVAT": 200.00,
        "totalQuantity": 10,
        "grandTotal": 1200.00
      }
    }
  }
  ```
- **Error (404):**
  ```json
  {
    "success": false,
    "error": "Invoice not found",
    "invoiceId": 123
  }
  ```

---

### 3. Get all invoices
**Endpoint:** `GET /api/direct-invoice-list`

**Description:** Retrieve a list of all invoices.

**Request Parameters:**
- **Query Parameters:**
  - `limit` (optional, default: 100): Number of results to fetch.

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [/* Array of invoices */],
    "count": 100,
    "total": 1000
  }
  ```
- **Error (500):**
  ```json
  {
    "error": "Database query failed",
    "details": "Error details"
  }
  ```

---

### 4. Get invoices for a customer
**Endpoint:** `GET /api/direct-customer-invoices/:customerNumber`

**Description:** Retrieve invoices for a specific customer.

**Request Parameters:**
- **Path Parameters:**
  - `customerNumber` (required): Customer number.

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [/* Array of invoices */],
    "summary": {
      "customerNumber": 123,
      "customerName": "John Doe",
      "invoiceCount": 10,
      "totalValue": 5000.00
    }
  }
  ```
- **Error (500):**
  ```json
  {
    "error": "Database query failed",
    "details": "Error details"
  }
  ```

---

### 5. Get customers
**Endpoint:** `GET /api/direct-customers`

**Description:** Retrieve a list of customers.

**Request Parameters:**
- **Query Parameters:**
  - `search` (optional): Search by customer name or number.
  - `limit` (optional, default: 100): Number of results to fetch.

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [/* Array of customers */],
    "count": 100
  }
  ```
- **Error (500):**
  ```json
  {
    "error": "Database query failed",
    "details": "Error details"
  }
  ```

---

### 6. Get invoice statistics
**Endpoint:** `GET /api/direct-invoices/stats`

**Description:** Retrieve statistical information about invoices.

**Request Parameters:**
- **Query Parameters:**
  - `fromDate` (optional): Start date (format: YYYY-MM-DD).
  - `toDate` (optional): End date (format: YYYY-MM-DD).
  - `customerNumber` (optional): Filter by customer number.

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "data": {
      "overview": {
        "invoiceCount": 100,
        "totalAmount": 50000.00
      },
      "monthly": [/* Monthly stats */],
      "topCustomers": [/* Top customers */]
    }
  }
  ```
- **Error (500):**
  ```json
  {
    "error": "Stats query failed",
    "details": "Error details"
  }
  ```

---

### 7. Get invoice line items
**Endpoint:** `GET /api/direct-invoices/:invoiceNumber/items`

**Description:** Retrieve detailed line items for a specific invoice.

**Request Parameters:**
- **Path Parameters:**
  - `invoiceNumber` (required): Invoice number.

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [/* Array of line items */],
    "count": 10
  }
  ```
- **Error (500):**
  ```json
  {
    "error": "Database query failed",
    "details": "Error details"
  }
  ```

---

### 8. Get invoice header
**Endpoint:** `GET /api/invoice-header-exec/:invoiceId`

**Description:** Retrieve the header data for a specific invoice.

**Request Parameters:**
- **Path Parameters:**
  - `invoiceId` (required): Invoice ID.

**Response:**
- **Success (200):**
  ```json
  {
    "success": true,
    "data": [/* Invoice header */],
    "count": 1
  }
  ```
- **Error (500):**
  ```json
  {
    "error": "Database query failed",
    "details": "Error details"
  }
  ```
