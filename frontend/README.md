# Build-Mate Chatbot Frontend

An Angular-based chatbot interface that connects to your MCP (Model Context Protocol) server and integrates with Claude AI to provide natural language querying capabilities for your Build-Mate system.

## Features

- 🤖 **AI-Powered Chat Interface**: Natural language conversations with Claude AI
- 🔧 **MCP Integration**: Seamless connection to your MCP server for system queries
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional interface with Material Design
- ⚡ **Real-time Responses**: Instant feedback with typing indicators
- 🔍 **Quick Actions**: Pre-built buttons for common queries
- 🔐 **Secure API Management**: Local storage of API keys for security

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   ng serve
   ```

3. **Open browser:** Navigate to `http://localhost:4200/`

4. **Set up API key:** Enter your Claude API key when prompted

## Usage

### Natural Language Queries
Ask questions in plain English:
- "Find invoice number 12345"
- "Show me all invoices for ABC Company"
- "What products do we have for roofing?"
- "Get customer information for customer code CUST001"

### Quick Actions
Use pre-built buttons for common tasks:
- Find Invoice
- Customer Info  
- Search Products
- Recent Invoices

## Architecture

```
Frontend (Angular) → Claude API → MCP Server → IBM i System
```

## Prerequisites

- Node.js 18+ and npm
- Running MCP server 
- Claude API key from [Anthropic](https://console.anthropic.com/)

## Building for Production

```bash
ng build --configuration production
```

## Configuration

Update environment files in `src/environments/` to configure:
- MCP server URL
- Claude API endpoint
- Application name

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
