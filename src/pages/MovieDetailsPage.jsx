import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/movieApi';
import AppLoader from '../components/common/AppLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import TrailerDialog from '../components/movie/TrailerDialog';
import { backdropUrl, formatRuntime } from '../utils/formatters';

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(movieId)
      .then(setMovie)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [movieId]);

  const trailer = useMemo(() => movie?.videos?.results?.find((video) => video.site === 'YouTube' && video.type === 'Trailer'), [movie]);
  if (loading) return <AppLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box sx={{ minHeight: 520, p: { xs: 3, md: 6 }, borderRadius: 3, background: `linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.4)), url(${backdropUrl(movie.backdrop_path)}) center/cover`, color: 'white' }}>
      <Stack spacing={2} sx={{ maxWidth: 700 }}>
        <Typography variant="h2" component="h1">{movie.title}</Typography>
        <Typography>{movie.release_date?.slice(0, 4)} · {formatRuntime(movie.runtime)} · ★ {movie.vote_average?.toFixed(1)}</Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {movie.genres?.map((genre) => <Chip key={genre.id} label={genre.name} />)}
        </Stack>
        <Typography variant="h6">{movie.overview}</Typography>
        {trailer && <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => setTrailerOpen(true)} sx={{ alignSelf: 'flex-start' }}>Watch trailer</Button>}
      </Stack>
      <TrailerDialog open={trailerOpen} onClose={() => setTrailerOpen(false)} trailerKey={trailer?.key} title={movie.title} />
    </Box>
  );
}
