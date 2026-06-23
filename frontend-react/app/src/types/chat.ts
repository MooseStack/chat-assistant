export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  label: string;
  messages: Message[];
}

export interface ChatState {
  sessionId: string;
  messages: Message[];
  chatHistory: Record<string, ChatSession>;
  isStreaming: boolean;
}

export type ChatAction =
  | { type: 'NEW_CHAT' }
  | { type: 'LOAD_CHAT'; sessionId: string }
  | { type: 'ADD_USER_MESSAGE'; content: string }
  | { type: 'START_STREAMING' }
  | { type: 'APPEND_STREAM_CHUNK'; chunk: string }
  | { type: 'STOP_STREAMING' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_HISTORY'; history: Record<string, ChatSession> };
