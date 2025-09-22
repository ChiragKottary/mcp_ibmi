import { apiService } from './apiService.js';
import { z } from 'zod';
import { safeToFixed, formatCurrency } from '../utils/formatters.js';

// Tool schemas for validation
export async function askGeminiTool(prompt: string) {
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
    customerNo: z.string(),
    companyId: z.union([z.number(), z.string()]).transform((val) => {
        const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
        return isNaN(parsed) ? 0 : parsed;
    }).optional().default(0),
    offset: z.union([z.number(), z.string()]).transform((val) => {
        const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
        return isNaN(parsed) ? 0 : parsed;
    }).optional().default(0),
    limit: z.union([z.number(), z.string()]).transform((val) => {
        const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
        return isNaN(parsed) ? 10 : parsed;
    }).optional().default(10)
});

export const GetCustomerProjectInvoicesSchema = z.object({
    customerNo: z.string(),
    projectNo: z.string(),
    companyId: z.union([z.number(), z.string()]).transform((val) => {
        const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
        return isNaN(parsed) ? 0 : parsed;
    }).optional().default(0),
    offset: z.union([z.number(), z.string()]).transform((val) => {
        const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
        return isNaN(parsed) ? 0 : parsed;
    }).optional().default(0),
    limit: z.union([z.number(), z.string()]).transform((val) => {
        const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
        return isNaN(parsed) ? 10 : parsed;
    }).optional().default(10)
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

// Order service schemas
export const GetOrderDetailsSchema = z.object({
    externalSystem: z.string().optional().default('NEXSTEP'),
    orderNumber: z.string().transform((val) => {
        // If the order number doesn't contain a dash, add -0 suffix
        if (!val.includes('-')) {
            return `${val}-0`;
        }
        return val;
    }),
    forUpdate: z.boolean().optional().default(false),
    lockSource: z.string().optional().default('NGN'),
    includeDeleted: z.boolean().optional().default(true)
});

// Tool implementations
export class ToolsService {

    async getOrderDetails(args: any) {
        const validatedArgs = GetOrderDetailsSchema.parse(args || {});
        const response = await apiService.getOrderDetails(
            validatedArgs.externalSystem,
            validatedArgs.orderNumber, 
            validatedArgs.forUpdate, 
            validatedArgs.lockSource,
            validatedArgs.includeDeleted
        );
        
        if (!response.data) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No order found for external system: ${validatedArgs.externalSystem}, order: ${validatedArgs.orderNumber}. Please check the order number and try again.`
                    }
                ]
            };
        }

        const order = response.data;
        
        // Format order status with emojis
        const statusEmoji: { [key: string]: string } = {
            'DRAFT': '📝',
            'PENDING': '⏳',
            'CONFIRMED': '✅',
            'COMPLETED': '🏁',
            'CANCELLED': '❌'
        };

        // Format order lines
        const orderLinesList = order.orderLines?.slice(0, 10).map((line, idx) => 
            `   ${idx + 1}. ${line.articleText1 || line.articleNo || 'No description'} (${line.articleNo || 'N/A'})\n` +
            `      Quantity: ${line.quantity || 0} ${line.unitCode || ''} @ ${formatCurrency(line.unitPriceExVat || 0)} each\n` +
            `      Total: ${formatCurrency(line.totalDiscountedPriceExVat || 0)} (excl. VAT)\n` +
            `      Status: ${line.externalLineStatus || 'Active'} | Delivery: ${line.deliveryDate || 'TBD'}`
        ).join('\n\n') || 'No order lines available';

        // Map external data to FOHEPF table context
        const fohepfMapping = `
🗂️ **FOHEPF Table Mapping Context:**
• Order Number (FONUMM): ${order.orderNo || 'N/A'}
• Parent Order (FOFIRM): ${order.parentOrderNo || 'N/A'} 
• Order Date (FOBDAT): ${order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
• Delivery Date (FOLDAT): ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
• Customer Number (FOKUND): ${order.customer?.customerNo || 'N/A'}
• Customer Name (FOKUNA): ${order.customer?.name || 'Unknown'}
• Warehouse (FOLAGE): ${order.warehouseNo || 'N/A'}
• Department (FOAVDE): ${order.departmentNo || 'N/A'}
• Currency (FOVALK): ${order.currencyCode || 'N/A'}
• Sales Rep (FOSELG): ${order.salesperson?.code || 'N/A'}
• Delivery Method (FOLMAT): ${order.deliveryType?.code || 'N/A'}
• Our Reference (FOVREF): ${order.ourReference || 'N/A'}
• Customer Reference (FODREF): ${order.customerReference || 'N/A'}
• Order Discount % (FORABP): ${order.orderDiscountPercent || 0}%
• Total Ex VAT (FOTOTS): ${formatCurrency(order.totalDiscountedPriceExVat || 0)}
• Total Inc VAT: ${formatCurrency(order.totalDiscountedPriceIncVat || 0)}`;

        return {
            content: [
                {
                    type: "text",
                    text: `📋 **Order Details for #${order.orderNo || 'N/A'}:**\n\n` +
                        `**Status:** ${statusEmoji[order.orderFlowIndicator] || '❓'} ${order.orderFlowIndicator || 'Unknown'}\n` +
                        `**Customer:** ${order.customer?.name || 'Unknown'} (${order.customer?.customerNo || 'N/A'})\n` +
                        `**Order Date:** ${order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}\n` +
                        `**Delivery Date:** ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}\n` +
                        `**Warehouse:** ${order.warehouseNo || 'N/A'} | **Department:** ${order.departmentNo || 'N/A'}\n` +
                        `**Currency:** ${order.currencyCode || 'N/A'}\n\n` +
                        
                        `**💰 Financial Summary:**\n` +
                        `• Total Purchase Price (ex VAT): ${formatCurrency(order.totalPurchasePriceExVat || 0)}\n` +
                        `• Total Cost Price (ex VAT): ${formatCurrency(order.totalCostPriceExVat || 0)}\n` +
                        `• Order Discount: ${order.orderDiscountPercent || 0}%\n` +
                        `• Total Amount (ex VAT): ${formatCurrency(order.totalDiscountedPriceExVat || 0)}\n` +
                        `• Total Amount (inc VAT): ${formatCurrency(order.totalDiscountedPriceIncVat || 0)}\n\n` +
                        
                        `**📞 Contact Information:**\n` +
                        `• Sales Person: ${order.salesperson?.name || 'N/A'} (${order.salesperson?.code || 'N/A'})\n` +
                        `• Customer Contact: ${order.customerContact?.name || 'N/A'}\n` +
                        `• Our Reference: ${order.ourReference || 'N/A'}\n` +
                        `• Customer Reference: ${order.customerReference || 'N/A'}\n\n` +
                        
                        `**📦 Delivery Information:**\n` +
                        `• Delivery Type: ${order.deliveryType?.name || 'N/A'} (${order.deliveryType?.code || 'N/A'})\n` +
                        `• Delivery Address: ${order.deliveryAddress?.name || 'N/A'}\n` +
                        `  ${order.deliveryAddress?.address1 || ''} ${order.deliveryAddress?.address2 || ''}\n` +
                        `  ${order.deliveryAddress?.postalCode || ''} ${order.deliveryAddress?.city || ''}\n\n` +
                        
                        `**📋 Order Lines (${order.orderLines?.length || 0} items):**\n${orderLinesList}\n\n` +
                        
                        `${order.orderLines?.length && order.orderLines.length > 10 ? `...and ${order.orderLines.length - 10} more line item(s) not shown.\n\n` : ''}` +
                        
                        `${fohepfMapping}\n\n` +
                        
                        `**🔒 Lock Information:**\n` +
                        `• Lock Key: ${order.lockKey || 'N/A'}\n` +
                        `• Locked By: ${order.lockDetails?.lockedByUser || 'N/A'}\n` +
                        `• Lock Source: ${order.lockDetails?.lockSource || 'N/A'}\n\n` +
                        
                        `Is there anything else I can help you with today?`
                }
            ]
        };
    }

    async getCustomerInvoices(args: any) {
        const validatedArgs = GetCustomerInvoicesSchema.parse(args || {});
        const response = await apiService.getCustomerInvoices(
            validatedArgs.companyId, 
            validatedArgs.customerNo, 
            validatedArgs.offset, 
            validatedArgs.limit
        );
        
        if (!response.data || !response.data.invoiceSummaries) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No invoices found for customer: ${validatedArgs.customerNo}. Please check the customer number and try again.`
                    }
                ]
            };
        }

        const invoiceData = response.data;
        const invoices = invoiceData.invoiceSummaries;
        
        // Format invoice status with emojis
        const statusEmoji: { [key: string]: string } = {
            'PAID': '✅',
            'PENDING': '⏳',
            'OVERDUE': '🔴',
            'CANCELLED': '❌',
            'DRAFT': '📝'
        };

        // Format invoice list
        const invoicesList = invoices.slice(0, 10).map((invoice, idx) => 
            `   ${idx + 1}. **Invoice #${invoice.invoiceNo}** (ID: ${invoice.id})\n` +
            `      Customer: ${invoice.customerName} (${invoice.customerNo})\n` +
            `      Date: ${new Date(invoice.invoiceDate).toLocaleDateString()} | Due: ${new Date(invoice.dueDate).toLocaleDateString()}\n` +
            `      Amount (ex VAT): ${formatCurrency(invoice.amountExVAT)}\n` +
            `      Amount (inc VAT): ${formatCurrency(invoice.amountIncVAT)}\n` +
            `      Payment Mode: ${invoice.paymentMode || 'N/A'} | KID: ${invoice.kid || 'N/A'}\n` +
            `      Project: ${invoice.customerProject?.projectName || 'N/A'} (${invoice.customerProject?.projectNo || 'N/A'})`
        ).join('\n\n') || 'No invoices available';

        // Calculate totals
        const totalExVAT = invoices.reduce((sum, inv) => sum + (inv.amountExVAT || 0), 0);
        const totalIncVAT = invoices.reduce((sum, inv) => sum + (inv.amountIncVAT || 0), 0);

        return {
            content: [
                {
                    type: "text",
                    text: `📋 **Customer Invoices for #${validatedArgs.customerNo}:**\n\n` +
                        `**Summary:**\n` +
                        `• Company ID: ${validatedArgs.companyId}\n` +
                        `• Total Invoices: ${invoices.length}\n` +
                        `• Showing: ${Math.min(invoices.length, 10)} invoices (offset: ${invoiceData.offset}, limit: ${invoiceData.limit})\n` +
                        `• Total Amount (ex VAT): ${formatCurrency(totalExVAT)}\n` +
                        `• Total Amount (inc VAT): ${formatCurrency(totalIncVAT)}\n\n` +
                        
                        `**📋 Invoice List:**\n${invoicesList}\n\n` +
                        
                        `${invoices.length > 10 ? `...and ${invoices.length - 10} more invoice(s) not shown. Use offset/limit parameters to see more.\n\n` : ''}` +
                        
                        `**💡 API Information:**\n` +
                        `• Endpoint: GET /api/v2/companies/${validatedArgs.companyId}/customers/${validatedArgs.customerNo}/invoices\n` +
                        `• Offset: ${invoiceData.offset} | Limit: ${invoiceData.limit}\n\n` +
                        
                        `Need more details about a specific invoice? Ask me about invoice details using the invoice ID or number!`
                }
            ]
        };
    }

    async getCustomerProjectInvoices(args: any) {
        const validatedArgs = GetCustomerProjectInvoicesSchema.parse(args || {});
        const response = await apiService.getCustomerProjectInvoices(
            validatedArgs.companyId, 
            validatedArgs.customerNo, 
            validatedArgs.projectNo,
            validatedArgs.offset, 
            validatedArgs.limit
        );
        
        if (!response.data || !response.data.invoiceSummaries) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No invoices found for customer: ${validatedArgs.customerNo}, project: ${validatedArgs.projectNo}. Please check the customer number and project number and try again.`
                    }
                ]
            };
        }

        const invoiceData = response.data;
        const invoices = invoiceData.invoiceSummaries;
        
        // Format invoice status with emojis
        const statusEmoji: { [key: string]: string } = {
            'PAID': '✅',
            'PENDING': '⏳',
            'OVERDUE': '🔴',
            'CANCELLED': '❌',
            'DRAFT': '📝'
        };

        // Format invoice list
        const invoicesList = invoices.slice(0, 10).map((invoice, idx) => 
            `   ${idx + 1}. **Invoice #${invoice.invoiceNo}** (ID: ${invoice.id})\n` +
            `      Customer: ${invoice.customerName} (${invoice.customerNo})\n` +
            `      Date: ${new Date(invoice.invoiceDate).toLocaleDateString()} | Due: ${new Date(invoice.dueDate).toLocaleDateString()}\n` +
            `      Amount (ex VAT): ${formatCurrency(invoice.amountExVAT)}\n` +
            `      Amount (inc VAT): ${formatCurrency(invoice.amountIncVAT)}\n` +
            `      Payment Mode: ${invoice.paymentMode || 'N/A'} | KID: ${invoice.kid || 'N/A'}\n` +
            `      Project: ${invoice.customerProject?.projectName || 'N/A'} (${invoice.customerProject?.projectNo || 'N/A'})`
        ).join('\n\n') || 'No invoices available';

        // Calculate totals
        const totalExVAT = invoices.reduce((sum, inv) => sum + (inv.amountExVAT || 0), 0);
        const totalIncVAT = invoices.reduce((sum, inv) => sum + (inv.amountIncVAT || 0), 0);

        return {
            content: [
                {
                    type: "text",
                    text: `📋 **Project Invoices for Customer #${validatedArgs.customerNo}, Project #${validatedArgs.projectNo}:**\n\n` +
                        `**Summary:**\n` +
                        `• Company ID: ${validatedArgs.companyId}\n` +
                        `• Customer: ${validatedArgs.customerNo}\n` +
                        `• Project: ${validatedArgs.projectNo}\n` +
                        `• Total Invoices: ${invoices.length}\n` +
                        `• Showing: ${Math.min(invoices.length, 10)} invoices (offset: ${invoiceData.offset}, limit: ${invoiceData.limit})\n` +
                        `• Total Amount (ex VAT): ${formatCurrency(totalExVAT)}\n` +
                        `• Total Amount (inc VAT): ${formatCurrency(totalIncVAT)}\n\n` +
                        
                        `**📋 Invoice List:**\n${invoicesList}\n\n` +
                        
                        `${invoices.length > 10 ? `...and ${invoices.length - 10} more invoice(s) not shown. Use offset/limit parameters to see more.\n\n` : ''}` +
                        
                        `**💡 API Information:**\n` +
                        `• Endpoint: GET /api/companies/${validatedArgs.companyId}/customers/${validatedArgs.customerNo}/projects/${validatedArgs.projectNo}/invoices\n` +
                        `• Offset: ${invoiceData.offset} | Limit: ${invoiceData.limit}\n\n` +
                        
                        `Need more details about a specific invoice? Ask me about invoice details using the invoice ID or number!`
                }
            ]
        };
    }
}

// Export singleton instance
export const toolsService = new ToolsService();
export default toolsService;
