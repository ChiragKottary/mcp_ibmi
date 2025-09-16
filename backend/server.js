const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log('Request body keys:', Object.keys(req.body || {}));
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MCP Backend Proxy is running' });
});

// Claude API proxy endpoint
app.post('/api/claude/messages', async (req, res) => {
  try {
    const { apiKey, ...claudeRequestBody } = req.body;

    if (!apiKey) {
      return res.status(400).json({ 
        error: 'API key is required',
        message: 'Please provide your Claude API key'
      });
    }

    // Validate the request body has required Claude API fields
    if (!claudeRequestBody.model || !claudeRequestBody.messages) {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Model and messages are required'
      });
    }

    // Forward request to Claude API
    const claudeResponse = await axios.post(
      'https://api.anthropic.com/v1/messages',
      claudeRequestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    // Return the response from Claude API
    res.json(claudeResponse.data);

  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    
    if (error.response) {
      // Handle specific Claude API errors
      const claudeError = error.response.data;
      let errorMessage = claudeError?.error?.message || error.message;
      
      // Special handling for model not found errors
      if (claudeError?.error?.type === 'not_found_error') {
        if (errorMessage.includes('model:')) {
          errorMessage = `Model not found. Please use a valid Claude model like 'claude-3-5-sonnet-20240620' or 'claude-3-haiku-20240307'`;
        }
      }
      
      // Forward the error response from Claude API
      res.status(error.response.status).json({
        error: claudeError?.error?.type || 'Claude API Error',
        message: errorMessage,
        details: claudeError
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({
        error: 'Request Timeout',
        message: 'The request to Claude API timed out'
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to communicate with Claude API'
      });
    }
  }
});

// MCP Server proxy endpoints (for future use)
app.post('/api/mcp/:tool', async (req, res) => {
  try {
    const { tool } = req.params;
    const mcpServerUrl = process.env.MCP_SERVER_URL || 'http://localhost:8080';
    
    // Forward request to MCP server
    const mcpResponse = await axios.post(
      `${mcpServerUrl}/tools/${tool}`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    res.json(mcpResponse.data);

  } catch (error) {
    console.error('MCP Server Error:', error.response?.data || error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data?.error || 'MCP Server Error',
        message: error.response.data?.message || error.message
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to communicate with MCP server'
      });
    }
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MCP Backend Proxy running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Claude API proxy: http://localhost:${PORT}/api/claude/messages`);
});

module.exports = app;