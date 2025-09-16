// Test the corrected get_invoice_line_items endpoint
import { toolsService } from './build/services/toolsService.js';

async function testLineItemsEndpoint() {
    console.log('🧪 Testing get_invoice_line_items with corrected endpoint...\n');
    
    try {
        console.log('🔧 Testing with invoice number: 603891');
        const result = await toolsService.getInvoiceLineItems({ invoiceNumber: 603891 });
        
        console.log('✅ SUCCESS - MCP Tool executed successfully!');
        console.log(`📝 Response type: ${typeof result.content[0].text}`);
        console.log(`📏 Response length: ${result.content[0].text.length} characters`);
        
        // Show first 200 characters of response
        const text = result.content[0].text;
        console.log('\n📄 Response preview:');
        console.log('-'.repeat(50));
        console.log(text.substring(0, 200) + (text.length > 200 ? '...' : ''));
        console.log('-'.repeat(50));
        
        // Check for expected content patterns
        if (text.includes('Line items') || text.includes('invoice') || text.includes('Quantity')) {
            console.log('✅ Content validation: Response contains expected line item patterns');
        } else {
            console.log('⚠️  Content validation: Response format may be unexpected');
        }
        
        return true;
    } catch (error) {
        console.log(`❌ FAILED - ${error.message}`);
        return false;
    }
}

// Also test the direct API endpoint
async function testDirectAPI() {
    console.log('\n🌐 Testing direct API endpoint...');
    
    try {
        const axios = (await import('axios')).default;
        const response = await axios.get('http://pub400.com:3011/api/direct-invoices/603891/items');
        
        console.log(`✅ Direct API SUCCESS - Status: ${response.status}`);
        console.log(`📊 Data returned: ${Array.isArray(response.data?.data) ? response.data.data.length + ' items' : typeof response.data?.data}`);
        
        if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            const sampleItem = response.data.data[0];
            console.log(`🔍 Sample item fields: ${Object.keys(sampleItem).slice(0, 5).join(', ')}...`);
        }
        
        return true;
    } catch (error) {
        console.log(`❌ Direct API FAILED - ${error.response?.status || 'No response'}: ${error.message}`);
        return false;
    }
}

async function runTest() {
    const mcpResult = await testLineItemsEndpoint();
    const apiResult = await testDirectAPI();
    
    console.log('\n🎯 FINAL RESULT:');
    console.log(`MCP Tool: ${mcpResult ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`Direct API: ${apiResult ? '✅ WORKING' : '❌ FAILED'}`);
    
    if (mcpResult && apiResult) {
        console.log('\n🎉 get_invoice_line_items endpoint is now fully functional!');
    }
}

runTest().catch(console.error);
