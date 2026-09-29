import { Box, Typography } from '@mui/material';

export default function EmptyState({ title = 'Nothing to show', message }) {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      {message && <Typography color="text.secondary">{message}</Typography>}
    </Box>
  );
}
