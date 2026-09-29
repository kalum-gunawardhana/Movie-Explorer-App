import { Box, CircularProgress } from '@mui/material';

export default function AppLoader() {
  return (
    <Box role="status" aria-label="Loading" sx={{ display: 'grid', minHeight: 240, placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
}
