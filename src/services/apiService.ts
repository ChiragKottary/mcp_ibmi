import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from '../config.js';
import { env } from 'node:process';
import { 
    OrderDetails, 
    ApiResponse, 
    ApiError, 
    CustomerInvoicesResponse,
    HealthStatus
} from '../types/api.types.js';

// API Service Class
export class ApiService {
    private client: AxiosInstance;
    private baseUrl: string = '';


    constructor() {

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

    // Order Service Methods
    async getOrderDetails(
        externalSystem: string = 'NEXSTEP',
        orderNumber: string,
        forUpdate: boolean = false, 
        lockSource: string = 'NGN',
        includeDeleted: boolean = true
    ): Promise<ApiResponse<OrderDetails>> {
        try {
            // Using the external order service endpoint with new format
            const orderServiceUrl = 'https://apps-order-service.cloud.test.egapps.no/api/orders';
            
            const response = await axios.get(
                `${orderServiceUrl}/externalsystem/${externalSystem}/order/${orderNumber}`,
                {
                    params: {
                        'for-update': forUpdate,
                        'lock-source': lockSource,
                        'include-deleted': includeDeleted
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': `${config.SERVER_NAME}/${config.SERVER_VERSION}`,
                        'accept': 'application/json',
                        'eg-apps-token': process.env.ORDER_SERVICE_TOKEN
                    },
                    timeout: config.API_TIMEOUT || 30000
                }
            );
            
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            } as any;
        } catch (error: any) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting order details:', error);
            
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
                throw new Error(`Failed to get order details for external system: ${externalSystem}, order: ${orderNumber}. ${errorMessage}`);
            } else if (error.request) {
                // Request was made but no response received
                throw new Error(`Failed to connect to order service for order: ${orderNumber}. Please check your connection and try again.`);
            } else {
                // Something else happened
                throw new Error(`Failed to get order details for order: ${orderNumber}. ${error.message}`);
            }
        }
    }

    // Customer Invoice Service Methods
    async getCustomerInvoices(
        companyId: number = 0, 
        customerNo: string, 
        offset: number = 0, 
        limit: number = 10
    ): Promise<ApiResponse<CustomerInvoicesResponse>> {
        try {
            // Using the invoice cloud endpoint
            const invoiceServiceUrl = 'https://invoice.cloud.test.egapps.no/api/v2';
            
            const response = await axios.get(
                `${invoiceServiceUrl}/companies/${companyId}/customers/${customerNo}/invoices`,
                {
                    params: {
                        offset,
                        limit
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': `${config.SERVER_NAME}/${config.SERVER_VERSION}`,
                        'accept': 'application/json;charset=UTF-8',
                        'eg-apps-token': process.env.INVOICE_SERVICE_TOKEN
                    },
                    timeout: config.API_TIMEOUT || 30000
                }
            );
            
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            } as any;
        } catch (error: any) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting customer invoices:', error);
            
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
                throw new Error(`Failed to get invoices for customer: ${customerNo}. ${errorMessage}`);
            } else if (error.request) {
                // Request was made but no response received
                throw new Error(`Failed to connect to invoice service for customer: ${customerNo}. Please check your connection and try again.`);
            } else {
                // Something else happened
                throw new Error(`Failed to get customer invoices for: ${customerNo}. ${error.message}`);
            }
        }
    }

    // Get invoices by customer and project
    async getCustomerProjectInvoices(
        companyId: number = 0, 
        customerNo: string, 
        projectNo: string,
        offset: number = 0, 
        limit: number = 10
    ): Promise<ApiResponse<CustomerInvoicesResponse>> {
        try {
            // Using the invoice cloud endpoint for project-specific invoices
            const invoiceServiceUrl = 'https://invoice.cloud.test.egapps.no/api';
            
            const response = await axios.get(
                `${invoiceServiceUrl}/companies/${companyId}/customers/${customerNo}/projects/${projectNo}/invoices`,
                {
                    params: {
                        offset,
                        limit
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': `${config.SERVER_NAME}/${config.SERVER_VERSION}`,
                        'accept': 'application/json;charset=UTF-8',
                        'eg-apps-token': process.env.INVOICE_SERVICE_TOKEN
                    },
                    timeout: config.API_TIMEOUT || 30000
                }
            );
            
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            } as any;
        } catch (error: any) {
            // Using stderr for logs to avoid interfering with MCP protocol
            console.error('Error getting customer project invoices:', error);
            
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
                throw new Error(`Failed to get invoices for customer: ${customerNo}, project: ${projectNo}. ${errorMessage}`);
            } else if (error.request) {
                // Request was made but no response received
                throw new Error(`Failed to connect to invoice service for customer: ${customerNo}, project: ${projectNo}. Please check your connection and try again.`);
            } else {
                // Something else happened
                throw new Error(`Failed to get customer project invoices for: ${customerNo}, project: ${projectNo}. ${error.message}`);
            }
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
    async getApiStatus(): Promise<HealthStatus> {
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
            "x-goog-api-key": process.env.GEMINI_API_KEY
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
