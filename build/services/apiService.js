import axios from 'axios';
import { config } from '../config.js';
// API Service Class
export class ApiService {
    client;
    baseUrl;
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
        this.client.interceptors.request.use((config) => {
            // Using stderr for logs to avoid interfering with MCP protocol
            if (process.env.DEBUG === 'true') {
                console.error(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
            }
            return config;
        }, (error) => {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('API Request Error:', error);
            return Promise.reject(error);
        });
        // Add response interceptor for error handling
        this.client.interceptors.response.use((response) => {
            // Using stderr for logs to avoid interfering with MCP protocol
            if (process.env.DEBUG === 'true') {
                console.error(`API Response: ${response.status} ${response.config.url}`);
            }
            return response;
        }, (error) => {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('API Response Error:', error.response?.status, error.message);
            return Promise.reject(this.handleApiError(error));
        });
    }
    handleApiError(error) {
        if (error.response) {
            // Server responded with error status
            return {
                message: error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
                status: error.response.status,
                code: error.response.data?.code
            };
        }
        else if (error.request) {
            // Request was made but no response received
            return {
                message: 'No response received from API server',
                code: 'NO_RESPONSE'
            };
        }
        else {
            // Something else happened
            return {
                message: error.message || 'Unknown API error',
                code: 'UNKNOWN_ERROR'
            };
        }
    }
    // Invoice Methods
    async searchInvoices(filters) {
        try {
            const response = await this.client.get('/api/direct-invoices', { params: filters });
            return response.data;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('❌ Error searching invoices:', error);
            throw new Error('Failed to search invoices. Please try again or contact support.');
        }
    }
    async getInvoiceDetails(invoiceId) {
        try {
            const response = await this.client.get(`/api/direct-invoice/${invoiceId}`);
            return response.data;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting invoice details:', error);
            throw new Error(`Failed to get invoice details for ID: ${invoiceId}. Please verify the invoice ID and try again.`);
        }
    }
    async getAllInvoices(limit) {
        try {
            const response = await this.client.get('/api/direct-invoice-list', { params: { limit } });
            return response.data;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting all invoices:', error);
            throw new Error('Failed to get invoices list. Please try again or contact support.');
        }
    }
    async getCustomerInvoices(customerNumber) {
        try {
            const response = await this.client.get(`/api/direct-customer-invoices/${customerNumber}`);
            return response.data;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting customer invoices:', error);
            throw new Error(`Failed to get invoices for customer: ${customerNumber}. Please try again.`);
        }
    }
    async getInvoiceStatistics(filters) {
        try {
            const response = await this.client.get('/api/direct-invoices/stats', { params: filters });
            return response.data;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting invoice statistics:', error);
            throw new Error('Failed to get invoice statistics. Please try again or contact support.');
        }
    }
    async getInvoiceLineItems(invoiceNumber) {
        try {
            const response = await this.client.get(`/api/direct-invoices/${invoiceNumber}/items`);
            return response.data;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting invoice line items:', error);
            throw new Error(`Failed to get line items for invoice: ${invoiceNumber}. Please try again.`);
        }
    }
    async getInvoiceHeader(invoiceId) {
        try {
            const response = await this.client.get(`/api/invoice-header-exec/${invoiceId}`);
            return response.data;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting invoice header:', error);
            throw new Error(`Failed to get invoice header for ID: ${invoiceId}. Please try again.`);
        }
    }
    // Customer Methods
    async getCustomers(search, limit) {
        try {
            const response = await this.client.get('/api/direct-customers', { params: { search, limit } });
            return response.data;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting customers:', error);
            throw new Error('Failed to get customers. Please try again or contact support.');
        }
    }
    // Health Check
    async healthCheck() {
        try {
            const response = await this.client.get('/api/health');
            return response.status === 200 && response.data.success;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Health check failed:', error);
            return false;
        }
    }
    // Get API Status
    async getApiStatus() {
        try {
            const response = await this.client.get('/api/health');
            return {
                status: 'healthy',
                message: 'API is responding normally',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: 'API is not responding',
                timestamp: new Date().toISOString()
            };
        }
    }
    async askGemini(prompt) {
        try {
            const response = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent", {
                contents: [{ parts: [{ text: prompt }] }]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": config.GEMINI_API_KEY
                }
            });
            return response.data.candidates[0].content.parts[0].text;
        }
        catch (error) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error("Gemini API Error:", error.response?.data || error.message);
            throw new Error("Failed to get response from Gemini");
        }
    }
}
// Export singleton instance
export const apiService = new ApiService();
export default apiService;
