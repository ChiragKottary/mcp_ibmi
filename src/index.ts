import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import { config } from "./config.js";
import { toolsService } from "./services/toolsService.js";

// Redirect console.log to stderr to avoid interfering with MCP protocol
const originalConsoleLog = console.log;
console.log = (...args) => {
    console.error(...args);
};

// Load environment variables
dotenv.config();

// Create MCP Server
const server = new Server({
    name: config.SERVER_NAME,
    version: config.SERVER_VERSION,
}, {
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    }
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_invoices",
                description: "Search for invoices based on various criteria like customer name, date range, order number, etc.",
                inputSchema: {
                    type: "object",
                    properties: {
                        customerNumber: { type: "string", description: "Filter by customer number" },
                        customerName: { type: "string", description: "Filter by customer name (case-insensitive)" },
                        fromDate: { type: "string", description: "Start date for invoice search (YYYY-MM-DD)" },
                        toDate: { type: "string", description: "End date for invoice search (YYYY-MM-DD)" },
                        orderNumber: { type: "string", description: "Filter by order number" },
                        invoiceNumber: { type: "string", description: "Filter by invoice number" },
                        limit: { type: "number", description: "Number of results to fetch (default: 100)" },
                        offset: { type: "number", description: "Offset for pagination (default: 0)" }
                    }
                }
            },
            {
                name: "get_invoice_details",
                description: "Get detailed information about a specific invoice by ID including header, line items and summary",
                inputSchema: {
                    type: "object",
                    properties: {
                        invoiceId: { type: "string", description: "The invoice ID to retrieve details for" }
                    },
                    required: ["invoiceId"]
                }
            },
            {
                name: "get_all_invoices",
                description: "Get a list of all invoices in the system",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", description: "Number of results to fetch (default: 100)" }
                    }
                }
            },
            {
                name: "get_customer_invoices",
                description: "Get all invoices for a specific customer",
                inputSchema: {
                    type: "object",
                    properties: {
                        customerNumber: { type: "string", description: "Customer number to fetch invoices for" }
                    },
                    required: ["customerNumber"]
                }
            },
            {
                name: "get_invoice_statistics",
                description: "Get statistical information about invoices with optional date and customer filters",
                inputSchema: {
                    type: "object",
                    properties: {
                        fromDate: { type: "string", description: "Start date (format: YYYY-MM-DD)" },
                        toDate: { type: "string", description: "End date (format: YYYY-MM-DD)" },
                        customerNumber: { type: "string", description: "Filter statistics by customer number" }
                    }
                }
            },
            {
                name: "get_invoice_line_items",
                description: "Get detailed line items for a specific invoice",
                inputSchema: {
                    type: "object",
                    properties: {
                        invoiceNumber: { type: "string", description: "The invoice number to get line items for" }
                    },
                    required: ["invoiceNumber"]
                }
            },
            {
                name: "get_invoice_header",
                description: "Get just the header data for a specific invoice",
                inputSchema: {
                    type: "object",
                    properties: {
                        invoiceId: { type: "string", description: "The invoice ID to retrieve header for" }
                    },
                    required: ["invoiceId"]
                }
            },
            {
                name: "get_customers",
                description: "Get a list of customers with optional search filter",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Search by customer name or number" },
                        limit: { type: "number", description: "Number of results to fetch (default: 100)" }
                    }
                }
            }
        ]
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    // Always log MCP call information to stderr
    console.error(`\n🔄 MCP CALL: ${name}`);
    console.error(`📝 Arguments: ${JSON.stringify(args, null, 2)}`);
    
    const startTime = new Date();
    let result;
    
    try {
        // Log which endpoint will be called based on the tool name
        const endpointMap: Record<string, string> = {
            "search_invoices": "/api/direct-invoices",
            "get_invoice_details": "/api/direct-invoice",
            "get_all_invoices": "/api/direct-invoice-list",
            "get_customer_invoices": "/api/direct-customer-invoices",
            "get_invoice_statistics": "/api/direct-invoices/stats",
            "get_invoice_line_items": "/api/direct-invoices/items",
            "get_invoice_header": "/api/invoice-header-exec",
            "get_customers": "/api/direct-customers"
        };
        
        console.error(`🌐 API Endpoint: ${endpointMap[name] || "unknown"}`);
        
        switch (name) {
            case "search_invoices":
                result = await toolsService.searchInvoices(args || {});
                break;
                
            case "get_invoice_details":
                result = await toolsService.getInvoiceDetails(args || {});
                break;
                
            case "get_all_invoices":
                result = await toolsService.getAllInvoices(args || {});
                break;
                
            case "get_customer_invoices":
                result = await toolsService.getCustomerInvoices(args || {});
                break;
                
            case "get_invoice_statistics":
                result = await toolsService.getInvoiceStatistics(args || {});
                break;
                
            case "get_invoice_line_items":
                result = await toolsService.getInvoiceLineItems(args || {});
                break;
                
            case "get_invoice_header":
                result = await toolsService.getInvoiceHeader(args || {});
                break;
                
            case "get_customers":
                result = await toolsService.getCustomers(args || {});
                break;
                
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
        
        // Log successful completion
        const endTime = new Date();
        const executionTime = endTime.getTime() - startTime.getTime();
        console.error(`✅ MCP CALL COMPLETED: ${name} (${executionTime}ms)`);
        
        return result;
    } catch (error) {
        // Log error details
        const endTime = new Date();
        const executionTime = endTime.getTime() - startTime.getTime();
        console.error(`❌ MCP CALL FAILED: ${name} (${executionTime}ms)`);
        console.error(`❌ Error executing tool ${name}:`, error);
        
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
                }
            ],
            isError: true
        };
    }
});

// Main function
async function main() {
    console.error(`Starting ${config.SERVER_NAME} v${config.SERVER_VERSION}...`);
    console.error(`API Base URL: ${config.NODEJS_API_BASE_URL}`);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("MCP Server connected and ready!");
    console.error("Available tools: search_invoices, get_invoice_details, get_all_invoices, get_customer_invoices, get_invoice_statistics, get_invoice_line_items, get_invoice_header, get_customers");
}

// Start the server
main().catch((error) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
});