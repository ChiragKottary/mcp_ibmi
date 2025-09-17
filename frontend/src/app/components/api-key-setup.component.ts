import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-api-key-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="setup-container">
      <!-- Main Setup Card -->
      <div class="setup-card">
        <div class="card-header">
          <div class="header-icon">
            <mat-icon>key</mat-icon>
          </div>
          <div class="header-content">
            <h1>Welcome to Build-Mate Assistant</h1>
            <p>Configure your Claude API key to unlock AI-powered conversations</p>
          </div>
        </div>

        <div class="card-content">
          <div class="setup-steps">
            <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Get Your API Key</h3>
                <p>Visit <a href="https://console.anthropic.com/" target="_blank" class="link">Anthropic's Console</a> to create your account and get your Claude API key.</p>
              </div>
            </div>

            <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Enter Your API Key</h3>
                <div class="api-key-input-group">
                  <div class="input-wrapper">
                    <mat-icon class="input-icon">vpn_key</mat-icon>
                    <input 
                      [(ngModel)]="apiKey"
                      [type]="hideKey ? 'password' : 'text'"
                      placeholder="sk-ant-api03-..."
                      class="api-key-input"
                      (input)="validateApiKey()"
                    >
                    <button 
                      class="toggle-visibility"
                      (click)="hideKey = !hideKey"
                      type="button"
                    >
                      <mat-icon>{{ hideKey ? 'visibility' : 'visibility_off' }}</mat-icon>
                    </button>
                  </div>
                  <div class="validation-feedback" *ngIf="validationMessage">
                    <mat-icon [class]="validationClass">{{ validationIcon }}</mat-icon>
                    <span>{{ validationMessage }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="step" [class.active]="currentStep >= 3">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Start Chatting</h3>
                <p>Begin your conversation with the AI assistant to query your IBM i system.</p>
              </div>
            </div>
          </div>

          <div class="security-notice">
            <div class="notice-icon">
              <mat-icon>shield</mat-icon>
            </div>
            <div class="notice-content">
              <h4>Your Privacy Matters</h4>
              <ul>
                <li>API key is stored locally in your browser only</li>
                <li>Direct communication with Claude API - no proxy servers</li>
                <li>Your conversations are private and secure</li>
                <li>No data is logged or stored on our servers</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="action-buttons">
            <button 
              class="btn btn-secondary"
              (click)="continueWithoutKey()"
            >
              <mat-icon>warning</mat-icon>
              Continue without AI
              <span class="btn-subtitle">Limited functionality</span>
            </button>
            <button 
              class="btn btn-primary"
              (click)="saveApiKey()"
              [disabled]="!isValidApiKey"
              [class.loading]="isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <mat-icon *ngIf="!isLoading">arrow_forward</mat-icon>
              {{ isLoading ? 'Validating...' : 'Save & Continue' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Features Preview -->
      <div class="features-card">
        <div class="features-header">
          <mat-icon>auto_awesome</mat-icon>
          <h2>What you can do</h2>
        </div>
        
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <mat-icon>receipt_long</mat-icon>
            </div>
            <div class="feature-content">
              <h3>Invoice Management</h3>
              <p>Find invoices by number, customer, or date range with natural language queries</p>
              <div class="feature-example">"Show me invoice 12345"</div>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <mat-icon>inventory_2</mat-icon>
            </div>
            <div class="feature-content">
              <h3>Product Search</h3>
              <p>Search inventory and product details using conversational queries</p>
              <div class="feature-example">"Find roofing materials"</div>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <mat-icon>person_search</mat-icon>
            </div>
            <div class="feature-content">
              <h3>Customer Information</h3>
              <p>Look up customer details, history, and account information</p>
              <div class="feature-example">"Customer info for ABC Corp"</div>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <mat-icon>analytics</mat-icon>
            </div>
            <div class="feature-content">
              <h3>Smart Analytics</h3>
              <p>Get insights and analytics from your business data through conversation</p>
              <div class="feature-example">"Sales trends this month"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .setup-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      gap: var(--space-8);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        animation: float 20s ease-in-out infinite;
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .setup-card {
      background: var(--bg-primary);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      max-width: 600px;
      width: 100%;
      overflow: hidden;
      position: relative;
      z-index: 1;
      animation: slideInFromLeft 0.8s ease-out;
    }

    .card-header {
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
      padding: var(--space-8);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: var(--space-4);

      .header-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: var(--shadow-lg);

        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
        }
      }

      .header-content {
        h1 {
          margin: 0 0 var(--space-2) 0;
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--text-primary);
        }

        p {
          margin: 0;
          color: var(--text-secondary);
          font-size: var(--text-base);
        }
      }
    }

    .card-content {
      padding: var(--space-8);
    }

    .setup-steps {
      margin-bottom: var(--space-8);

      .step {
        display: flex;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        position: relative;
        opacity: 0.4;
        transition: all var(--transition-normal);

        &.active {
          opacity: 1;
        }

        &.completed {
          opacity: 0.8;

          .step-number {
            background: var(--success-500);
            color: white;

            &::after {
              content: '✓';
              font-size: var(--text-sm);
            }
          }
        }

        &:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 48px;
          width: 2px;
          height: calc(100% + var(--space-6));
          background: var(--border-color);
          z-index: -1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: var(--gray-300);
          color: var(--gray-600);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: var(--text-base);
          flex-shrink: 0;
          transition: all var(--transition-normal);
        }

        &.active .step-number {
          background: var(--primary-600);
          color: white;
          box-shadow: var(--shadow-md);
        }

        .step-content {
          flex: 1;
          padding-top: var(--space-2);

          h3 {
            margin: 0 0 var(--space-2) 0;
            font-size: var(--text-lg);
            font-weight: 600;
            color: var(--text-primary);
          }

          p {
            margin: 0 0 var(--space-3) 0;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          .link {
            color: var(--primary-600);
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid transparent;
            transition: border-color var(--transition-fast);

            &:hover {
              border-bottom-color: var(--primary-600);
            }
          }
        }
      }
    }

    .api-key-input-group {
      margin-top: var(--space-4);

      .input-wrapper {
        display: flex;
        align-items: center;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: var(--space-4);
        transition: all var(--transition-fast);
        position: relative;

        &:focus-within {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-icon {
          color: var(--text-tertiary);
          margin-right: var(--space-3);
        }

        .api-key-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: var(--font-mono);
          font-size: var(--text-base);
          color: var(--text-primary);
          
          &::placeholder {
            color: var(--text-tertiary);
          }
        }

        .toggle-visibility {
          background: transparent;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);

          &:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }
        }
      }

      .validation-feedback {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-top: var(--space-3);
        padding: var(--space-3);
        border-radius: var(--radius-lg);
        font-size: var(--text-sm);
        animation: fadeIn 0.3s ease-out;

        &.success {
          background: var(--success-50);
          color: var(--success-700);
          border: 1px solid var(--success-200);

          mat-icon {
            color: var(--success-600);
          }
        }

        &.warning {
          background: var(--warning-50);
          color: var(--warning-700);
          border: 1px solid var(--warning-200);

          mat-icon {
            color: var(--warning-600);
          }
        }

        &.error {
          background: var(--error-50);
          color: var(--error-700);
          border: 1px solid var(--error-200);

          mat-icon {
            color: var(--error-600);
          }
        }
      }
    }

    .security-notice {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      display: flex;
      gap: var(--space-4);

      .notice-icon {
        width: 48px;
        height: 48px;
        background: var(--success-100);
        color: var(--success-600);
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }

      .notice-content {
        h4 {
          margin: 0 0 var(--space-3) 0;
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
        }

        ul {
          margin: 0;
          padding-left: var(--space-5);
          color: var(--text-secondary);

          li {
            margin-bottom: var(--space-2);
            line-height: 1.5;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .card-footer {
      padding: var(--space-8);
      border-top: 1px solid var(--border-color);
      background: var(--bg-secondary);

      .action-buttons {
        display: flex;
        gap: var(--space-4);
        justify-content: flex-end;

        .btn {
          position: relative;
          overflow: hidden;

          &.btn-secondary {
            .btn-subtitle {
              display: block;
              font-size: var(--text-xs);
              opacity: 0.7;
              font-weight: 400;
            }
          }

          &.btn-primary {
            min-width: 160px;

            &.loading {
              pointer-events: none;
            }
          }

          mat-spinner {
            margin-right: var(--space-2);
          }
        }
      }
    }

    .features-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: var(--radius-2xl);
      padding: var(--space-8);
      max-width: 500px;
      backdrop-filter: blur(20px);
      box-shadow: var(--shadow-xl);
      position: relative;
      z-index: 1;
      animation: slideInFromRight 0.8s ease-out;

      .features-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-6);

        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          color: var(--primary-600);
        }

        h2 {
          margin: 0;
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--text-primary);
        }
      }

      .features-grid {
        display: grid;
        gap: var(--space-6);
      }

      .feature-item {
        display: flex;
        gap: var(--space-4);
        padding: var(--space-4);
        border-radius: var(--radius-lg);
        transition: all var(--transition-normal);

        &:hover {
          background: var(--bg-secondary);
          transform: translateY(-2px);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
          color: var(--primary-600);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          mat-icon {
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        .feature-content {
          h3 {
            margin: 0 0 var(--space-2) 0;
            font-size: var(--text-base);
            font-weight: 600;
            color: var(--text-primary);
          }

          p {
            margin: 0 0 var(--space-2) 0;
            font-size: var(--text-sm);
            color: var(--text-secondary);
            line-height: 1.5;
          }

          .feature-example {
            font-family: var(--font-mono);
            font-size: var(--text-xs);
            color: var(--primary-600);
            background: var(--primary-50);
            padding: var(--space-2) var(--space-3);
            border-radius: var(--radius-md);
            border: 1px solid var(--primary-200);
          }
        }
      }
    }

    @media (max-width: 1024px) {
      .setup-container {
        flex-direction: column;
        padding: var(--space-4);
      }

      .features-card {
        order: -1;
        max-width: 600px;
      }
    }

    @media (max-width: 768px) {
      .setup-container {
        padding: var(--space-3);
      }

      .card-header {
        padding: var(--space-6);
        flex-direction: column;
        text-align: center;
      }

      .card-content, .card-footer {
        padding: var(--space-6);
      }

      .action-buttons {
        flex-direction: column;

        .btn {
          justify-content: center;
        }
      }

      .features-grid {
        gap: var(--space-4);
      }

      .feature-item {
        padding: var(--space-3);
      }
    }
  `]
})
export class ApiKeySetupComponent implements OnInit {
  apiKey = '';
  hideKey = true;
  currentStep = 1;
  isLoading = false;
  isValidApiKey = false;
  validationMessage = '';
  validationClass = '';
  validationIcon = '';

  constructor(
    private chatService: ChatService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Check if API key is already set
    const existingKey = this.chatService.getApiKey();
    if (existingKey) {
      this.router.navigate(['/chat']);
    }
    
    this.currentStep = 1;
  }

  validateApiKey(): void {
    this.currentStep = 2;
    
    if (!this.apiKey.trim()) {
      this.isValidApiKey = false;
      this.validationMessage = '';
      this.validationClass = '';
      this.validationIcon = '';
      return;
    }

    // Basic validation
    if (!this.apiKey.startsWith('sk-ant-')) {
      this.isValidApiKey = false;
      this.validationMessage = 'Invalid format. Claude API keys start with "sk-ant-"';
      this.validationClass = 'error';
      this.validationIcon = 'error';
      return;
    }

    if (this.apiKey.length < 50) {
      this.isValidApiKey = false;
      this.validationMessage = 'API key appears to be too short';
      this.validationClass = 'warning';
      this.validationIcon = 'warning';
      return;
    }

    // Valid format
    this.isValidApiKey = true;
    this.validationMessage = 'API key format looks correct';
    this.validationClass = 'success';
    this.validationIcon = 'check_circle';
  }

  saveApiKey(): void {
    if (!this.apiKey.trim()) {
      this.snackBar.open('Please enter your API key', 'Close', { duration: 3000 });
      return;
    }

    if (!this.isValidApiKey) {
      this.snackBar.open('Please enter a valid Claude API key', 'Close', { duration: 5000 });
      return;
    }

    this.isLoading = true;
    this.currentStep = 3;

    // Simulate API validation (in a real app, you might want to test the key)
    setTimeout(() => {
      // Save API key
      this.chatService.setApiKey(this.apiKey.trim());
      
      // Store in localStorage for persistence
      localStorage.setItem('claude_api_key', this.apiKey.trim());

      this.snackBar.open('API key saved successfully!', 'Close', { duration: 3000 });
      
      // Navigate to chat
      setTimeout(() => {
        this.router.navigate(['/chat']);
      }, 1000);
    }, 2000);
  }

  continueWithoutKey(): void {
    this.snackBar.open('Continuing without AI. Some features will be limited.', 'Close', { duration: 5000 });
    this.router.navigate(['/chat']);
  }
}