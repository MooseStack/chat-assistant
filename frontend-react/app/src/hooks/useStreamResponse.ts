import { useCallback, useRef } from 'react';
import { useChat } from './useChat';
import { streamChat } from '../services/api';
import { BACKEND_URL } from '../config';

export function useStreamResponse() {
  const { state, dispatch } = useChat();
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      dispatch({ type: 'ADD_USER_MESSAGE', content: message });
      dispatch({ type: 'START_STREAMING' });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat(
          BACKEND_URL,
          state.sessionId,
          message,
          (chunk) => dispatch({ type: 'APPEND_STREAM_CHUNK', chunk }),
          controller.signal,
        );
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          dispatch({
            type: 'APPEND_STREAM_CHUNK',
            chunk: '\n\n*Connection interrupted — partial response shown.*',
          });
        }
      } finally {
        dispatch({ type: 'STOP_STREAMING' });
        abortRef.current = null;
      }
    },
    [state.sessionId, dispatch],
  );

  return { sendMessage, isStreaming: state.isStreaming };
}
