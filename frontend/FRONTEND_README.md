# MCP IBM i Frontend - Setup Instructions

## 🚀 Quick Start

This Angular application provides a modern chat interface for interacting with IBM i Building Supply systems through Claude AI and MCP (Model Context Protocol).

### Prerequisites

- Node.js 18+ installed
- Angular CLI installed (`npm install -g @angular/cli`)
- Claude API key from Anthropic

### Running the Application

**Important:** Both frontend and backend servers must be running for the application to work properly.

#### 1. Start the Backend Proxy Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

The backend server will run on `http://localhost:3000`

#### 2. Start the Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
ng serve
```

The frontend application will run on `http://localhost:4200`

### 🎯 How to Use

1. **Open your browser** and navigate to `http://localhost:4200`
2. **Enter your Claude API Key** when prompted
3. **Start chatting** with the IBM i Building Supply assistant

### 🔧 Configuration

#### Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=3000
MCP_SERVER_URL=http://localhost:8080
```

#### Frontend Environment

Update `frontend/src/environments/environment.ts` if needed:

```typescript
export const environment = {
  production: false,
  claudeApiUrl: 'http://localhost:3000/api/claude/messages'
};
```

### 🛠 Available Features

- **Invoice Queries**: Search invoices by number, customer, or date range
- **Product Search**: Find products and their details
- **Customer Information**: Look up customer details and history
- **Line Item Details**: Get detailed invoice line item information
- **Modern UI**: Professional chat interface with real-time responses
- **Secure API Key Storage**: Local storage with security best practices

### 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular App   │───▶│  Backend Proxy  │───▶│   Claude API    │
│  (Port 4200)    │    │   (Port 3000)   │    │  (Anthropic)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   MCP Server    │
                       │   (Port 8080)   │
                       └─────────────────┘
```

### 🔐 Security

- API keys are stored locally in browser storage
- Backend proxy prevents CORS issues
- No API keys are logged or stored on the server
- Secure communication between all components

### 🐛 Troubleshooting

#### CORS Errors
- Ensure the backend proxy server is running on port 3000
- Check that the frontend is configured to use the proxy URL

#### API Key Issues
- Verify your Claude API key is valid
- Check the API key format (should start with 'sk-ant-')
- Ensure you have sufficient API credits

#### Connection Issues
- Verify both servers are running
- Check console for error messages
- Ensure ports 3000 and 4200 are available

### 📝 Development

#### Building for Production

```bash
# Frontend
cd frontend
ng build --configuration production

# Backend
cd backend
npm start
```

#### Code Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/     # UI components
│   │   ├── services/       # API services
│   │   ├── models/         # TypeScript interfaces
│   │   └── styles/         # Global styles
│   └── environments/       # Environment configs
└── dist/                   # Built application

backend/
├── server.js              # Express proxy server
├── package.json           # Dependencies
└── .env                   # Environment variables
```

### 🤝 Support

For issues and questions:
1. Check the console for error messages
2. Verify all servers are running
3. Check API key validity
4. Review network requests in browser dev tools