import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export default function MovieCardSkeleton() {
  return (
    <Card aria-hidden="true" sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" animation="wave" sx={{ aspectRatio: '2 / 3', height: 'auto' }} />
      <CardContent>
        <Skeleton variant="text" width="80%" sx={{ fontSize: '1.25rem' }} />
        <Stack direction="row" justifyContent="space-between">
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="20%" />
        </Stack>
      </CardContent>
    </Card>
  );
}
