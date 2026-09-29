import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

const MovieContext = createContext(null);

const toFavoriteMovie = (movie) => ({
  id: movie.id,
  title: movie.title || movie.name || 'Untitled movie',
  poster_path: movie.poster_path || null,
  release_date: movie.release_date || '',
  vote_average: Number.isFinite(movie.vote_average) ? movie.vote_average : null,
});

const normalizeFavorites = (movies) => {
  const uniqueMovies = new Map();
  if (!Array.isArray(movies)) return [];

  movies.forEach((movie) => {
    if (movie?.id !== undefined && movie?.id !== null) {
      uniqueMovies.set(movie.id, toFavoriteMovie(movie));
    }
  });

  return [...uniqueMovies.values()];
};

export function MovieProvider({ children }) {
  const [storedFavorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, []);
  const favorites = useMemo(
    () => Array.isArray(storedFavorites) ? storedFavorites : [],
    [storedFavorites],
  );

  useEffect(() => {
    const normalizedFavorites = normalizeFavorites(storedFavorites);
    if (JSON.stringify(storedFavorites) !== JSON.stringify(normalizedFavorites)) {
      setFavorites(normalizedFavorites);
    }
  }, [setFavorites, storedFavorites]);

  const isFavorite = useCallback((movieId) => favorites.some((movie) => movie.id === movieId), [favorites]);
  const addFavorite = useCallback((movie) => {
    if (movie?.id === undefined || movie?.id === null) return;

    setFavorites((current) => {
      const currentFavorites = Array.isArray(current) ? current : [];
      if (currentFavorites.some((item) => item.id === movie.id)) return currentFavorites;
      return [...currentFavorites, toFavoriteMovie(movie)];
    });
  }, [setFavorites]);
  const removeFavorite = useCallback((movieId) => {
    setFavorites((current) => (
      Array.isArray(current) ? current.filter((movie) => movie.id !== movieId) : []
    ));
  }, [setFavorites]);

  const value = useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }), [addFavorite, favorites, isFavorite, removeFavorite]);
  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used inside MovieProvider.');
  return context;
}
