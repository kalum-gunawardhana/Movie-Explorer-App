export const APP_NAME = 'Movie Explorer';
export const POSTER_PLACEHOLDER = '/images/poster-placeholder.png';
export const BACKDROP_PLACEHOLDER = 'https://placehold.co/1280x720?text=No+backdrop';

const posterPlaceholderSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <rect width="500" height="750" fill="#24242d"/>
    <rect x="145" y="245" width="210" height="160" rx="16" fill="none" stroke="#8f8f9d" stroke-width="12"/>
    <path d="M180 365l55-55 42 42 36-36 42 49" fill="none" stroke="#8f8f9d" stroke-width="12"/>
    <circle cx="300" cy="290" r="20" fill="#8f8f9d"/>
    <text x="250" y="465" fill="#d5d5dc" font-family="sans-serif" font-size="30" text-anchor="middle">No poster available</text>
  </svg>`;

export const POSTER_PLACEHOLDER_DATA_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(posterPlaceholderSvg)}`;

export const STORAGE_KEYS = Object.freeze({
  auth: 'movieExplorerAuth',
  theme: 'movieExplorerTheme',
  lastSearch: 'movieExplorerLastSearch',
  favorites: 'movieExplorerFavorites',
});
