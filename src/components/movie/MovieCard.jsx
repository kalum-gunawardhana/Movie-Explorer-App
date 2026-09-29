import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';

export default function MovieCard({ movie = {} }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();
  const hasId = movie.id !== undefined && movie.id !== null;
  const favorite = hasId && isFavorite(movie.id);
  const title = movie.title || movie.name || 'Untitled movie';
  const releaseYear = /^\d{4}/.test(movie.release_date || '')
    ? movie.release_date.slice(0, 4)
    : 'Year unavailable';
  const rating = Number.isFinite(movie.vote_average) && movie.vote_average > 0
    ? movie.vote_average.toFixed(1)
    : 'Not rated';
  const posterUrl = movie.poster_path
    ? `${process.env.REACT_APP_TMDB_IMAGE_URL}${movie.poster_path}`
    : '/images/poster-placeholder.png';

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardActionArea disabled={!hasId} onClick={() => navigate(`/movies/${movie.id}`)} sx={{ height: '100%' }}>
        <Box sx={{ alignItems: 'center', aspectRatio: '2 / 3', bgcolor: 'action.hover', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Typography color="text.secondary" variant="body2">No poster available</Typography>
          <CardMedia
            component="img"
            image={posterUrl}
            alt={`${title} poster`}
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
            sx={{ height: '100%', inset: 0, objectFit: 'cover', position: 'absolute', width: '100%' }}
          />
        </Box>
        <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography variant="h6" noWrap title={title}>{title}</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ whiteSpace: 'nowrap' }}>★ {rating}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">{releaseYear}</Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        color="error"
        disabled={!hasId}
        onClick={() => toggleFavorite(movie)}
        size="small"
        sx={{ bgcolor: 'background.paper', position: 'absolute', right: 8, top: 8, '&:hover': { bgcolor: 'background.paper' } }}
      >
        {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
}
