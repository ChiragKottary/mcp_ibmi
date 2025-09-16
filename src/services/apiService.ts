import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from '../config.js';

// Types based on actual API endpoints
export interface InvoiceHeaderItem {
    // Original field names from DB2/IBM i
    SOFIRM?: string;      // Company/Firm
    SOAARR?: string;      // Year
    SOBINR?: string;      // Document number
    SONUMM?: string;      // Order number
    SOSUFF?: string;      // Suffix
    SOOTYP?: string;      // Order type
    SOKUND?: string;      // Customer number
    SOKUNA?: string;      // Customer name
    SONAVN?: string;      // Customer name alt
    SOADR1?: string;      // Address 1
    SOADR2?: string;      // Address 2
    SOSTED?: string;      // Place/City
    SOBDAT?: string;      // Order date
    SOLDAT?: string;      // Delivery date
    SOFFDA?: string;      // Due date
    SOSALP?: string;      // Sales amount
    SOFSUM?: string;      // Total sum
    SOUSER?: string;      // User
    SODATE?: string;      // Created date
    SOTIME?: string;      // Created time
    
    // Additional IBM i field names from different API endpoints
    INVOICENUMBER?: string;
    CUSTOMERNUMBER?: string;
    CUSTOMERNAME?: string;
    ORDERDATE?: string;
    DELIVERYDATE?: string;
    SHIPMENTDATE?: string;
    TOTALAMOUNT?: string;
    CURRENCY?: string;
    CREATEDDATE?: string;
    
    // Mapped fields for compatibility
    invoiceNumber?: string;
    batchNumber?: string;
    orderNumber?: string;
    orderSuffix?: string;
    orderType?: string;
    customerNumber?: string;
    customerName?: string;
    orderDate?: string;
    deliveryDate?: string;
    invoiceAmount?: number;
    currency?: string;
    paymentTerms?: string;
    status?: 'paid' | 'pending' | 'overdue' | 'draft';
}

export interface InvoiceLineItem {
    lineNumber: string;
    itemNumber: string;
    description: string;
    quantity: number;
    unit?: string;
    salesPrice: number;
    discount1?: number;
    discount2?: number;
    vatCode?: string;
    vatAmount?: number;
    totalAmount: number;
    // IBM i field names from direct-invoice API
    SDLINE?: string;        // Line number
    SDVARE?: string;        // Item number
    SDTEK1?: string;        // Description line 1
    SDTEK2?: string;        // Description line 2
    SDTEK3?: string;        // Description line 3
    SDANTA?: string;        // Quantity
    SDENH1?: string;        // Unit
    SDSAPR?: string;        // Sales price
    SDRAB1?: string;        // Discount 1
    SDRAB2?: string;        // Discount 2
    SDOMVA?: string;        // VAT code
    SDSALG?: string;        // Total amount (sales)
    SDKOST?: string;        // Cost amount
}

export interface InvoiceDetail {
    header: InvoiceHeaderItem;
    details: InvoiceLineItem[];
    summary: {
        invoiceNumber: string;
        customerName: string;
        orderDate: string;
        totalLines: number;
        totalAmount: number;
        totalVAT: number;
        totalQuantity: number;
        grandTotal: number;
    };
}

export interface Customer {
    customerNumber: string;
    customerName: string;
    address?: string;
    city?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    accountManager?: string;
    // IBM i field names from different endpoints
    CUSTOMERNUMBER?: string;
    CUSTOMERNAME?: string;
    SOLKUN?: string;       // Customer number from direct-customers
    SOKUNA?: string;       // Customer name from direct-customers
    SONAVN?: string;       // Alternative customer name
    SOSTED?: string;       // Location/city from direct-customers
}

export interface InvoiceStats {
    overview: {
        invoiceCount: number;
        totalAmount: number;
        // IBM i field names
        INVOICECOUNT?: string;
        TOTALAMOUNT?: string;
    };
    monthly: Array<{
        month: string;
        invoiceCount: number;
        totalAmount: number;
        // IBM i field names
        YEAR?: string;
        MONTH?: string;
        INVOICECOUNT?: string;
        TOTALAMOUNT?: string;
    }>;
    topCustomers: Array<{
        customerNumber: string;
        customerName: string;
        invoiceCount: number;
        totalAmount: number;
        // IBM i field names
        CUSTOMERNUMBER?: string;
        CUSTOMERNAME?: string;
        INVOICECOUNT?: string;
        TOTALAMOUNT?: string;
    }>;
}

export interface InvoiceSummary {
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    draftAmount: number;
}

export interface CustomerInvoiceSummary {
    customerNumber: string;
    customerName: string;
    invoiceCount: number;
    totalValue: number;
    invoices: InvoiceHeaderItem[];
}

export interface PaginationInfo {
    total: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    total?: number;
    pagination?: PaginationInfo;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: string;
}

// API Service Class
export class ApiService {
    private client: AxiosInstance;
    private baseUrl: string;

