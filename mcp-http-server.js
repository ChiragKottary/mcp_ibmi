import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.MCP_HTTP_PORT || 8080;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MCP Server Process Management
let mcpProcess = null;
let mcpReady = false;

// Start MCP Server Process
function startMCPServer() {
  return new Promise((resolve, reject) => {
    const mcpServerPath = path.join(__dirname, 'build', 'index.js');
    
    console.log('🚀 Starting MCP Server process...');
    mcpProcess = spawn('node', [mcpServerPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: __dirname
    });

    let initTimeout = setTimeout(() => {
      reject(new Error('MCP Server failed to start within 10 seconds'));
    }, 10000);

    mcpProcess.stderr.on('data', (data) => {
      const output = data.toString();
      console.log('📝 MCP Server:', output.trim());
      
      if (output.includes('MCP Server connected and ready!')) {
        mcpReady = true;
        clearTimeout(initTimeout);
        resolve();
      }
    });

    mcpProcess.on('error', (error) => {
      console.error('❌ MCP Server error:', error);
      clearTimeout(initTimeout);
      reject(error);
    });

    mcpProcess.on('exit', (code) => {
      console.log(`🛑 MCP Server exited with code ${code}`);
      mcpReady = false;
      mcpProcess = null;
    });
  });
}

// Send request to MCP Server
function sendMCPRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    if (!mcpProcess || !mcpReady) {
      return reject(new Error('MCP Server is not ready'));
    }

    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: method,
      params: params
    };

    const timeout = setTimeout(() => {
      reject(new Error('MCP request timeout'));
    }, 30000);

    let responseBuffer = '';
    
    const onData = (data) => {
      responseBuffer += data.toString();
      
      try {
        const lines = responseBuffer.split('\n');
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line) {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              clearTimeout(timeout);
              mcpProcess.stdout.removeListener('data', onData);
              resolve(response);
              return;
            }
          }
        }
        responseBuffer = lines[lines.length - 1];
      } catch (e) {
        // Continue reading
      }
    };

    mcpProcess.stdout.on('data', onData);
    mcpProcess.stdin.write(JSON.stringify(request) + '\n');
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MCP HTTP Server is running',
    mcpReady: mcpReady
  });
});

// List available tools
app.get('/tools', async (req, res) => {
  try {
    if (!mcpReady) {
      return res.status(503).json({
        error: 'MCP Server not ready',
        message: 'Please wait for MCP server to initialize'
      });
    }

    const response = await sendMCPRequest('tools/list');
    
    if (response.error) {
      return res.status(500).json({
        error: 'MCP Error',
        message: response.error.message || 'Unknown error'
      });
    }

    res.json(response.result.tools || []);
  } catch (error) {
    console.error('❌ Error listing tools:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Execute tool call
app.post('/call-tool', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tool name is required'
      });
    }

    if (!mcpReady) {
      return res.status(503).json({
        error: 'MCP Server not ready',
        message: 'Please wait for MCP server to initialize'
      });
    }

    const response = await sendMCPRequest('tools/call', {
      name: name,
      arguments: args || {}
    });

    if (response.error) {
      return res.status(500).json({
        error: 'MCP Tool Error',
        message: response.error.message || 'Tool execution failed'
      });
    }

    res.json(response.result);
  } catch (error) {
    console.error('❌ Error calling tool:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Specific tool endpoints for easier access
app.post('/tools/search_invoices', async (req, res) => {
  try {
    const response = await sendMCPRequest('tools/call', {
      name: 'search_invoices',
      arguments: req.body
    });

    if (response.error) {
      return res.status(500).json({
        error: 'Search Error',
        message: response.error.message
      });
    }

    res.json(response.result);
  } catch (error) {
    console.error('❌ Error searching invoices:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

app.post('/tools/get_invoice_details', async (req, res) => {
  try {
    const response = await sendMCPRequest('tools/call', {
      name: 'get_invoice_details',
      arguments: req.body
    });

    if (response.error) {
      return res.status(500).json({
        error: 'Invoice Error',
        message: response.error.message
      });
    }

    res.json(response.result);
  } catch (error) {
    console.error('❌ Error getting invoice details:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

app.post('/tools/get_invoice_line_items', async (req, res) => {
  try {
    const response = await sendMCPRequest('tools/call', {
      name: 'get_invoice_line_items',
      arguments: req.body
    });

    if (response.error) {
      return res.status(500).json({
        error: 'Line Items Error',
        message: response.error.message
      });
    }

    res.json(response.result);
  } catch (error) {
    console.error('❌ Error getting line items:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

app.post('/tools/get_order_details', async (req, res) => {
  try {
    const response = await sendMCPRequest('tools/call', {
      name: 'get_order_details',
      arguments: req.body
    });

    if (response.error) {
      return res.status(500).json({
        error: 'Order Details Error',
        message: response.error.message
      });
    }

    res.json(response.result);
  } catch (error) {
    console.error('❌ Error getting order details:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MCP HTTP Server...');
  if (mcpProcess) {
    mcpProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down MCP HTTP Server...');
  if (mcpProcess) {
    mcpProcess.kill();
  }
  process.exit(0);
});

// Start the server
async function startServer() {
  try {
    // First, start the MCP server process
    await startMCPServer();
    
    // Then start the HTTP server
    app.listen(PORT, () => {
      console.log(`🌐 MCP HTTP Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Tools list: http://localhost:${PORT}/tools`);
      console.log(`📞 Call tool: POST http://localhost:${PORT}/call-tool`);
      console.log(`🎯 Ready to accept requests!`);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

startServer();