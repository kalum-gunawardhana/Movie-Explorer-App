import { BACKDROP_PLACEHOLDER, POSTER_PLACEHOLDER } from './constants';

const imageBaseUrl = process.env.REACT_APP_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';

export const imageUrl = (path, size = 'w500') => path ? `${imageBaseUrl}/${size}${path}` : POSTER_PLACEHOLDER;
export const backdropUrl = (path) => path ? `${imageBaseUrl}/original${path}` : BACKDROP_PLACEHOLDER;
export const formatRuntime = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) return 'Runtime unavailable';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
};
