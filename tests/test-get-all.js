const fetch = require('node-fetch');

async function testGetAllInvoices() {
  try {
    console.log('Testing get all invoices API...');
    const response = await fetch('http://pub400.com:3011/api/v1/invoices?limit=2');
    const data = await response.json();
    console.log('Get all invoices response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testGetAllInvoices();
