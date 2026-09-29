import { Grid } from '@mui/material';
import EmptyState from '../common/EmptyState';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies }) {
  if (!movies.length) {
    return <EmptyState title="No movies found" message="Try a different movie title." />;
  }

  return (
    <Grid container spacing={2}>
      {movies.map((movie) => (
        <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
          <MovieCard movie={movie} />
        </Grid>
      ))}
    </Grid>
  );
}
