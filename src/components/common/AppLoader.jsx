import { Grid } from '@mui/material';
import MovieCardSkeleton from '../movie/MovieCardSkeleton';

export default function AppLoader({ count = 10 }) {
  return (
    <Grid container spacing={2} role="status" aria-label="Loading movies" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
          <MovieCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
