// IBM i Invoice & Order MCP Server Configuration
export const config = {

    // API Configuration


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
