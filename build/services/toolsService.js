import { apiService } from './apiService.js';
import { z } from 'zod';
import { formatCurrency } from '../utils/formatters.js';
// Tool schemas for validation
export async function askGeminiTool(prompt) {
    return await apiService.askGemini(prompt);
}
// Invoice schemas
export const SearchInvoicesSchema = z.object({
    customerNumber: z.string().optional(),
    customerName: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    orderNumber: z.string().optional(),
    invoiceNumber: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional()
});
export const GetInvoiceDetailsSchema = z.object({
    invoiceId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
});
export const GetAllInvoicesSchema = z.object({
    limit: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val, 10) : val).optional()
});
export const GetCustomerInvoicesSchema = z.object({
    customerNumber: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
});
export const GetInvoiceStatisticsSchema = z.object({
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    customerNumber: z.string().optional()
});
export const GetInvoiceLineItemsSchema = z.object({
    invoiceNumber: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
});
export const GetInvoiceHeaderSchema = z.object({
    invoiceId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
});
// Customer schemas
export const GetCustomersSchema = z.object({
    search: z.string().optional(),
    limit: z.number().optional()
});
// Tool implementations
export class ToolsService {
    async searchInvoices(args) {
        const validatedArgs = SearchInvoicesSchema.parse(args || {});
        const response = await apiService.searchInvoices(validatedArgs);
        if (!response.data || response.data.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: "No invoices found matching your criteria. Please try adjusting your search parameters."
                    }
                ]
            };
        }
        const invoiceList = response.data.map(invoice => `📄 Invoice ${invoice.SOBINR || 'N/A'} - ${invoice.SOKUNA?.trim() || 'Unknown'}\n` +
            `   Amount: ${formatCurrency(parseFloat(invoice.SOSALP || '0') || 0)} | Status: ${invoice.status || 'Active'}\n` +
            `   Order Date: ${invoice.SOBDAT || 'N/A'}${invoice.SOFFDA ? ` | Delivery Date: ${invoice.SOFFDA}` : ''}\n`).join('\n');
        return {
            content: [
                {
                    type: "text",
                    text: `Found ${response.data.length} invoice${response.data.length === 1 ? '' : 's'} matching your criteria:\n\n${invoiceList}\n\n` +
                        `${response.pagination ? `Page ${response.pagination.page} of ${response.pagination.pages} (${response.pagination.total} total)` : ''}\n\n` +
                        `Is there anything else I can help you with today?`
                }
            ]
        };
    }
    async getInvoiceDetails(args) {
        const validatedArgs = GetInvoiceDetailsSchema.parse(args || {});
        const response = await apiService.getInvoiceDetails(validatedArgs.invoiceId);
        if (!response.data) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No invoice found with ID: ${validatedArgs.invoiceId}. Please check the ID and try again.`
                    }
                ]
            };
        }
        const { header, details, summary } = response.data;
        const statusEmoji = {
            'paid': '✅',
            'pending': '⏳',
            'overdue': '⚠️',
            'draft': '📝'
        };
        const lineItemsList = details.map(item => `   • ${item.SDTEK1?.trim() || item.description || 'No description'} (${item.SDVARE?.trim() || item.itemNumber || 'N/A'})\n` +
            `     Quantity: ${parseFloat(item.SDANTA || '0') || item.quantity || 0} ${item.SDENH1?.trim() || item.unit || ''} @ ${formatCurrency(parseFloat(item.SDSAPR || '0') || item.salesPrice || 0)} each = ${formatCurrency(parseFloat(item.SDSALG || '0') || item.totalAmount || 0)}`).join('\n');
        return {
            content: [
                {
                    type: "text",
                    text: `📄 Invoice Details for ${header.SONUMM || header.invoiceNumber || 'N/A'}:\n\n` +
                        `Customer: ${(header.SOKUNA || header.customerName)?.trim() || 'Unknown'} (${header.SOKUND || header.customerNumber || 'N/A'})\n` +
                        `Order Number: ${header.SONUMM || header.orderNumber || 'N/A'}\n` +
                        `Amount: ${formatCurrency(summary.totalAmount)} (VAT: ${formatCurrency(summary.totalVAT)}, Total: ${formatCurrency(summary.grandTotal)})\n` +
                        `Status: ${statusEmoji[header.status] || '❓'} ${header.status || 'Active'}\n` +
                        `Order Date: ${header.SOBDAT || header.orderDate}\n` +
                        (header.SOLDAT || header.deliveryDate ? `Delivery Date: ${header.SOLDAT || header.deliveryDate}\n` : '') +
                        `\nItems (${summary.totalLines}):\n${lineItemsList}\n\n` +
                        `Is there anything else I can help you with today?`
                }
            ]
        };
    }
    async getAllInvoices(args) {
        const validatedArgs = GetAllInvoicesSchema.parse(args || {});
        const response = await apiService.getAllInvoices(validatedArgs.limit);
        if (!response.data || response.data.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: "No invoices found in the system."
                    }
                ]
            };
        }
        const invoiceList = response.data.slice(0, 10).map(invoice => `📄 Invoice ${invoice.INVOICENUMBER || invoice.SONUMM || 'N/A'} - ${(invoice.CUSTOMERNAME || invoice.SOKUNA)?.trim() || 'Unknown'}\n` +
            `   Amount: ${formatCurrency(parseFloat(invoice.TOTALAMOUNT || invoice.SOSALP || '0') || 0)} | Status: Active\n` +
            `   Order Date: ${invoice.ORDERDATE || invoice.SOBDAT || 'N/A'} | Delivery: ${invoice.DELIVERYDATE || invoice.SOLDAT || 'N/A'}\n`).join('\n');
        const totalShown = Math.min(10, response.data.length);
        const totalRemaining = response.data.length - totalShown;
        return {
            content: [
                {
                    type: "text",
                    text: `${response.count || response.data.length} total invoices found:\n\n` +
                        `${invoiceList}\n\n` +
                        `${totalRemaining > 0 ? `...and ${totalRemaining} more invoice(s) not shown.` : ''}\n\n` +
                        `Is there anything else I can help you with today?`
                }
            ]
        };
    }
    async getCustomerInvoices(args) {
        const validatedArgs = GetCustomerInvoicesSchema.parse(args || {});
        const response = await apiService.getCustomerInvoices(validatedArgs.customerNumber);
        if (!response.data || !response.data.invoices || response.data.invoices.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No invoices found for customer ${validatedArgs.customerNumber}.`
                    }
                ]
            };
        }
        const { customerName, customerNumber, invoiceCount, totalValue, invoices } = response.data;
        const invoiceList = invoices.slice(0, 10).map(invoice => `📄 Invoice ${invoice.invoiceNumber || 'N/A'} - ${formatCurrency(invoice.invoiceAmount)} | ${invoice.status || 'Unknown'}\n` +
            `   Order Date: ${invoice.orderDate || 'N/A'}\n`).join('\n');
        return {
            content: [
                {
                    type: "text",
                    text: `👤 Customer: ${customerName || 'Unknown'} (${customerNumber || 'N/A'})\n\n` +
                        `Found ${invoiceCount || 0} invoice(s) with total value: ${formatCurrency(totalValue)}\n\n` +
                        `${invoiceList}\n\n` +
                        `${invoices.length > 10 ? `...and ${invoices.length - 10} more invoice(s) not shown.` : ''}\n\n` +
                        `Is there anything else I can help you with today?`
                }
            ]
        };
    }
    async getInvoiceStatistics(args) {
        const validatedArgs = GetInvoiceStatisticsSchema.parse(args || {});
        const response = await apiService.getInvoiceStatistics(validatedArgs);
        if (!response.data) {
            return {
                content: [
                    {
                        type: "text",
                        text: "No invoice statistics available. Please try again later."
                    }
                ]
            };
        }
        const { overview, monthly, topCustomers } = response.data;
        // Format monthly data
        const monthlyStats = monthly.slice(0, 5).map(month => `📅 ${month.YEAR || 'N/A'}/${month.MONTH || 'N/A'}: ${month.INVOICECOUNT || month.invoiceCount || 0} invoices, ${formatCurrency(parseFloat(String(month.TOTALAMOUNT || month.totalAmount || '0')) || 0)}`).join('\n');
        // Format top customers
        const topCustomersList = topCustomers.slice(0, 5).map((customer, idx) => `${idx + 1}. ${customer.CUSTOMERNAME?.trim() || customer.customerName || 'Unknown'} (${customer.CUSTOMERNUMBER || customer.customerNumber || 'N/A'}): ${customer.INVOICECOUNT || customer.invoiceCount || 0} invoices, ${formatCurrency(parseFloat(String(customer.TOTALAMOUNT || customer.totalAmount || '0')) || 0)}`).join('\n');
        return {
            content: [
                {
                    type: "text",
                    text: `📊 Invoice Statistics:\n\n` +
                        `Total: ${overview.INVOICECOUNT || overview.invoiceCount || 0} invoices, ${formatCurrency(parseFloat(String(overview.TOTALAMOUNT || overview.totalAmount || '0')) || 0)}\n\n` +
                        `Monthly Breakdown (Top 5):\n${monthlyStats}\n\n` +
                        `Top Customers:\n${topCustomersList}\n\n` +
                        `Is there anything else I can help you with today?`
                }
            ]
        };
    }
    async getInvoiceLineItems(args) {
        const validatedArgs = GetInvoiceLineItemsSchema.parse(args || {});
        const response = await apiService.getInvoiceLineItems(validatedArgs.invoiceNumber);
        if (!response.data || response.data.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No line items found for invoice ${validatedArgs.invoiceNumber}.`
                    }
                ]
            };
        }
        const lineItemsList = response.data.map(item => `• Line ${item.SDLINE || item.lineNumber || 'N/A'}: ${(item.SDTEK1 || item.description || 'No description').trim()} (${(item.SDVARE || item.itemNumber || 'N/A').trim()})\n` +
            `  Quantity: ${parseFloat(item.SDANTA || '0') || item.quantity || 0} ${(item.SDENH1 || item.unit || '').trim()} @ ${formatCurrency(parseFloat(item.SDSAPR || '0') || item.salesPrice || 0)} = ${formatCurrency(parseFloat(item.SDSALG || '0') || item.totalAmount || 0)}`).join('\n\n');
        return {
            content: [
                {
                    type: "text",
                    text: `📄 Line items for invoice ${validatedArgs.invoiceNumber}:\n\n` +
                        `${lineItemsList}\n\n` +
                        `Total items: ${response.data.length}\n\n` +
                        `Is there anything else I can help you with today?`
                }
            ]
        };
    }
    async getInvoiceHeader(args) {
        const validatedArgs = GetInvoiceHeaderSchema.parse(args || {});
        const response = await apiService.getInvoiceHeader(validatedArgs.invoiceId);
        if (!response.data) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No invoice header found with ID: ${validatedArgs.invoiceId}.`
                    }
                ]
            };
        }
        const invoice = response.data;
        const statusEmoji = {
            'paid': '✅',
            'pending': '⏳',
            'overdue': '⚠️',
            'draft': '📝'
        };
        return {
            content: [
                {
                    type: "text",
                    text: `📄 Invoice Header for ${invoice.invoiceNumber || 'N/A'}:\n\n` +
                        `Customer: ${invoice.customerName || 'Unknown'} (${invoice.customerNumber || 'N/A'})\n` +
                        `Order Number: ${invoice.orderNumber || 'N/A'}\n` +
                        `Amount: ${formatCurrency(invoice.invoiceAmount)}\n` +
                        `Status: ${statusEmoji[invoice.status] || '❓'} ${invoice.status}\n` +
                        `Order Date: ${invoice.orderDate}\n` +
                        (invoice.deliveryDate ? `Delivery Date: ${invoice.deliveryDate}\n` : '') +
                        `\nIs there anything else I can help you with today?`
                }
            ]
        };
    }
    async getCustomers(args) {
        const validatedArgs = GetCustomersSchema.parse(args || {});
        const response = await apiService.getCustomers(validatedArgs.search, validatedArgs.limit);
        if (!response.data || response.data.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: "No customers found matching your criteria."
                    }
                ]
            };
        }
        const customersList = response.data.slice(0, 10).map(customer => `👤 ${(customer.SOKUNA || customer.CUSTOMERNAME || customer.customerName)?.trim() || 'Unknown'} (${customer.SOLKUN || customer.CUSTOMERNUMBER || customer.customerNumber || 'N/A'})` +
            (customer.SOSTED || customer.city ? `\n   Location: ${(customer.SOSTED || customer.city)?.trim() || 'N/A'}` : '') +
            (customer.contactPerson ? `\n   Contact: ${customer.contactPerson}` : '')).join('\n\n');
        return {
            content: [
                {
                    type: "text",
                    text: `Found ${response.count || response.data.length} customer(s):\n\n` +
                        `${customersList}\n\n` +
                        `${response.data.length > 10 ? `...and ${response.data.length - 10} more customer(s) not shown.` : ''}\n\n` +
                        `Is there anything else I can help you with today?`
                }
            ]
        };
    }
}
// Export singleton instance
export const toolsService = new ToolsService();
export default toolsService;
