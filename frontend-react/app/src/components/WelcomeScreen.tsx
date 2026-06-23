import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function WelcomeScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: 1,
      }}
    >
      <Typography variant="h3" fontWeight={500}>
        ✦ How can I help you today?
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Send a message to start a conversation.
      </Typography>
    </Box>
  );
}
