import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useChat } from '../hooks/useChat';

export default function Sidebar() {
  const { state, dispatch } = useChat();
  const historyEntries = Object.entries(state.chatHistory);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() => dispatch({ type: 'NEW_CHAT' })}
        sx={{ mb: 2, flexShrink: 0 }}
      >
        New Chat
      </Button>

      <Divider />

      <Typography variant="overline" sx={{ mt: 2, mb: 1, px: 1 }}>
        Chat History
      </Typography>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {historyEntries.length === 0 ? (
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            No previous chats yet.
          </Typography>
        ) : (
          <List dense disablePadding>
            {historyEntries.map(([id, session]) => (
              <ListItemButton
                key={id}
                selected={id === state.sessionId}
                onClick={() => dispatch({ type: 'LOAD_CHAT', sessionId: id })}
              >
                <ListItemText
                  primary={session.label}
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>

      <Divider sx={{ my: 1 }} />

      <Button
        color="error"
        startIcon={<DeleteOutlineIcon />}
        fullWidth
        onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
        disabled={historyEntries.length === 0}
        size="small"
      >
        Clear Chat History
      </Button>
    </Box>
  );
}
