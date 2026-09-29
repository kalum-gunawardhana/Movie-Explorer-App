import { Grid } from '@mui/material';
import EmptyState from '../common/EmptyState';
import MovieCard from './MovieCard';

export default function MovieGrid({
  movies,
  emptyTitle = 'No movies found',
  emptyMessage = 'Try a different movie title.',
  showRemoveButton = false,
}) {
  if (!movies.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <Grid container spacing={2}>
      {movies.map((movie) => (
        <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
          <MovieCard movie={movie} showRemoveButton={showRemoveButton} />
        </Grid>
      ))}
    </Grid>
  );
}
