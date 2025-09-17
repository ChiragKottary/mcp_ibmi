import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ChatMessage, ChatMessageBuilder, MCPTool, ClaudeMessage } from '../models/chat.models';
import { McpService } from './mcp.service';
import { ClaudeService } from './claude.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private availableTools: MCPTool[] = [];
  private conversationHistory: ClaudeMessage[] = [];

  messages$ = this.messagesSubject.asObservable();

  constructor(
    private mcpService: McpService,
    private claudeService: ClaudeService
  ) {
    this.initializeChat();
  }

  private initializeChat(): void {
    // Load available tools
    this.mcpService.getAvailableTools().subscribe({
      next: (tools) => {
        this.availableTools = tools;
        console.log('Available MCP tools:', tools);
      },
      error: (error) => {
        console.error('Failed to load MCP tools:', error);
        // Continue without tools if MCP server is not available
      }
    });

    // Add welcome message
    const welcomeMessage = ChatMessageBuilder.createAssistantMessage(
      "Hello! I'm your Build-Mate assistant. I can help you with:\n\n" +
      "• Finding invoices by number or customer\n" +
      "• Searching for products\n" +
      "• Looking up customer information\n" +
      "• Getting invoice details and line items\n" +
      "• Finding invoices by date range\n\n" +
      "What can I help you with today?"
    );
    
    this.addMessage(welcomeMessage);
  }

  setApiKey(apiKey: string): void {
    this.claudeService.setApiKey(apiKey);
  }

  getApiKey(): string {
    return this.claudeService.getApiKey();
  }

  sendMessage(content: string): Observable<void> {
    // Add user message
    const userMessage = ChatMessageBuilder.createUserMessage(content);
    this.addMessage(userMessage);

    // Add typing indicator
    const typingMessage = ChatMessageBuilder.createTypingMessage();
    this.addMessage(typingMessage);

    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content });

    // Send to Claude
    return this.claudeService.sendMessage(
      this.conversationHistory,
      this.availableTools,
      this.claudeService.getSystemPrompt()
    ).pipe(
      switchMap(response => {
        // Remove typing indicator
        this.removeTypingMessage();

        return this.processClaudeResponse(response);
      }),
      catchError(error => {
        this.removeTypingMessage();
        const errorMessage = ChatMessageBuilder.createAssistantMessage(
          `I'm sorry, I encountered an error: ${error.message}`,
          'error'
        );
        this.addMessage(errorMessage);
        return of(void 0);
      })
    );
  }

  private processClaudeResponse(response: any): Observable<void> {
    const content = response.content || [];
    
    // Process each content block
    for (const block of content) {
      if (block.type === 'text' && block.text) {
        // Add text response
        const textMessage = ChatMessageBuilder.createAssistantMessage(block.text);
        this.addMessage(textMessage);
        this.conversationHistory.push({ role: 'assistant', content: block.text });
      } else if (block.type === 'tool_use') {
        // Execute tool call
        return this.executeTool(block).pipe(
          map(() => void 0)
        );
      }
    }

    return of(void 0);
  }

  private executeTool(toolUse: any): Observable<void> {
    const toolCall = {
      name: toolUse.name,
      arguments: toolUse.input
    };

    return this.mcpService.callTool(toolCall).pipe(
      switchMap(result => {
        // Add tool result message
        const resultMessage = ChatMessageBuilder.createAssistantMessage(
          this.formatToolResult(toolUse.name, result),
          'tool-result'
        );
        resultMessage.toolName = toolUse.name;
        this.addMessage(resultMessage);

        // Continue conversation with tool result
        const toolResultContent = `Tool ${toolUse.name} returned: ${JSON.stringify(result)}`;
        this.conversationHistory.push({ role: 'assistant', content: toolResultContent });

        // Ask Claude to interpret the results
        return this.claudeService.sendMessage(
          this.conversationHistory,
          this.availableTools,
          this.claudeService.getSystemPrompt() + "\n\nPlease interpret the tool result and provide a helpful response to the user."
        );
      }),
      switchMap(interpretation => {
        return this.processClaudeResponse(interpretation);
      }),
      catchError(error => {
        const errorMessage = ChatMessageBuilder.createAssistantMessage(
          `I encountered an error while using the ${toolUse.name} tool: ${error.message}`,
          'error'
        );
        this.addMessage(errorMessage);
        return of(void 0);
      })
    );
  }

  private formatToolResult(toolName: string, result: any): string {
    try {
      if (result.content && Array.isArray(result.content)) {
        // Format MCP tool results
        return result.content.map((item: any) => {
          if (item.type === 'text') {
            return item.text;
          }
          return JSON.stringify(item);
        }).join('\n');
      }
      
      // Fallback to JSON string
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return `Tool ${toolName} completed but returned unreadable data.`;
    }
  }

  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  private removeTypingMessage(): void {
    const currentMessages = this.messagesSubject.value;
    const filteredMessages = currentMessages.filter(msg => !msg.isTyping);
    this.messagesSubject.next(filteredMessages);
  }

  clearChat(): void {
    this.messagesSubject.next([]);
    this.conversationHistory = [];
    this.initializeChat();
  }

  // Quick action methods
  searchInvoiceByNumber(invoiceNumber: number): void {
    this.sendMessage(`Please find invoice number ${invoiceNumber}`).subscribe();
  }

  searchInvoicesByCustomer(customerName: string): void {
    this.sendMessage(`Please show all invoices for customer ${customerName}`).subscribe();
  }

  searchProducts(productName: string): void {
    this.sendMessage(`Please search for products related to ${productName}`).subscribe();
  }

  getInvoiceLineItems(invoiceNumber: number): void {
    this.sendMessage(`Please show the line items for invoice ${invoiceNumber}`).subscribe();
  }
}