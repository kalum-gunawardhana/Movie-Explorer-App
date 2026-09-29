import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Card, CardActionArea, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';
import { imageUrl } from '../../utils/formatters';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();
  const favorite = isFavorite(movie.id);

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardActionArea onClick={() => navigate(`/movies/${movie.id}`)} sx={{ height: '100%' }}>
        <CardMedia component="img" height="360" image={imageUrl(movie.poster_path)} alt={movie.title} />
        <CardContent>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography variant="h6" noWrap>{movie.title}</Typography>
            <Typography color="text.secondary">{movie.vote_average?.toFixed(1)}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">{movie.release_date?.slice(0, 4) || 'TBA'}</Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        color="error"
        onClick={() => toggleFavorite(movie)}
        sx={{ bgcolor: 'background.paper', position: 'absolute', right: 8, top: 8, '&:hover': { bgcolor: 'background.paper' } }}
      >
        {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
}
