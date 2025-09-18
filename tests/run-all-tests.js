#!/usr/bin/env node
// Comprehensive Test Runner for MCP IBM i Server
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TestRunner {
    constructor() {
        this.tests = [
            {
                name: 'API Endpoints Test',
                file: 'test_endpoints.js',
                description: 'Tests all 8 API endpoints directly',
                timeout: 30000
            },
            {
                name: 'MCP Tools Parameter Validation',
                file: 'test_mcp_tools.js',
                description: 'Tests MCP tool parameter types and validation',
                timeout: 20000
            },
            {
                name: 'Line Items Functionality',
                file: 'test_line_items.js',
                description: 'Tests corrected line items endpoint',
                timeout: 15000
            },
            {
                name: 'Comprehensive Line Items Validation',
                file: 'final_test_line_items.js',
                description: 'Final validation of line items with field mapping',
                timeout: 15000
            },
            {
                name: 'Order Service API Test',
                file: 'test_order_service.js',
                description: 'Tests the new order service endpoint with FOHEPF mapping',
                timeout: 25000
            }
        ];
        this.results = [];
    }

    async runSingleTest(test) {
        console.log(`\n🧪 Running: ${test.name}`);
        console.log(`📄 Description: ${test.description}`);
        console.log(`⏱️  Timeout: ${test.timeout}ms`);
        console.log('-'.repeat(60));

        const startTime = Date.now();
        
        try {
            const { stdout, stderr } = await execAsync(
                `node "${path.join(__dirname, test.file)}"`,
                { 
                    timeout: test.timeout,
                    cwd: path.join(__dirname, '..')
                }
            );

            const duration = Date.now() - startTime;
            
            console.log(stdout);
            if (stderr) {
                console.log('⚠️  Warnings:', stderr);
            }
            
            const success = !stderr.includes('Error') && !stdout.includes('❌ FAILED');
            
            this.results.push({
                ...test,
                success,
                duration,
                output: stdout,
                error: stderr
            });

            console.log(`${success ? '✅' : '❌'} ${test.name}: ${success ? 'PASSED' : 'FAILED'} (${duration}ms)`);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            console.log(`❌ ${test.name}: FAILED - ${error.message}`);
            
            this.results.push({
                ...test,
                success: false,
                duration,
                error: error.message
            });
        }
    }

    async runAllTests() {
        console.log('🚀 IBM i/DB2 MCP Server Test Suite');
        console.log('='.repeat(80));
        console.log(`📅 Started: ${new Date().toLocaleString()}`);
        console.log(`🔗 Target API: http://pub400.com:3012/`);
        console.log(`📂 Test Directory: ${__dirname}`);

        const overallStartTime = Date.now();

        for (const test of this.tests) {
            await this.runSingleTest(test);
        }

        const overallDuration = Date.now() - overallStartTime;
        this.generateSummary(overallDuration);
    }

    generateSummary(overallDuration) {
        console.log('\n' + '='.repeat(80));
        console.log('📋 TEST SUMMARY');
        console.log('='.repeat(80));

        const passed = this.results.filter(r => r.success);
        const failed = this.results.filter(r => !r.success);

        console.log(`✅ Passed: ${passed.length}/${this.results.length}`);
        console.log(`❌ Failed: ${failed.length}/${this.results.length}`);
        console.log(`⏱️  Total Duration: ${overallDuration}ms`);
        console.log(`📅 Completed: ${new Date().toLocaleString()}`);

        if (passed.length > 0) {
            console.log('\n✅ PASSED TESTS:');
            passed.forEach(test => {
                console.log(`   • ${test.name} - ${test.duration}ms`);
            });
        }

        if (failed.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            failed.forEach(test => {
                console.log(`   • ${test.name} - ${test.error || 'Unknown error'}`);
            });
        }

        console.log('\n🎯 OVERALL STATUS:');
        if (failed.length === 0) {
            console.log('🎉 ALL TESTS PASSED! MCP Server is fully functional.');
        } else {
            console.log(`⚠️  ${failed.length} test(s) failed. Review the output above.`);
        }

        console.log('\n📊 ENDPOINT STATUS:');
        console.log('   All 9 MCP endpoints should be working if tests pass:');
        console.log('   • search_invoices, get_invoice_details, get_all_invoices');
        console.log('   • get_customers, get_invoice_statistics, get_customer_invoices');
        console.log('   • get_invoice_line_items, get_invoice_header, get_order_details');
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const runner = new TestRunner();
    runner.runAllTests().catch(console.error);
}

export default TestRunner;
