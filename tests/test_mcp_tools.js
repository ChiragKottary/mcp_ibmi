// MCP Tool Parameter Type Testing
import { toolsService } from '../build/services/toolsService.js';

async function testMCPTools() {
    console.log('🧪 Testing MCP Tool Parameter Types...\n');
    
    const tests = [
        {
            name: 'get_invoice_details (number parameter)',
            tool: 'getInvoiceDetails',
            args: { invoiceId: "603891" }, // String that will be parsed to number
            expectation: 'Should work with string input that gets converted to number'
        },
        {
            name: 'get_invoice_line_items (number parameter)',
            tool: 'getInvoiceLineItems', 
            args: { invoiceNumber: 603891 }, // Direct number input
            expectation: 'Should work with direct number input'
        },
        {
            name: 'get_invoice_header (number parameter)',
            tool: 'getInvoiceHeader',
            args: { invoiceId: 603891 }, // Direct number input
            expectation: 'Should work with direct number input'
        },
        {
            name: 'search_invoices (mixed parameters)',
            tool: 'searchInvoices',
            args: { limit: 3 },
            expectation: 'Should work with limit parameter'
        }
    ];
    
    for (const test of tests) {
        console.log(`🔧 Testing: ${test.name}`);
        console.log(`💡 Expected: ${test.expectation}`);
        
        try {
            const result = await toolsService[test.tool](test.args);
            console.log(`✅ SUCCESS - Tool executed without errors`);
            console.log(`📝 Response type: ${typeof result.content[0].text}`);
            console.log(`📏 Response length: ${result.content[0].text.length} characters`);
            
            // Check if it contains expected content patterns
            const text = result.content[0].text;
            if (text.includes('Invoice') || text.includes('Customer') || text.includes('Found')) {
                console.log(`✅ Content validation: Response contains expected patterns`);
            } else {
                console.log(`⚠️  Content validation: Response format unexpected`);
            }
            
        } catch (error) {
            console.log(`❌ FAILED - ${error.message}`);
            if (error.message.includes('Zod') || error.message.includes('validation')) {
                console.log(`🔍 Parameter validation error - check schema types`);
            }
        }
        
        console.log(''); // Empty line for readability
    }
    
    console.log('🎯 PARAMETER TYPE SUMMARY:');
    console.log('- get_invoice_details: invoiceId should accept string (converted to number)');
    console.log('- get_invoice_line_items: invoiceNumber should accept number');
    console.log('- get_invoice_header: invoiceId should accept number');
}

testMCPTools().catch(console.error);
