// Direct test of toolsService functions
import { apiService } from './build/services/apiService.js';

async function testAPI() {
    console.log('🧪 Testing API endpoints directly...\n');
    
    try {
        console.log('1. Testing get all invoices API...');
        const allInvoicesResponse = await apiService.getAllInvoices(3);
        console.log('All invoices response:', JSON.stringify(allInvoicesResponse, null, 2));
    } catch (error) {
        console.error('All invoices failed:', error.message);
    }
    
    try {
        console.log('\n2. Testing get customers API...');
        const customersResponse = await apiService.getCustomers(undefined, 3);
        console.log('Customers response:', JSON.stringify(customersResponse, null, 2));
    } catch (error) {
        console.error('Get customers failed:', error.message);
    }
    
    try {
        console.log('\n3. Testing get invoice statistics API...');
        const statsResponse = await apiService.getInvoiceStatistics({});
        console.log('Stats response:', JSON.stringify(statsResponse, null, 2));
    } catch (error) {
        console.error('Get stats failed:', error.message);
    }
}

testAPI().catch(console.error);