    constructor() {
        this.baseUrl = config.NODEJS_API_BASE_URL;

        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: config.API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': `${config.SERVER_NAME}/${config.SERVER_VERSION}`
            }
        });

        // Add request interceptor for logging (using stderr to avoid interfering with MCP protocol)
        this.client.interceptors.request.use(
            (config) => {
                // Using stderr for logs to avoid interfering with MCP protocol
                if (process.env.DEBUG === 'true') {
                    console.error(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
                }
                return config;
            },
            (error) => {
                // Using stderr for logs to avoid interfering with MCP protocol
                console.error('API Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => {
                // Using stderr for logs to avoid interfering with MCP protocol
                if (process.env.DEBUG === 'true') {
                    console.error(`API Response: ${response.status} ${response.config.url}`);
                }
                return response;
            },
            (error) => {
                // Using stderr for logs to avoid interfering with MCP protocol
                console.error('API Response Error:', error.response?.status, error.message);
                return Promise.reject(this.handleApiError(error));
            }
        );
    }

    private handleApiError(error: any): ApiError {
        if (error.response) {
            // Server responded with error status
            return {
                message: error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
                status: error.response.status,
                code: error.response.data?.code
            };
        } else if (error.request) {
            // Request was made but no response received
            return {
                message: 'No response received from API server',
                code: 'NO_RESPONSE'
            };
        } else {
            // Something else happened
            return {
                message: error.message || 'Unknown API error',
                code: 'UNKNOWN_ERROR'
            };
        }
    }

    // Invoice Methods
    async searchInvoices(filters: {
        customerNumber?: string;
        customerName?: string;
        fromDate?: string;
        toDate?: string;
        orderNumber?: string;
        invoiceNumber?: string;
        limit?: number;
        offset?: number;
    }): Promise<ApiResponse<InvoiceHeaderItem[]>> {
        try {
            const response = await this.client.get('/api/direct-invoices', { params: filters });
            return response.data;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('❌ Error searching invoices:', error);
            throw new Error('Failed to search invoices. Please try again or contact support.');
        }
    }

    async getInvoiceDetails(invoiceId: number): Promise<ApiResponse<InvoiceDetail>> {
        try {
            const response = await this.client.get(`/api/direct-invoice/${invoiceId}`);
            return response.data;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting invoice details:', error);
            throw new Error(`Failed to get invoice details for ID: ${invoiceId}. Please verify the invoice ID and try again.`);
        }
    }

    async getAllInvoices(limit?: number): Promise<ApiResponse<InvoiceHeaderItem[]>> {
        try {
            const response = await this.client.get('/api/direct-invoice-list', { params: { limit } });
            return response.data;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting all invoices:', error);
            throw new Error('Failed to get invoices list. Please try again or contact support.');
        }
    }

    async getCustomerInvoices(customerNumber: number): Promise<ApiResponse<CustomerInvoiceSummary>> {
        try {
            const response = await this.client.get(`/api/direct-customer-invoices/${customerNumber}`);
            return response.data;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting customer invoices:', error);
            throw new Error(`Failed to get invoices for customer: ${customerNumber}. Please try again.`);
        }
    }
    
    async getInvoiceStatistics(filters?: {
        fromDate?: string;
        toDate?: string;
        customerNumber?: string;
    }): Promise<ApiResponse<InvoiceStats>> {
        try {
            const response = await this.client.get('/api/direct-invoices/stats', { params: filters });
            return response.data;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting invoice statistics:', error);
            throw new Error('Failed to get invoice statistics. Please try again or contact support.');
        }
    }

    async getInvoiceLineItems(invoiceNumber: number): Promise<ApiResponse<InvoiceLineItem[]>> {
        try {
            const response = await this.client.get(`/api/direct-invoices/${invoiceNumber}/items`);
            return response.data;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting invoice line items:', error);
            throw new Error(`Failed to get line items for invoice: ${invoiceNumber}. Please try again.`);
        }
    }

    async getInvoiceHeader(invoiceId: number): Promise<ApiResponse<InvoiceHeaderItem>> {
        try {
            const response = await this.client.get(`/api/invoice-header-exec/${invoiceId}`);
            return response.data;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting invoice header:', error);
            throw new Error(`Failed to get invoice header for ID: ${invoiceId}. Please try again.`);
        }
    }
    
    // Customer Methods
    async getCustomers(search?: string, limit?: number): Promise<ApiResponse<Customer[]>> {
        try {
            const response = await this.client.get('/api/direct-customers', { params: { search, limit } });
            return response.data;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting customers:', error);
            throw new Error('Failed to get customers. Please try again or contact support.');
        }
    }

    // Health Check
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/api/health');
            return response.status === 200 && response.data.success;
        } catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Health check failed:', error);
            return false;
        }
    }

    // Get API Status
    async getApiStatus(): Promise<{ status: string; message: string; timestamp: string }> {
        try {
            const response = await this.client.get('/api/health');
            return {
                status: 'healthy',
                message: 'API is responding normally',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                message: 'API is not responding',
                timestamp: new Date().toISOString()
            };
        }
    }
    async askGemini(prompt: string) {
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": config.GEMINI_API_KEY
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      // Using stderr for logs to avoid interfering with MCP protocol
      console.error("Gemini API Error:", error.response?.data || error.message);
      throw new Error("Failed to get response from Gemini");
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
