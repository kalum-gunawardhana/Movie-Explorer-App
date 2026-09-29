import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const MovieContext = createContext(null);

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('movie-explorer-favorites', []);

  const isFavorite = useCallback((movieId) => favorites.some((movie) => movie.id === movieId), [favorites]);
  const toggleFavorite = useCallback((movie) => {
    setFavorites((current) => (
      current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie]
    ));
  }, [setFavorites]);

  const value = useMemo(() => ({ favorites, isFavorite, toggleFavorite }), [favorites, isFavorite, toggleFavorite]);
  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used inside MovieProvider.');
  return context;
}
