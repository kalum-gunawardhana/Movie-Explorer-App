import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h5">That page could not be found.</Typography>
      <Button component={RouterLink} to="/" variant="contained">Back to movies</Button>
    </Stack>
  );
}
