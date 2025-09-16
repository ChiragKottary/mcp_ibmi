import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClaudeMessage, ClaudeResponse, MCPTool } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ClaudeService {
  private readonly proxyUrl = environment.production ? '/api/claude/messages' : 'http://localhost:3000/api/claude/messages';
  private apiKey: string = '';

  constructor(private http: HttpClient) {}

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Send message to Claude with available tools
   */
  sendMessage(
    messages: ClaudeMessage[], 
    availableTools: MCPTool[] = [],
    systemPrompt?: string
  ): Observable<ClaudeResponse> {
    if (!this.apiKey) {
      return throwError(() => new Error('Claude API key not set. Please configure your API key.'));
    }

    const tools = availableTools.map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema
    }));

    const body: any = {
      apiKey: this.apiKey, // Include API key in request body for proxy
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      messages: messages
    };

    if (systemPrompt) {
      body.system = systemPrompt;
    }

    if (tools.length > 0) {
      body.tools = tools;
    }

    // No need for authentication headers since the proxy handles them
    return this.http.post<ClaudeResponse>(this.proxyUrl, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get system prompt for the IBM i Building Supply assistant
   */
  getSystemPrompt(): string {
    return `You are a helpful assistant for IBM i Building Supply company. You have access to various tools to help customers with:

1. Invoice inquiries - Find invoices by number, customer, or date range
2. Product searches - Search for products and their details
3. Customer information - Look up customer details and history
4. Line item details - Get detailed information about invoice line items

When helping customers:
- Be friendly and professional
- Ask clarifying questions if the request is unclear
- Use the appropriate tools to fetch accurate information
- Provide clear, structured responses
- If you can't find specific information, let the customer know and suggest alternatives

Available tools for IBM i system queries:
- get_invoice_by_number: Find a specific invoice by its number
- search_invoices_by_customer: Find all invoices for a customer
- get_invoice_line_items: Get detailed line items for an invoice
- search_products: Search for products by name or description
- get_customer_info: Get customer details and information
- get_invoices_by_date_range: Find invoices within a date range

Always be helpful and try to provide the most relevant information to assist the customer.`;
  }

  private handleError(error: any): Observable<never> {
    console.error('Claude Service Error:', error);
    console.error('Error details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      error: error.error
    });
    
    let errorMessage = 'An error occurred while communicating with Claude API.';
    
    if (error.status === 0) {
      errorMessage = 'Cannot connect to backend server. Please ensure the backend proxy is running on port 3000.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check your Claude API key.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Bad request. Please check your input.';
    } else if (error.status === 500) {
      errorMessage = error.error?.message || 'Server error. Please try again later.';
    } else if (error.error?.error?.message) {
      errorMessage = error.error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}