import {
  createContext,
  useReducer,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatState, ChatAction } from '../types/chat';
import { loadHistory, saveHistory, clearStorage } from '../services/storage';

function saveCurrent(state: ChatState): ChatState['chatHistory'] {
  if (state.messages.length === 0) return state.chatHistory;
  const firstUserMsg = state.messages.find((m) => m.role === 'user');
  const label = firstUserMsg
    ? firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '')
    : 'New Chat';
  return {
    ...state.chatHistory,
    [state.sessionId]: { label, messages: state.messages },
  };
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'NEW_CHAT': {
      const chatHistory = saveCurrent(state);
      return {
        sessionId: uuidv4(),
        messages: [],
        chatHistory,
        isStreaming: false,
      };
    }
    case 'LOAD_CHAT': {
      const session = state.chatHistory[action.sessionId];
      if (!session) return state;
      const chatHistory = saveCurrent(state);
      return {
        sessionId: action.sessionId,
        messages: session.messages,
        chatHistory,
        isStreaming: false,
      };
    }
    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, { role: 'user', content: action.content }],
      };
    case 'START_STREAMING':
      return {
        ...state,
        isStreaming: true,
        messages: [...state.messages, { role: 'assistant', content: '' }],
      };
    case 'APPEND_STREAM_CHUNK': {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      messages[messages.length - 1] = { ...last, content: last.content + action.chunk };
      return { ...state, messages };
    }
    case 'STOP_STREAMING': {
      const chatHistory = saveCurrent({ ...state, isStreaming: false });
      return { ...state, isStreaming: false, chatHistory };
    }
    case 'CLEAR_HISTORY': {
      clearStorage();
      return {
        sessionId: uuidv4(),
        messages: [],
        chatHistory: {},
        isStreaming: false,
      };
    }
    case 'SET_HISTORY':
      return {
        ...state,
        chatHistory: action.history,
      };
    default:
      return state;
  }
}

function initializeState(): ChatState {
  return {
    sessionId: uuidv4(),
    messages: [],
    chatHistory: {},
    isStreaming: false,
  };
}

export const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, null, initializeState);
  const loaded = useRef(false);

  useEffect(() => {
    loadHistory().then((history) => {
      dispatch({ type: 'SET_HISTORY', history });
      loaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (loaded.current) {
      saveHistory(state.chatHistory);
    }
  }, [state.chatHistory]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}
