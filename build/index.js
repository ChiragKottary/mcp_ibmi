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
                name: "get_order_details",
                description: "Get detailed information about a specific order from the external order service API using external system and order number. Maps response to FOHEPF table structure context.",
                inputSchema: {
                    type: "object",
                    properties: {
                        externalSystem: {
                            type: "string",
                            description: "The external system name (default: 'NEXSTEP')"
                        },
                        orderNumber: {
                            type: "string",
                            description: "The order number to retrieve details for. Can be just the number (e.g., '534955') or with suffix (e.g., '534955-0'). If no suffix is provided, '-0' will be automatically added."
                        },
                        forUpdate: {
                            type: "boolean",
                            description: "Whether to lock the order for update (default: false)"
                        },
                        lockSource: {
                            type: "string",
                            description: "Source of the lock (default: 'NGN')"
                        },
                        includeDeleted: {
                            type: "boolean",
                            description: "Whether to include deleted orders (default: true)"
                        }
                    },
                    required: ["orderNumber"]
                }
            },
            {
                name: "get_customer_invoices",
                description: "Get invoices for a specific customer from the invoice cloud service API. Returns paginated invoice summaries including amounts, dates, and project information.",
                inputSchema: {
                    type: "object",
                    properties: {
                        customerNo: {
                            type: "string",
                            description: "The customer number to retrieve invoices for (e.g., '310001')"
                        },
                        companyId: {
                            type: ["number", "string"],
                            description: "The company ID (default: 0)"
                        },
                        offset: {
                            type: ["number", "string"],
                            description: "Pagination offset (default: 0)"
                        },
                        limit: {
                            type: ["number", "string"],
                            description: "Maximum number of invoices to return (default: 10)"
                        }
                    },
                    required: ["customerNo"]
                }
            },
            {
                name: "get_customer_project_invoices",
                description: "Get invoices for a specific customer and project from the invoice cloud service API. Returns paginated invoice summaries for a specific project including amounts, dates, and project information.",
                inputSchema: {
                    type: "object",
                    properties: {
                        customerNo: {
                            type: "string",
                            description: "The customer number to retrieve invoices for (e.g., '310001')"
                        },
                        projectNo: {
                            type: "string",
                            description: "The project number to filter invoices by (e.g., '75932')"
                        },
                        companyId: {
                            type: ["number", "string"],
                            description: "The company ID (default: 0)"
                        },
                        offset: {
                            type: ["number", "string"],
                            description: "Pagination offset (default: 0)"
                        },
                        limit: {
                            type: ["number", "string"],
                            description: "Maximum number of invoices to return (default: 10)"
                        }
                    },
                    required: ["customerNo", "projectNo"]
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
        const endpointMap = {
            "get_order_details": "https://apps-order-service.cloud.test.egapps.no/api/orders/externalsystem/{externalSystem}/order/{orderNumber}",
            "get_customer_invoices": "https://invoice.cloud.test.egapps.no/api/v2/companies/{companyId}/customers/{customerNo}/invoices",
            "get_customer_project_invoices": "https://invoice.cloud.test.egapps.no/api/companies/{companyId}/customers/{customerNo}/projects/{projectNo}/invoices"
        };
        console.error(`🌐 API Endpoint: ${endpointMap[name] || "unknown"}`);
        switch (name) {
            case "get_order_details":
                result = await toolsService.getOrderDetails(args || {});
                break;
            case "get_customer_invoices":
                result = await toolsService.getCustomerInvoices(args || {});
                break;
            case "get_customer_project_invoices":
                result = await toolsService.getCustomerProjectInvoices(args || {});
                break;
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
        // Log successful completion
        const endTime = new Date();
        const executionTime = endTime.getTime() - startTime.getTime();
        console.error(`✅ MCP CALL COMPLETED: ${name} (${executionTime}ms)`);
        return result;
    }
    catch (error) {
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
    console.error("Available tools: get_order_details, get_customer_invoices, get_customer_project_invoices");
}
// Start the server
main().catch((error) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
});
