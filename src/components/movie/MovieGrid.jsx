import { Grid } from '@mui/material';
import EmptyState from '../common/EmptyState';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies }) {
  if (!movies.length) {
    return <EmptyState title="No movies found" message="Try another search or change your filters." />;
  }

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <MovieCard movie={movie} />
        </Grid>
      ))}
    </Grid>
  );
}
