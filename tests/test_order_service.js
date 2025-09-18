/**
 * Test for Order Service API Endpoint
 * Tests the new get_order_details MCP tool
 */

import axios from 'axios';

const MCP_HTTP_BASE_URL = 'http://localhost:8080';
const TEST_ORDER_ID = 7319; // Example order ID from the provided endpoint

async function testOrderDetailsEndpoint() {
    console.log('🧪 Testing Order Service API Endpoint...\n');
    
    try {
        // Test 1: Get order details via MCP HTTP server
        console.log('1️⃣ Testing get_order_details via MCP HTTP server...');
        const mcpResponse = await axios.post(`${MCP_HTTP_BASE_URL}/tools/get_order_details`, {
            orderId: TEST_ORDER_ID,
            forUpdate: false,
            lockSource: 'NGN'
        });
        
        console.log('✅ MCP HTTP Response Status:', mcpResponse.status);
        console.log('📄 MCP Response Preview:', JSON.stringify(mcpResponse.data, null, 2).substring(0, 500) + '...');
        
        // Test 2: Test with different parameters
        console.log('\n2️⃣ Testing with forUpdate=true...');
        const mcpResponseUpdate = await axios.post(`${MCP_HTTP_BASE_URL}/tools/get_order_details`, {
            orderId: TEST_ORDER_ID,
            forUpdate: true,
            lockSource: 'TEST'
        });
        
        console.log('✅ MCP HTTP Response with Update Status:', mcpResponseUpdate.status);
        
        // Test 3: Test via generic call-tool endpoint
        console.log('\n3️⃣ Testing via generic call-tool endpoint...');
        const genericResponse = await axios.post(`${MCP_HTTP_BASE_URL}/call-tool`, {
            name: 'get_order_details',
            arguments: {
                orderId: TEST_ORDER_ID,
                forUpdate: false,
                lockSource: 'NGN'
            }
        });
        
        console.log('✅ Generic Call Tool Response Status:', genericResponse.status);
        
        // Test 4: Test error handling with invalid order ID
        console.log('\n4️⃣ Testing error handling with invalid order ID...');
        try {
            await axios.post(`${MCP_HTTP_BASE_URL}/tools/get_order_details`, {
                orderId: 999999,
                forUpdate: false,
                lockSource: 'NGN'
            });
            console.log('❌ Expected error but got success');
        } catch (error) {
            console.log('✅ Error handling working correctly:', error.response?.status || error.message);
        }
        
        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        
        if (error.response?.status === 503) {
            console.log('💡 Tip: Make sure the MCP HTTP server is running: npm run dev');
        }
    }
}

async function testDirectOrderServiceAPI() {
    console.log('\n🔗 Testing Direct Order Service API...\n');
    
    try {
        // Direct API call to the external service
        const directResponse = await axios.get(`https://apps-order-service.cloud.test.egapps.no/api/orders/${TEST_ORDER_ID}`, {
            params: {
                'for-update': false,
                'lock-source': 'NGN'
            }
        });
        
        console.log('✅ Direct API Response Status:', directResponse.status);
        console.log('📄 Order Details Preview:');
        console.log('   Order No:', directResponse.data.orderNo);
        console.log('   Flow Indicator:', directResponse.data.orderFlowIndicator);
        console.log('   Customer:', directResponse.data.customer?.name);
        console.log('   Total (ex VAT):', directResponse.data.totalDiscountedPriceExVat);
        console.log('   Order Lines:', directResponse.data.orderLines?.length || 0);
        
        // Check FOHEPF mapping fields
        console.log('\n🗂️ FOHEPF Mapping Fields:');
        console.log('   FONUMM (Order Number):', directResponse.data.orderNo);
        console.log('   FOKUND (Customer Number):', directResponse.data.customer?.customerNo);
        console.log('   FOKUNA (Customer Name):', directResponse.data.customer?.name);
        console.log('   FOBDAT (Order Date):', directResponse.data.orderDate);
        console.log('   FOLDAT (Delivery Date):', directResponse.data.deliveryDate);
        console.log('   FOVALK (Currency):', directResponse.data.currencyCode);
        console.log('   FOLAGE (Warehouse):', directResponse.data.warehouseNo);
        
    } catch (error) {
        console.error('❌ Direct API test failed:', error.response?.data || error.message);
    }
}

async function checkMCPServerHealth() {
    console.log('🏥 Checking MCP Server Health...\n');
    
    try {
        const healthResponse = await axios.get(`${MCP_HTTP_BASE_URL}/health`);
        console.log('✅ MCP Server Health:', healthResponse.data);
        
        const toolsResponse = await axios.get(`${MCP_HTTP_BASE_URL}/tools`);
        const orderTool = toolsResponse.data.find(tool => tool.name === 'get_order_details');
        
        if (orderTool) {
            console.log('✅ Order Details Tool Found:', orderTool.name);
            console.log('📝 Tool Description:', orderTool.description);
        } else {
            console.log('❌ Order Details Tool NOT found in available tools');
        }
        
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        console.log('💡 Make sure to start the MCP HTTP server first: npm run dev');
    }
}

// Main test execution
async function runAllTests() {
    console.log('🚀 Starting Order Service Tests...\n');
    console.log('=' .repeat(60));
    
    await checkMCPServerHealth();
    console.log('=' .repeat(60));
    
    await testDirectOrderServiceAPI();
    console.log('=' .repeat(60));
    
    await testOrderDetailsEndpoint();
    console.log('=' .repeat(60));
    
    console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(console.error);
}

export { testOrderDetailsEndpoint, testDirectOrderServiceAPI, checkMCPServerHealth, runAllTests };