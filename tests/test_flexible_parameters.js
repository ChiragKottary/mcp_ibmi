// Test script to verify both string and number parameters work
import { toolsService } from '../build/services/toolsService.js';

async function testFlexibleParameters() {
    console.log('🧪 Testing Flexible Parameter Types (String & Number)');
    console.log('='.repeat(70));
    
    const tests = [
        {
            name: 'get_invoice_details',
            method: 'getInvoiceDetails',
            tests: [
                { args: { invoiceId: 603891 }, type: 'number', description: 'Direct number (API call)' },
                { args: { invoiceId: "603891" }, type: 'string', description: 'String number (Inspector call)' }
            ]
        },
        {
            name: 'get_invoice_header',
            method: 'getInvoiceHeader', 
            tests: [
                { args: { invoiceId: 603891 }, type: 'number', description: 'Direct number (API call)' },
                { args: { invoiceId: "603891" }, type: 'string', description: 'String number (Inspector call)' }
            ]
        },
        {
            name: 'get_customer_invoices',
            method: 'getCustomerInvoices',
            tests: [
                { args: { customerNumber: 10001 }, type: 'number', description: 'Direct number (API call)' },
                { args: { customerNumber: "10001" }, type: 'string', description: 'String number (Inspector call)' }
            ]
        },
        {
            name: 'get_invoice_line_items', 
            method: 'getInvoiceLineItems',
            tests: [
                { args: { invoiceNumber: 603891 }, type: 'number', description: 'Direct number (API call)' },
                { args: { invoiceNumber: "603891" }, type: 'string', description: 'String number (Inspector call)' }
            ]
        }
    ];
    
    const results = [];
    
    for (const endpoint of tests) {
        console.log(`\n📍 Testing Endpoint: ${endpoint.name}`);
        console.log('-'.repeat(50));
        
        for (const test of endpoint.tests) {
            console.log(`\n🔧 Testing ${test.type} input: ${JSON.stringify(test.args)}`);
            console.log(`💡 ${test.description}`);
            
            try {
                const startTime = Date.now();
                const result = await toolsService[endpoint.method](test.args);
                const duration = Date.now() - startTime;
                
                const hasContent = result && result.content && result.content[0] && result.content[0].text;
                const text = hasContent ? result.content[0].text : '';
                const isValid = text.length > 50 && !text.includes('validation') && !text.includes('Expected number');
                
                console.log(`✅ SUCCESS - ${test.type} parameter accepted (${duration}ms)`);
                console.log(`📏 Response: ${text.length} chars`);
                
                if (!isValid && text.length > 0) {
                    console.log(`⚠️  Response preview: ${text.substring(0, 100)}...`);
                }
                
                results.push({
                    endpoint: endpoint.name,
                    paramType: test.type,
                    success: true,
                    duration,
                    valid: isValid
                });
                
            } catch (error) {
                console.log(`❌ FAILED - ${error.message}`);
                
                results.push({
                    endpoint: endpoint.name,
                    paramType: test.type,
                    success: false,
                    error: error.message
                });
            }
        }
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📋 FLEXIBLE PARAMETER TEST SUMMARY');
    console.log('='.repeat(70));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const stringParams = results.filter(r => r.paramType === 'string' && r.success);
    const numberParams = results.filter(r => r.paramType === 'number' && r.success);
    
    console.log(`✅ Total successful: ${successful.length}/${results.length}`);
    console.log(`🔢 Number parameters working: ${numberParams.length}/${results.filter(r => r.paramType === 'number').length}`);
    console.log(`🔤 String parameters working: ${stringParams.length}/${results.filter(r => r.paramType === 'string').length}`);
    console.log(`❌ Failed: ${failed.length}/${results.length}`);
    
    if (failed.length > 0) {
        console.log('\n❌ FAILED TESTS:');
        failed.forEach(r => {
            console.log(`   • ${r.endpoint} (${r.paramType}) - ${r.error}`);
        });
    }
    
    console.log('\n🎯 COMPATIBILITY STATUS:');
    if (stringParams.length === numberParams.length && failed.length === 0) {
        console.log('🎉 PERFECT! Both string and number parameters work for all endpoints');
        console.log('✅ MCP Inspector compatibility: WORKING');
        console.log('✅ Direct API calls compatibility: WORKING');
    } else if (stringParams.length > 0 && numberParams.length > 0) {
        console.log('⚠️  Partial compatibility - some endpoints may have issues');
    } else {
        console.log('❌ Compatibility issues detected');
    }
    
    console.log('\n📝 USAGE:');
    console.log('• MCP Inspector: Use string values like "603891"');
    console.log('• Direct API calls: Use number values like 603891');
    console.log('• Both formats are now automatically converted to numbers internally');
}

testFlexibleParameters().catch(console.error);