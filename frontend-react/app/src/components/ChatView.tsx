import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useChat } from '../hooks/useChat';
import { useStreamResponse } from '../hooks/useStreamResponse';
import WelcomeScreen from './WelcomeScreen';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function ChatView() {
  const { state } = useChat();
  const { sendMessage, isStreaming } = useStreamResponse();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {state.messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {state.messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              isStreaming={
                isStreaming && i === state.messages.length - 1 && msg.role === 'assistant'
              }
            />
          ))}
          <div ref={bottomRef} />
        </Box>
      )}
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </Box>
  );
}
