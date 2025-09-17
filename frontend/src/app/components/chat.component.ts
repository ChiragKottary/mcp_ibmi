import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../models/chat.models';
import { ChatService } from '../services/chat.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="chat-container">
      <!-- Enhanced Header -->
      <div class="chat-header">
        <div class="status-indicator">
          <div class="status-dot"></div>
          <span>Online</span>
        </div>
        <div class="header-content">
          <div class="app-icon">
            <mat-icon>business</mat-icon>
          </div>
          <div class="header-text">
            <h1>{{ appName }}</h1>
            <p>Your intelligent assistant for Build-Mate queries</p>
          </div>
          <div class="header-actions">
            <button mat-icon-button (click)="toggleTheme()" title="Toggle theme">
              <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
            <button mat-icon-button (click)="clearChat()" title="Clear chat">
              <mat-icon>refresh</mat-icon>
            </button>
            <button mat-icon-button (click)="showSettings()" title="Settings">
              <mat-icon>settings</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Quick Actions -->
      <div class="quick-actions" *ngIf="messages.length <= 1">
        <div class="section-header">
          <mat-icon>bolt</mat-icon>
          <h3>Quick Actions</h3>
        </div>
        <div class="action-grid">
          <div class="action-card" (click)="quickSearch('invoice')">
            <div class="action-icon">
              <mat-icon>receipt_long</mat-icon>
            </div>
            <div class="action-content">
              <h4>Find Invoice</h4>
              <p>Search by invoice number or customer</p>
            </div>
          </div>
          
          <div class="action-card" (click)="quickSearch('customer')">
            <div class="action-icon">
              <mat-icon>person_search</mat-icon>
            </div>
            <div class="action-content">
              <h4>Customer Info</h4>
              <p>Look up customer details and history</p>
            </div>
          </div>
          
          <div class="action-card" (click)="quickSearch('product')">
            <div class="action-icon">
              <mat-icon>inventory_2</mat-icon>
            </div>
            <div class="action-content">
              <h4>Search Products</h4>
              <p>Find products and inventory details</p>
            </div>
          </div>
          
          <div class="action-card" (click)="quickSearch('date')">
            <div class="action-icon">
              <mat-icon>date_range</mat-icon>
            </div>
            <div class="action-content">
              <h4>Recent Invoices</h4>
              <p>View invoices by date range</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Messages Area -->
      <div class="messages-container" #messagesContainer>
        <div class="messages-wrapper">
          <div 
            *ngFor="let message of messages; trackBy: trackByMessageId" 
            class="message"
            [ngClass]="{
              'user-message': message.sender === 'user',
              'assistant-message': message.sender === 'assistant',
              'typing-message': message.isTyping,
              'tool-result': message.type === 'tool-result',
              'error-message': message.type === 'error'
            }"
          >
            <div class="message-avatar">
              <mat-icon *ngIf="message.sender === 'user'">person</mat-icon>
              <mat-icon *ngIf="message.sender === 'assistant' && !message.isTyping && message.type !== 'tool-result'">smart_toy</mat-icon>
              <mat-icon *ngIf="message.type === 'tool-result'">build_circle</mat-icon>
              <mat-icon *ngIf="message.type === 'error'">error</mat-icon>
              <mat-spinner 
                *ngIf="message.isTyping" 
                diameter="24"
                strokeWidth="3">
              </mat-spinner>
            </div>
            
            <div class="message-content">
              <div class="message-bubble">
                <div *ngIf="message.isTyping" class="typing-indicator">
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span class="typing-text">Assistant is thinking...</span>
                </div>
                <div *ngIf="!message.isTyping" [innerHTML]="formatMessage(message.content)"></div>
                <div *ngIf="message.toolName" class="tool-badge">
                  <mat-icon>build</mat-icon>
                  {{ formatToolName(message.toolName) }}
                </div>
              </div>
              <div class="message-metadata" *ngIf="!message.isTyping">
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                <div class="message-actions">
                  <button (click)="copyMessage(message.content)" title="Copy message">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                  <button *ngIf="message.sender === 'assistant'" (click)="regenerateResponse()" title="Regenerate">
                    <mat-icon>refresh</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Input Area -->
      <div class="input-container">
        <div class="input-wrapper">
          <div class="message-input-container">
            <div class="input-actions">
              <button (click)="attachFile()" title="Attach file">
                <mat-icon>attach_file</mat-icon>
              </button>
            </div>
            
            <textarea 
              [(ngModel)]="currentMessage"
              (keydown)="onKeyDown($event)"
              [disabled]="isLoading"
              placeholder="Ask about invoices, products, customers, or anything else..."
              rows="1"
              #messageInput>
            </textarea>
            
            <div class="input-actions">
              <button 
                class="send-button"
                (click)="sendMessage()"
                [disabled]="!currentMessage.trim() || isLoading"
                title="Send message">
                <mat-icon>{{ isLoading ? 'hourglass_empty' : 'send' }}</mat-icon>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Enhanced API Key Warning -->
        <div *ngIf="!hasApiKey" class="api-key-warning">
          <mat-icon>warning</mat-icon>
          <div class="warning-content">
            <div class="warning-title">API Key Required</div>
            <div class="warning-text">Please configure your Claude API key to enable AI-powered responses</div>
          </div>
          <div class="warning-action">
            <button (click)="showApiKeyDialog()">Set API Key</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  hasApiKey = false;
  isDarkMode = false;
  appName = environment.appName;

  private subscription = new Subscription();
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
        this.isLoading = messages.some(m => m.isTyping);
      })
    );

    this.hasApiKey = !!this.chatService.getApiKey();
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
      // Allow line break with Shift+Enter
      return;
    }
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) return;

    if (!this.hasApiKey) {
      this.showApiKeyDialog();
      return;
    }

    const message = this.currentMessage.trim();
    this.currentMessage = '';
    this.resizeTextarea();
    
    this.chatService.sendMessage(message).subscribe();
  }

  quickSearch(type: string): void {
    const prompts = {
      'invoice': 'How can I find a specific invoice? Please guide me through the process.',
      'customer': 'How can I look up customer information and history?',
      'product': 'How can I search for products in our inventory?',
      'date': 'How can I find invoices from a specific date range?'
    };

    const prompt = (prompts as any)[type];
    if (prompt) {
      this.currentMessage = prompt;
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.chatService.clearChat();
  }

  showApiKeyDialog(): void {
    const apiKey = prompt('Please enter your Claude API key:');
    if (apiKey && apiKey.trim()) {
      this.chatService.setApiKey(apiKey.trim());
      this.hasApiKey = true;
      localStorage.setItem('claude_api_key', apiKey.trim());
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  showSettings(): void {
    // TODO: Implement settings dialog
    console.log('Settings clicked - feature coming soon!');
  }

  copyMessage(content: string): void {
    navigator.clipboard.writeText(content).then(() => {
      // TODO: Show toast notification
      console.log('Message copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy message:', err);
    });
  }

  regenerateResponse(): void {
    // TODO: Implement response regeneration
    console.log('Regenerate response - feature coming soon!');
  }

  attachFile(): void {
    // TODO: Implement file attachment
    console.log('Attach file - feature coming soon!');
  }

  formatMessage(content: string): string {
    // Enhanced formatting for better readability
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
      .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
      .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>');
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return timestamp.toLocaleDateString();
  }

  formatToolName(toolName: string): string {
    return toolName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  private updateTheme(): void {
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.removeAttribute('data-theme');
    }
  }

  private resizeTextarea(): void {
    if (this.messageInput?.nativeElement) {
      const textarea = this.messageInput.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}