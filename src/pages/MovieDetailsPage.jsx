import { useEffect, useMemo, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/movieApi';
import ErrorMessage from '../components/common/ErrorMessage';
import { useMovies } from '../context/MovieContext';
import { formatRuntime } from '../utils/formatters';

const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p/w500';

const getImageUrl = (path, fallback = '') => path ? `${imageBaseUrl}${path}` : fallback;

const formatReleaseDate = (date) => {
  if (!date || Number.isNaN(Date.parse(date))) return 'Release date unavailable';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
};

function DetailsSkeleton() {
  return (
    <Grid container spacing={4} aria-label="Loading movie details" role="status">
      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
        <Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto' }} />
      </Grid>
      <Grid size={{ xs: 12, sm: 8, md: 9 }}>
        <Skeleton variant="text" width="70%" sx={{ fontSize: '4rem' }} />
        <Skeleton variant="text" width="45%" />
        <Skeleton variant="text" height={120} />
      </Grid>
    </Grid>
  );
}

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const { addFavorite, isFavorite, removeFavorite } = useMovies();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');
    setMovie(null);

    getMovieDetails(movieId)
      .then(({ data }) => active && setMovie(data))
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setIsLoading(false));

    return () => { active = false; };
  }, [movieId]);

  const trailer = useMemo(() => {
    const youtubeTrailers = movie?.videos?.results?.filter(
      (video) => video.site === 'YouTube' && video.type === 'Trailer',
    ) || [];

    return youtubeTrailers.find((video) => video.official) || youtubeTrailers[0];
  }, [movie]);

  if (isLoading) return <DetailsSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return <ErrorMessage message="Movie details are unavailable." />;

  const title = movie.title || movie.name || 'Untitled movie';
  const rating = Number.isFinite(movie.vote_average) && movie.vote_average > 0
    ? `${movie.vote_average.toFixed(1)} / 10`
    : 'Not rated';
  const favorite = isFavorite(movie.id);
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const posterUrl = getImageUrl(movie.poster_path, '/images/poster-placeholder.png');
  const backdropUrl = getImageUrl(movie.backdrop_path);
  const favoriteMovie = {
    id: movie.id,
    title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };

  return (
    <Stack spacing={5}>
      <Box
        sx={{
          backgroundColor: 'grey.900',
          backgroundImage: backdropUrl
            ? `linear-gradient(90deg, rgba(0,0,0,.94), rgba(0,0,0,.55)), url(${backdropUrl})`
            : 'linear-gradient(135deg, #171722, #343447)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: 3,
          color: 'common.white',
          overflow: 'hidden',
          p: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Grid container spacing={4} alignItems="end">
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Box
              component="img"
              src={posterUrl}
              alt={`${title} poster`}
              sx={{ aspectRatio: '2 / 3', borderRadius: 2, boxShadow: 8, display: 'block', objectFit: 'cover', width: '100%' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h2" component="h1">{title}</Typography>
              <Typography>
                {formatReleaseDate(movie.release_date)} | {formatRuntime(movie.runtime)} | Rating: {rating}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {movie.genres?.length
                  ? movie.genres.map((genre) => <Chip key={genre.id} label={genre.name} />)
                  : <Typography variant="body2">Genres unavailable</Typography>}
              </Stack>
              <Button
                color="error"
                variant="contained"
                startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => favorite ? removeFavorite(movie.id) : addFavorite(favoriteMovie)}
              >
                {favorite ? 'Remove from favorites' : 'Add to favorites'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box component="section">
        <Typography variant="h4" component="h2" gutterBottom>Overview</Typography>
        <Typography color="text.secondary">
          {movie.overview || 'No overview is available for this movie.'}
        </Typography>
      </Box>

      <Box component="section">
        <Typography variant="h4" component="h2" gutterBottom>Main cast</Typography>
        {cast.length ? (
          <Grid container spacing={2}>
            {cast.map((person) => (
              <Grid key={person.cast_id ?? person.credit_id} size={{ xs: 6, sm: 4, md: 3, lg: 1.5 }}>
                <Stack alignItems="center" spacing={1} textAlign="center">
                  <Avatar
                    src={getImageUrl(person.profile_path)}
                    alt={person.name || 'Cast member'}
                    sx={{ height: 88, width: 88 }}
                  />
                  <Typography fontWeight={600}>{person.name || 'Unknown cast member'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {person.character || 'Role unavailable'}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">Cast information is unavailable.</Typography>
        )}
      </Box>

      <Box component="section">
        <Typography variant="h4" component="h2" gutterBottom>Trailer</Typography>
        {trailer ? (
          <Box sx={{ aspectRatio: '16 / 9', maxWidth: 960 }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${title} trailer`}
              allowFullScreen
            />
          </Box>
        ) : (
          <Typography color="text.secondary">No trailer is available for this movie.</Typography>
        )}
      </Box>
    </Stack>
  );
}
