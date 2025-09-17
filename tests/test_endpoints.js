// Comprehensive endpoint testing script
import axios from 'axios';

const BASE_URL = 'http://pub400.com:3012';

async function testEndpoint(endpoint, description) {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📍 Endpoint: ${endpoint}`);
    
    try {
        const startTime = Date.now();
        const response = await axios.get(`${BASE_URL}${endpoint}`, { timeout: 10000 });
        const duration = Date.now() - startTime;
        
        console.log(`✅ SUCCESS - Status: ${response.status} (${duration}ms)`);
        console.log(`📊 Data returned: ${Array.isArray(response.data?.data) ? response.data.data.length + ' items' : typeof response.data?.data}`);
        
        // Show sample data structure
        if (response.data?.data) {
            if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                console.log(`🔍 Sample fields: ${Object.keys(response.data.data[0]).slice(0, 5).join(', ')}${Object.keys(response.data.data[0]).length > 5 ? '...' : ''}`);
            } else if (typeof response.data.data === 'object') {
                const keys = Object.keys(response.data.data);
                console.log(`🔍 Fields: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
            }
        }
        
        return { success: true, status: response.status, dataType: Array.isArray(response.data?.data) ? 'array' : typeof response.data?.data, count: Array.isArray(response.data?.data) ? response.data.data.length : 1 };
    } catch (error) {
        console.log(`❌ FAILED - ${error.response?.status || 'No response'}: ${error.message}`);
        return { success: false, error: error.message, status: error.response?.status };
    }
}

async function runAllTests() {
    console.log('🚀 Starting comprehensive endpoint testing...\n');
    console.log('🔗 Testing IBM i/DB2 API endpoints at: ' + BASE_URL);
    
    const tests = [
        { endpoint: '/api/direct-invoices?limit=5', description: 'Search Invoices (search_invoices)' },
        { endpoint: '/api/direct-invoice/603891', description: 'Get Invoice Details (get_invoice_details)' },
        { endpoint: '/api/direct-invoice-list?limit=5', description: 'Get All Invoices (get_all_invoices)' },
        { endpoint: '/api/direct-customers?limit=5', description: 'Get Customers (get_customers)' },
        { endpoint: '/api/direct-invoices/stats', description: 'Get Invoice Statistics (get_invoice_statistics)' },
        { endpoint: '/api/direct-customer-invoices/10001', description: 'Get Customer Invoices (get_customer_invoices)' },
        { endpoint: '/api/direct-invoices/603891/items', description: 'Get Invoice Line Items (get_invoice_line_items)' },
        { endpoint: '/api/invoice-header-exec/603891', description: 'Get Invoice Header (get_invoice_header)' }
    ];
    
    const results = [];
    
    for (const test of tests) {
        const result = await testEndpoint(test.endpoint, test.description);
        results.push({ ...test, ...result });
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Summary
    console.log('\n📋 TEST SUMMARY:');
    console.log('='.repeat(60));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    console.log(`❌ Failed: ${failed.length}/${results.length}`);
    
    if (successful.length > 0) {
        console.log('\n✅ Working endpoints:');
        successful.forEach(r => {
            console.log(`   • ${r.description} - ${r.status} (${r.dataType}${r.count ? `, ${r.count} items` : ''})`);
        });
    }
    
    if (failed.length > 0) {
        console.log('\n❌ Failed endpoints:');
        failed.forEach(r => {
            console.log(`   • ${r.description} - ${r.error}`);
        });
    }
    
    console.log('\n🎯 MCP Tool Status:');
    console.log('All endpoints use the same API base, so MCP tool functionality should match these results.');
    console.log('The MCP server applies additional formatting and error handling on top of these API calls.');
}

runAllTests().catch(console.error);
