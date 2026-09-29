import { Stack, Typography } from '@mui/material';
import MovieGrid from '../components/movie/MovieGrid';
import { useMovies } from '../context/MovieContext';

export default function FavoritesPage() {
  const { favorites } = useMovies();
  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">Your favorites</Typography>
      <MovieGrid movies={favorites} />
    </Stack>
  );
}
