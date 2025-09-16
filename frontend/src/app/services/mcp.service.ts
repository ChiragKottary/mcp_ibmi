import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MCPResponse, MCPTool, MCPToolCall } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class McpService {
  private readonly baseUrl = environment.mcpServerUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get list of available tools from MCP server
   */
  getAvailableTools(): Observable<MCPTool[]> {
    return this.http.get<MCPTool[]>(`${this.baseUrl}/tools`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Execute a tool call on the MCP server
   */
  callTool(toolCall: MCPToolCall): Observable<MCPResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      name: toolCall.name,
      arguments: toolCall.arguments
    };

    return this.http.post<MCPResponse>(`${this.baseUrl}/call-tool`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get invoice details by ID
   */
  getInvoiceDetails(invoiceId: number | string): Observable<any> {
    return this.callTool({
      name: 'get_invoice_details',
      arguments: { invoiceId: invoiceId }
    });
  }

  /**
   * Get invoice header by ID
   */
  getInvoiceHeader(invoiceId: number | string): Observable<any> {
    return this.callTool({
      name: 'get_invoice_header',
      arguments: { invoiceId: invoiceId }
    });
  }

  /**
   * Get invoice line items
   */
  getInvoiceLineItems(invoiceNumber: number | string): Observable<any> {
    return this.callTool({
      name: 'get_invoice_line_items',
      arguments: { invoiceNumber: invoiceNumber }
    });
  }

  /**
   * Search invoices with filters
   */
  searchInvoices(filters: {
    customerNumber?: string;
    customerName?: string;
    fromDate?: string;
    toDate?: string;
    orderNumber?: string;
    invoiceNumber?: string;
    limit?: number;
    offset?: number;
  }): Observable<any> {
    return this.callTool({
      name: 'search_invoices',
      arguments: filters
    });
  }

  /**
   * Get all invoices with optional limit
   */
  getAllInvoices(limit?: number): Observable<any> {
    return this.callTool({
      name: 'get_all_invoices',
      arguments: { limit: limit }
    });
  }

  /**
   * Get customer invoices by customer number
   */
  getCustomerInvoices(customerNumber: number | string): Observable<any> {
    return this.callTool({
      name: 'get_customer_invoices',
      arguments: { customerNumber: customerNumber }
    });
  }

  /**
   * Get invoice statistics
   */
  getInvoiceStatistics(filters?: {
    fromDate?: string;
    toDate?: string;
    customerNumber?: string;
  }): Observable<any> {
    return this.callTool({
      name: 'get_invoice_statistics',
      arguments: filters || {}
    });
  }

  /**
   * Get customers with optional search and limit
   */
  getCustomers(search?: string, limit?: number): Observable<any> {
    return this.callTool({
      name: 'get_customers',
      arguments: { search: search, limit: limit }
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('MCP Service Error:', error);
    let errorMessage = 'An error occurred while communicating with the server.';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}