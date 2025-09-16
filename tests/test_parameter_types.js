// Test script to verify all endpoint parameter types are working correctly
import { toolsService } from '../build/services/toolsService.js';

async function testParameterTypes() {
    console.log('🧪 Testing All Endpoint Parameter Types');
    console.log('='.repeat(60));
    
    const tests = [
        {
            name: 'get_invoice_details',
            method: 'getInvoiceDetails',
            args: { invoiceId: 603891 },
            paramType: 'number',
            description: 'Invoice ID as number'
        },
        {
            name: 'get_invoice_header', 
            method: 'getInvoiceHeader',
            args: { invoiceId: 603891 },
            paramType: 'number',
            description: 'Invoice ID as number'
        },
        {
            name: 'get_customer_invoices',
            method: 'getCustomerInvoices', 
            args: { customerNumber: 10001 },
            paramType: 'number',
            description: 'Customer number as number'
        },
        {
            name: 'get_invoice_line_items',
            method: 'getInvoiceLineItems',
            args: { invoiceNumber: 603891 },
            paramType: 'number', 
            description: 'Invoice number as number'
        }
    ];
    
    const results = [];
    
    for (const test of tests) {
        console.log(`\n🔧 Testing: ${test.name}`);
        console.log(`📋 Parameter: ${JSON.stringify(test.args)} (${test.paramType})`);
        console.log(`💡 Description: ${test.description}`);
        
        try {
            const startTime = Date.now();
            const result = await toolsService[test.method](test.args);
            const duration = Date.now() - startTime;
            
            // Check if we got a valid response
            const hasContent = result && result.content && result.content[0] && result.content[0].text;
            const text = hasContent ? result.content[0].text : '';
            const hasData = text.length > 50 && !text.includes('No ') && !text.includes('not found');
            
            console.log(`✅ SUCCESS - Tool executed (${duration}ms)`);
            console.log(`📏 Response length: ${text.length} characters`);
            console.log(`📊 Has data: ${hasData ? 'YES' : 'NO (empty/error response)'}`);
            
            if (text.length > 0) {
                console.log(`📄 Preview: ${text.substring(0, 100)}...`);
            }
            
            results.push({
                ...test,
                success: true,
                hasData,
                duration,
                responseLength: text.length
            });
            
        } catch (error) {
            console.log(`❌ FAILED - ${error.message}`);
            
            results.push({
                ...test,
                success: false,
                error: error.message
            });
        }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 PARAMETER TYPE TEST SUMMARY');
    console.log('='.repeat(60));
    
    const successful = results.filter(r => r.success);
    const withData = results.filter(r => r.success && r.hasData);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Parameter validation passed: ${successful.length}/${results.length}`);
    console.log(`📊 Endpoints returning data: ${withData.length}/${results.length}`);
    console.log(`❌ Failed: ${failed.length}/${results.length}`);
    
    if (successful.length > 0) {
        console.log('\n✅ WORKING ENDPOINTS:');
        successful.forEach(r => {
            const status = r.hasData ? 'WITH DATA' : 'NO DATA';
            console.log(`   • ${r.name} - ${status} (${r.duration}ms)`);
        });
    }
    
    if (failed.length > 0) {
        console.log('\n❌ FAILED ENDPOINTS:');
        failed.forEach(r => {
            console.log(`   • ${r.name} - ${r.error}`);
        });
    }
    
    console.log('\n🎯 CONCLUSIONS:');
    console.log('- All parameter types should now be NUMBER instead of STRING');
    console.log('- Schema validation should accept numeric inputs');
    console.log('- API service methods should handle numbers correctly');
    
    if (failed.length === 0 && withData.length === successful.length) {
        console.log('\n🎉 ALL ENDPOINTS WORKING WITH CORRECT PARAMETER TYPES!');
    } else if (failed.length === 0) {
        console.log('\n⚠️  Parameter types working, but some endpoints may have API issues');
    } else {
        console.log('\n❌ Some endpoints still have parameter type issues');
    }
}

testParameterTypes().catch(console.error);