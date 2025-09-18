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
    return `You are a helpful assistant for IBM i Building Supply company. You have access to various tools to help customers with invoice inquiries, product searches, customer information, and line item details.

IMPORTANT RESPONSE GUIDELINES:
- Never explain what tools you're going to use or which functions you're calling
- Never describe your thought process or technical actions
- Don't mention tool names, function calls, or backend operations
- Simply provide the requested information directly and naturally
- Present results in a clean, user-friendly format
- If you need to search or look something up, just do it without announcing it

RESPONSE STYLE:
- Be friendly, professional, and conversational
- Provide clear, well-formatted responses
- Use bullet points, tables, or structured layouts when appropriate
- If information is not found, politely say so without technical details
- Focus on the business value and user needs

WHAT TO AVOID:
- "I'll use the get_invoice_details function..."
- "Let me search using the search_invoices tool..."
- "I'll call the customer lookup function..."
- Technical error messages or function names
- Explanations of what you're about to do

WHAT TO DO INSTEAD:
- Just provide the invoice details when asked
- Simply show the search results
- Directly present the customer information
- Give natural, helpful responses as if you already know the information

Always act as if you have direct access to the information and present it naturally without exposing the technical implementation.`;
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