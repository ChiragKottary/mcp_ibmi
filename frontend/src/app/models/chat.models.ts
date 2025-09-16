import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  type?: 'text' | 'tool-result' | 'error';
  toolName?: string;
  metadata?: any;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface MCPToolCall {
  name: string;
  arguments: any;
}

export interface MCPResponse {
  content: any[];
  isError?: boolean;
  toolCalls?: MCPToolCall[];
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: {
    type: string;
    text?: string;
    tool_use?: {
      id: string;
      name: string;
      input: any;
    };
  }[];
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ChatMessageBuilder {
  static createUserMessage(content: string): ChatMessage {
    return {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
  }

  static createAssistantMessage(content: string, type: 'text' | 'tool-result' | 'error' = 'text'): ChatMessage {
    return {
      id: uuidv4(),
      content,
      sender: 'assistant',
      timestamp: new Date(),
      type
    };
  }

  static createTypingMessage(): ChatMessage {
    return {
      id: uuidv4(),
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
  }
}