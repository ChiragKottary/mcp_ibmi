import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from '../config.js';

// Order Service Types

// Order Service Types
export interface OrderLine {
    id: string;
    lineNumber: number;
    oldLineNumber?: number;
    lineType: string;
    articleNo: string;
    articleText1?: string;
    articleText2?: string;
    unitCode?: string;
    quantity: number;
    unitPriceExVat: number;
    unitPriceIncVat: number;
    costPriceExVat: number;
    purchasePriceExVat: number;
    discountPercent1?: number;
    discountPercent2?: number;
    specialDiscountPercent1?: number;
    specialDiscountPercent2?: number;
    campaignCode?: string;
    coveragePercent?: number;
    vatPercent?: number;
    totalCostPriceExVat: number;
    totalPurchasePriceExVat: number;
    totalDiscountedPriceExVat: number;
    totalDiscountedPriceIncVat: number;
    externalLineStatus?: string;
    quantityDelivered?: number;
    quantityRemaining?: number;
    quantityInvoiced?: number;
    unitPriceOriginalExVat?: number;
    costPriceOriginalExVat?: number;
    warehouseNo?: string;
    departmentNo?: string;
    deliveryTypeCode?: string;
    deliveryTypeName?: string;
    deliveryDate?: string;
    priceCode?: string;
    vendorNumber?: string;
    externalArticle?: boolean;
    externalPriceCalculationDescription?: string;
    externalPriceCostCalculationFactor?: number;
    externalPricePurchaseCalculationFactor?: number;
    articleType?: string;
    gtinNo?: string;
    purchaseOrderNumber?: string;
    purchaseOrderLineNumber?: number;
    purchaseOrderStatus?: string;
    unitVolumeInQm?: number;
    unitWeightInKg?: number;
    parentLineNumber?: number;
    articleOrigin?: string;
    lineChosen?: boolean;
}

export interface OrderCustomer {
    customerNo: string;
    name: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    url?: string;
    email?: string;
    organizationNumber?: string;
    defaultOrderDiscountPercent?: number;
    vatFree?: boolean;
    address?: {
        name?: string;
        address1?: string;
        address2?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
}

export interface OrderDetails {
    version: number;
    orderFlowIndicator: string;
    orderNo: number;
    parentOrderNo?: number;
    externalOrderReferences?: Array<{
        externalSystemCode?: string;
        externalOrderNo?: string;
        externalOrderStatus?: string;
        externalOrderType?: string;
    }>;
    departmentNo?: string;
    warehouseNo?: string;
    customer: OrderCustomer;
    articleCustomer?: {
        name?: string;
        organizationNumber?: string;
        gln?: string;
    };
    customerProject?: {
        id?: string;
        projectNo?: string;
        name?: string;
        externalProjectNo?: string;
        email?: string;
        phone?: string;
        mobile?: string;
        address?: {
            name?: string;
            address1?: string;
            address2?: string;
            postalCode?: string;
            city?: string;
            country?: string;
        };
    };
    orderDate?: string;
    deliveryDate?: string;
    expireDate?: string;
    followupDate?: string;
    deliveryType?: {
        code?: string;
        name?: string;
    };
    deliveryRouteId?: string;
    deliveryMethodId?: string;
    ourReference?: string;
    customerReference?: string;
    requisition?: string;
    information?: string;
    salesperson?: {
        code?: string;
        name?: string;
        phone?: string;
        email?: string;
    };
    responsibleSalesperson?: {
        code?: string;
        name?: string;
        phone?: string;
        email?: string;
    };
    deliveryAddress?: {
        name?: string;
        address1?: string;
        address2?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
    coveragePercent?: number;
    orderDiscountPercent?: number;
    totalPurchasePriceExVat?: number;
    totalCostPriceExVat?: number;
    totalDiscountedPriceExVat?: number;
    totalDiscountedPriceIncVat?: number;
    createdTimestamp?: string;
    createdByUser?: string;
    lastChangedTimestamp?: string;
    lastChangedByUser?: string;
    deletedByUser?: string;
    deletedTime?: string;
    deletedReason?: string;
    orderInfoCode?: string;
    calculateVat?: boolean;
    automaticFee?: boolean;
    automaticInvoiceFee?: boolean;
    automaticShippingFee?: boolean;
    headerText?: string;
    footerText?: string;
    customerPaymentTermCode?: string;
    customerContact?: {
        customerContactId?: string;
        name?: string;
        phone?: string;
        email?: string;
    };
    requiredDeposit?: number;
    deductedDeposit?: number;
    remainingDeposit?: number;
    currencyCode?: string;
    targetMarginInPercent?: number;
    priceSourceOrderNo?: string;
    customerCardNumber?: string;
    orderCommands?: string[];
    orderLines?: OrderLine[];
    warehouseEmployeeText?: string;
    transportEmployeeText?: string;
    transportShipmentReference?: string;
    lockKey?: string;
    lockDetails?: {
        lockedByUser?: string;
        lockedTime?: string;
        lockSource?: string;
    };
    source?: string;
    parcels?: Array<{
        parcelType?: string;
        text?: string;
        printerName?: string;
    }>;
    quote?: boolean;
    deleted?: boolean;
    draft?: boolean;
    readyForPicking?: boolean;
    delivered?: boolean;
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

// Invoice Service Types
export interface Address {
    streetOrPlace?: string;
    streetNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export interface CustomerProject {
    projectNo?: string;
    projectName?: string;
    address?: Address;
}

export interface InvoiceSummary {
    id: string;
    invoiceNo: string;
    customerNo: string;
    customerName: string;
    invoiceDate: string;
    dueDate: string;
    amountIncVAT: number;
    amountExVAT: number;
    customerProject?: CustomerProject;
    kid?: string;
    paymentMode?: string;
}

export interface CustomerInvoicesResponse {
    offset: number;
    limit: number;
    invoiceSummaries: InvoiceSummary[];
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
                        'eg-apps-token': config.ORDER_SERVICE_TOKEN
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
                        'eg-apps-token': config.INVOICE_SERVICE_TOKEN
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
                        'eg-apps-token': config.INVOICE_SERVICE_TOKEN
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
