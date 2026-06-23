import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types/chat';

interface Props {
  message: Message;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === 'user';
  const content = isStreaming ? message.content + '▌' : message.content;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1.5,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          px: 2,
          py: 1.5,
          maxWidth: '75%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2,
          '& p': { m: 0 },
          '& p + p': { mt: 1 },
          '& pre': {
            bgcolor: isUser ? 'primary.dark' : 'grey.200',
            p: 1.5,
            borderRadius: 1,
            overflow: 'auto',
          },
          '& code': {
            fontFamily: 'monospace',
            fontSize: '0.875em',
          },
        }}
      >
        {isUser ? (
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{content}</Typography>
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </Paper>
    </Box>
  );
}
