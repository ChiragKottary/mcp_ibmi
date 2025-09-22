// BuildMate MCP Server Configuration
export const config = {
    // API Configuration
    NODEJS_API_BASE_URL: process.env.NODEJS_API_BASE_URL || 'http://pub400.com:3012/',
    SERVER_NAME: 'BuildMate Invoice & Order MCP Server',
    SERVER_VERSION: '1.0.0',
    // API Timeout (in milliseconds)
    API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000'),
    // Log Level
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    // DB2 Configuration (for future use)
    DB2_CONNECTION_STRING: process.env.DB2_CONNECTION_STRING || '',
    // BuildMate Company Information
    COMPANY: {
        name: 'BuildMate Building Supplies',
        description: 'Your trusted partner for quality building materials and supplies',
        supportEmail: 'support@buildmate.com',
        phone: '1-800-BUILDMATE'
    }
};
export default config;
