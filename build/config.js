// BuildMate MCP Server Configuration
export const config = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyAs8LiTJGxG-ornMJXujWzqvktD6dxUlrI",
    // Debug mode (set to 'true' to enable debug logs)
    DEBUG: process.env.DEBUG || 'false',
    // API Configuration
    NODEJS_API_BASE_URL: process.env.NODEJS_API_BASE_URL || 'http://pub400.com:3012/',
    // Order Service Configuration
    ORDER_SERVICE_TOKEN: process.env.ORDER_SERVICE_TOKEN || 'eyJhbGciOiJSU0EiLCJ0eXAiOiJKV1QifQ==.eyJzdWIiOiJlZ3RfZGV2QGVndGVzdC1hZGJlZ3QwMDAwIiwicmVmcmVzaFRva2VuIjoiakcvWHM3d3owSjZSd1h0NXhmamhndz09IiwiZXhwIjoxNzYzMjE2MjQyODM3LCJhcGlLZXkiOnRydWUsInJvbGVzIjpbXSwibWV0YURhdGEiOnt9fQ==.X5GCuP+b1MRlJfNKDANLfbJp9yOHgn9crwSAUQMXj2qSI8A4u1tlqcWyj4M6THUUApQ/kv6SiMHOqziokZ303mgnhbOqFrP1UlQcv72e6McQ+z+00hQLoJntm3eBkQAXvYp2GQpJpFoxi8BLhzQpQgODFuom4kvaYEa+oQ1oroM3LAhCrAjHJuOlDLu/TNErLJe+u/ve4wpNcqnZziiyIWaCEwFb6km8p+tvqrJSt3Ci5/A6A8tAu20toh3+fNuZr2A+A3sxc61y+4bw6xKpBYJCU5wwfT99gRBEW2zsN4Y/tIt8AauXvTEEs37195Cpvb36snIRQM2WlPGLRNBCjg==',
    // Server Configuration
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
