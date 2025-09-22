// IBM i Invoice & Order MCP Server Configuration
export const config = {

    // Debug mode (set to 'true' to enable debug logs)
    DEBUG: process.env.DEBUG || 'false',

    // API Configuration
    NODEJS_API_BASE_URL: process.env.NODEJS_API_BASE_URL || '',

    // Order Service Configuration
    ORDER_SERVICE_TOKEN: process.env.API_KEY ,

    // Invoice Service Configuration
    INVOICE_SERVICE_TOKEN: process.env.API_KEY,

    // Server Configuration
    SERVER_NAME: 'IBM i Invoice & Order MCP Server',
    SERVER_VERSION: '1.0.0',

    // API Timeout (in milliseconds)
    API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000'),

    // Log Level
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    // DB2 Configuration (for future use)
    DB2_CONNECTION_STRING: process.env.DB2_CONNECTION_STRING || '',

    // Company Information
    COMPANY: {
        name: 'IBM i Invoice & Order System',
        description: 'MCP Server for IBM i invoice and order data integration',
        supportEmail: 'support@company.com',
        phone: '1-800-SUPPORT'
    }
};

export default config;
