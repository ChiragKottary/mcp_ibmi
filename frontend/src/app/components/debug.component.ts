import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaudeService } from '../services/claude.service';
import { McpService } from '../services/mcp.service';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="debug-container">
      <h2>Debug Panel</h2>
      
      <div class="test-section">
        <h3>Backend Tests</h3>
        <button (click)="testBackendHealth()" [disabled]="testing">Test Backend Health</button>
        <button (click)="testMcpServer()" [disabled]="testing">Test MCP Server</button>
        <button (click)="testClaudeProxy()" [disabled]="testing">Test Claude Proxy</button>
      </div>

      <div class="api-key-section">
        <h3>API Key Test</h3>
        <input [(ngModel)]="testApiKey" placeholder="Enter Claude API Key" type="password">
        <button (click)="testClaudeWithKey()" [disabled]="testing || !testApiKey">Test Claude API</button>
      </div>

      <div class="results" *ngIf="results.length > 0">
        <h3>Results</h3>
        <div *ngFor="let result of results" [class]="'result-' + result.type">
          <strong>{{result.timestamp}}</strong> - {{result.test}}: {{result.message}}
          <pre *ngIf="result.details">{{result.details}}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .debug-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .test-section, .api-key-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    button {
      margin: 5px;
      padding: 10px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    input {
      margin: 5px;
      padding: 8px;
      width: 300px;
      border: 1px solid #ddd;
      border-radius: 3px;
    }

    .results {
      margin-top: 20px;
    }

    .result-success { color: green; }
    .result-error { color: red; }
    .result-info { color: blue; }

    pre {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 3px;
      font-size: 12px;
      overflow-x: auto;
    }
  `]
})
export class DebugComponent {
  testing = false;
  testApiKey = '';
  results: any[] = [];

  constructor(
    private claudeService: ClaudeService,
    private mcpService: McpService
  ) {}

  private addResult(test: string, type: 'success' | 'error' | 'info', message: string, details?: any) {
    this.results.unshift({
      timestamp: new Date().toLocaleTimeString(),
      test,
      type,
      message,
      details: details ? JSON.stringify(details, null, 2) : null
    });
  }

  async testBackendHealth() {
    this.testing = true;
    try {
      const response = await fetch('http://localhost:3000/health');
      const data = await response.json();
      this.addResult('Backend Health', 'success', 'Backend is running', data);
    } catch (error: any) {
      this.addResult('Backend Health', 'error', 'Backend connection failed', error.message);
    }
    this.testing = false;
  }

  async testMcpServer() {
    this.testing = true;
    try {
      const response = await fetch('http://localhost:8080/health');
      const data = await response.json();
      this.addResult('MCP Server Health', 'success', 'MCP Server is running', data);
      
      // Test tools endpoint
      const toolsResponse = await fetch('http://localhost:8080/tools');
      const tools = await toolsResponse.json();
      this.addResult('MCP Tools', 'success', `Found ${tools.length} tools`, tools.map((t: any) => t.name));
    } catch (error: any) {
      this.addResult('MCP Server Health', 'error', 'MCP Server connection failed', error.message);
    }
    this.testing = false;
  }

  async testClaudeProxy() {
    this.testing = true;
    try {
      const response = await fetch('http://localhost:3000/api/claude/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: 'test-key',
          model: 'claude-3-5-sonnet-20240620',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10
        })
      });
      
      const data = await response.text();
      if (response.status === 400) {
        this.addResult('Claude Proxy', 'info', 'Proxy is working (expected 400 for test key)', data);
      } else {
        this.addResult('Claude Proxy', 'success', 'Proxy responded', data);
      }
    } catch (error: any) {
      this.addResult('Claude Proxy', 'error', 'Claude proxy connection failed', error.message);
    }
    this.testing = false;
  }

  testClaudeWithKey() {
    if (!this.testApiKey) return;
    
    this.testing = true;
    this.claudeService.setApiKey(this.testApiKey);
    
    this.claudeService.sendMessage([
      { role: 'user', content: 'Hello, this is a test message.' }
    ]).subscribe({
      next: (response) => {
        this.addResult('Claude API', 'success', 'Claude API working', response);
      },
      error: (error) => {
        this.addResult('Claude API', 'error', 'Claude API failed', error.message);
      },
      complete: () => {
        this.testing = false;
      }
    });
  }
}