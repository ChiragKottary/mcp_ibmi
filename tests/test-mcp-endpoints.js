#!/usr/bin/env node

/**
 * Test script for MCP Server endpoints
 * This script tests all available MCP tools with the real API
 */

import { spawn } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MCP Test Client Configuration
const MCP_SERVER_PATH = join(__dirname, 'build', 'index.js');

class MCPTestClient {
    constructor() {
        this.testResults = [];
        this.serverProcess = null;
    }

    async startServer() {
        console.log('🚀 Starting MCP Server...');
        this.serverProcess = spawn('node', [MCP_SERVER_PATH], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: __dirname
        });

        // Wait for server to be ready
        await new Promise((resolve) => {
            this.serverProcess.stderr.on('data', (data) => {
                const output = data.toString();
                console.log('📝 Server:', output.trim());
                if (output.includes('MCP Server connected and ready!')) {
                    resolve();
                }
            });
        });

        console.log('✅ MCP Server is ready!\n');
    }

    async sendMCPRequest(method, params = {}) {
        const request = {
            jsonrpc: "2.0",
            id: Date.now(),
            method: method,
            params: params
        };

        return new Promise((resolve, reject) => {
            const requestStr = JSON.stringify(request) + '\n';
            
            console.log(`📤 Sending: ${method}`);
            console.log(`📋 Params: ${JSON.stringify(params, null, 2)}`);
            
            this.serverProcess.stdin.write(requestStr);

            let responseData = '';
            const responseHandler = (data) => {
                responseData += data.toString();
                
                // Try to parse JSON response
                try {
                    const lines = responseData.split('\n').filter(line => line.trim());
                    for (const line of lines) {
                        if (line.trim()) {
                            const response = JSON.parse(line);
                            if (response.id === request.id) {
                                this.serverProcess.stdout.removeListener('data', responseHandler);
                                resolve(response);
                                return;
                            }
                        }
                    }
                } catch (e) {
                    // Continue collecting data
                }
            };

            this.serverProcess.stdout.on('data', responseHandler);

            // Timeout after 10 seconds
            setTimeout(() => {
                this.serverProcess.stdout.removeListener('data', responseHandler);
                reject(new Error('Request timeout'));
            }, 10000);
        });
    }

    async testEndpoint(toolName, params = {}) {
        try {
            console.log(`\n🧪 Testing: ${toolName}`);
            console.log('=' .repeat(50));
            
            const startTime = Date.now();
            
            const response = await this.sendMCPRequest('tools/call', {
                name: toolName,
                arguments: params
            });
            
            const duration = Date.now() - startTime;
            
            if (response.error) {
                console.log(`❌ Error: ${response.error.message}`);
                this.testResults.push({
                    tool: toolName,
                    status: 'ERROR',
                    error: response.error.message,
                    duration
                });
            } else {
                console.log(`✅ Success (${duration}ms)`);
                console.log(`📄 Response: ${JSON.stringify(response.result?.content?.[0]?.text?.substring(0, 200) || 'No content')}...`);
                this.testResults.push({
                    tool: toolName,
                    status: 'SUCCESS',
                    duration,
                    response: response.result
                });
            }
        } catch (error) {
            console.log(`❌ Test failed: ${error.message}`);
            this.testResults.push({
                tool: toolName,
                status: 'FAILED',
                error: error.message
            });
        }
    }

    async runAllTests() {
        console.log('🔥 Starting comprehensive MCP endpoint testing...\n');

        // Test 1: List available tools
        try {
            const toolsResponse = await this.sendMCPRequest('tools/list');
            console.log('📋 Available tools:', toolsResponse.result?.tools?.map(t => t.name).join(', '));
        } catch (error) {
            console.log('❌ Failed to list tools:', error.message);
        }

        // Test 2: Search invoices (basic search)
        await this.testEndpoint('search_invoices', {});

        // Test 3: Search invoices with filters
        await this.testEndpoint('search_invoices', {
            limit: 5,
            customerName: 'ABC'
        });

        // Test 4: Get all invoices
        await this.testEndpoint('get_all_invoices', {
            limit: 10
        });

        // Test 5: Get invoice details (you may need to adjust the invoiceId)
        await this.testEndpoint('get_invoice_details', {
            invoiceId: 'INV-2024-001'
        });

        // Test 6: Get customer invoices
        await this.testEndpoint('get_customer_invoices', {
            customerNumber: 'CUST-001'
        });

        // Test 7: Get invoice statistics
        await this.testEndpoint('get_invoice_statistics', {});

        // Test 8: Get invoice statistics with date range
        await this.testEndpoint('get_invoice_statistics', {
            fromDate: '2024-01-01',
            toDate: '2024-12-31'
        });

        // Test 9: Get invoice line items
        await this.testEndpoint('get_invoice_line_items', {
            invoiceNumber: 'INV-2024-001'
        });

        // Test 10: Get invoice header
        await this.testEndpoint('get_invoice_header', {
            invoiceId: 'INV-2024-001'
        });

        // Test 11: Get customers
        await this.testEndpoint('get_customers', {
            limit: 10
        });

        // Test 12: Search customers
        await this.testEndpoint('get_customers', {
            search: 'ABC',
            limit: 5
        });

        this.printSummary();
    }

    printSummary() {
        console.log('\n\n📊 TEST SUMMARY');
        console.log('=' .repeat(60));
        
        const successful = this.testResults.filter(r => r.status === 'SUCCESS').length;
        const failed = this.testResults.filter(r => r.status === 'ERROR' || r.status === 'FAILED').length;
        
        console.log(`✅ Successful: ${successful}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${((successful / this.testResults.length) * 100).toFixed(1)}%`);
        
        console.log('\n📋 Detailed Results:');
        this.testResults.forEach((result, index) => {
            const status = result.status === 'SUCCESS' ? '✅' : '❌';
            console.log(`${index + 1}. ${status} ${result.tool} (${result.duration || 'N/A'}ms)`);
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });

        // Save results to file
        const resultsFile = join(__dirname, 'test-results.json');
        writeFileSync(resultsFile, JSON.stringify(this.testResults, null, 2));
        console.log(`\n💾 Detailed results saved to: ${resultsFile}`);
    }

    async cleanup() {
        if (this.serverProcess) {
            console.log('\n🛑 Stopping MCP Server...');
            this.serverProcess.kill();
        }
    }
}

// Main execution
async function main() {
    const client = new MCPTestClient();
    
    try {
        await client.startServer();
        await client.runAllTests();
    } catch (error) {
        console.error('💥 Test execution failed:', error);
    } finally {
        await client.cleanup();
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, cleaning up...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, cleaning up...');
    process.exit(0);
});

main().catch(console.error);
