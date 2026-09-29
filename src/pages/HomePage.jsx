import { useCallback, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { discoverMovies, getGenres, getTrendingMovies, searchMovies } from '../api/movieApi';
import AppLoader from '../components/common/AppLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import MovieFilters from '../components/movie/MovieFilters';
import MovieGrid from '../components/movie/MovieGrid';
import SearchBar from '../components/search/SearchBar';
import useDebounce from '../hooks/useDebounce';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { STORAGE_KEYS } from '../utils/constants';
import { getFriendlyRequestError, logRequestError, OFFLINE_MESSAGE } from '../utils/errors';

const readLastSearch = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.lastSearch) || '';
  } catch {
    return '';
  }
};

const saveLastSearch = (query) => {
  try {
    window.localStorage.setItem(STORAGE_KEYS.lastSearch, query);
  } catch {
    // Search still works when storage is unavailable.
  }
};

const uniqueMovies = (movies) => {
  const seen = new Set();

  return movies.filter((movie) => {
    const key = movie.id ?? `${movie.title || movie.name}-${movie.release_date}-${movie.poster_path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const initialFilters = { genre: '', year: '', minimumRating: '' };

const filterSearchResults = (movies, filters) => movies.filter((movie) => {
  const matchesGenre = !filters.genre
    || movie.genre_ids?.includes(Number(filters.genre));
  const matchesYear = !filters.year
    || movie.release_date?.startsWith(String(filters.year));
  const matchesRating = !filters.minimumRating
    || (Number(movie.vote_average) || 0) >= Number(filters.minimumRating);

  return matchesGenre && matchesYear && matchesRating;
});

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState(readLastSearch);
  const [activeQuery, setActiveQuery] = useState(() => readLastSearch().trim());
  const [filters, setFilters] = useState(initialFilters);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const isOnline = useOnlineStatus();
  const debouncedQuery = useDebounce(query, 450);
  const hasActiveFilters = Boolean(filters.genre || filters.year || filters.minimumRating);

  useEffect(() => {
    if (!isOnline) return undefined;
    let active = true;
    getGenres()
      .then(({ data }) => {
        if (active) setGenres(Array.isArray(data.genres) ? data.genres : []);
      })
      .catch((requestError) => {
        logRequestError('Unable to load genres', requestError);
        if (active) setGenres([]);
      });

    return () => { active = false; };
  }, [isOnline]);

  useEffect(() => {
    setActiveQuery(debouncedQuery.trim());
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setHasLoaded(false);
    setError('');
  }, [debouncedQuery]);

  useEffect(() => {
    let active = true;

    if (!isOnline) {
      setIsLoading(false);
      setHasLoaded(true);
      setError(OFFLINE_MESSAGE);
      return () => { active = false; };
    }

    setIsLoading(true);
    setError('');

    let request;
    if (activeQuery) {
      request = searchMovies(activeQuery, page);
    } else if (hasActiveFilters) {
      request = discoverMovies({ ...filters, page });
    } else {
      request = getTrendingMovies(page);
    }

    request
      .then(({ data }) => {
        if (!active) return;
        const responseMovies = Array.isArray(data.results) ? data.results : [];
        const results = activeQuery
          ? filterSearchResults(responseMovies, filters)
          : responseMovies;
        setMovies((current) => uniqueMovies(page === 1 ? results : [...current, ...results]));
        setTotalPages(Number(data.total_pages) || 1);

        if (activeQuery) saveLastSearch(activeQuery);
      })
      .catch((requestError) => {
        if (!active) return;
        logRequestError('Unable to load movies', requestError);
        setError(getFriendlyRequestError(requestError, 'Movies could not be loaded. Please try again.'));
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
        setHasLoaded(true);
      });

    return () => { active = false; };
  }, [activeQuery, filters, hasActiveFilters, isOnline, page, retryKey]);

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setHasLoaded(false);
    setError('');
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setHasLoaded(false);
    setError('');
  };

  const retryRequest = () => {
    setError('');
    if (page === 1) setHasLoaded(false);
    setRetryKey((current) => current + 1);
  };

  const loadMore = useCallback(() => {
    if (!isLoading && page < totalPages) {
      setPage((currentPage) => currentPage + 1);
    }
  }, [isLoading, page, totalPages]);
  const canLoadMore = !error && page < totalPages;
  const sentinelRef = useInfiniteScroll(loadMore, canLoadMore && !isLoading);
  const sectionTitle = activeQuery
    ? `Search results for "${activeQuery}"`
    : hasActiveFilters ? 'Discover movies' : 'Trending this week';

  return (
    <Stack spacing={3}>
      <SearchBar value={query} onChange={setQuery} />
      <MovieFilters
        filters={filters}
        genres={genres}
        onChange={handleFilterChange}
        onClear={clearFilters}
        isTextSearch={Boolean(activeQuery)}
      />
      <Typography variant="h4" component="h1">{sectionTitle}</Typography>
      {error && <ErrorMessage message={error} onRetry={retryRequest} />}
      {!hasLoaded || (isLoading && page === 1) ? (
        <AppLoader />
      ) : (!error || movies.length > 0) && (
        <MovieGrid
          movies={movies}
          emptyTitle={activeQuery ? 'No movies found for this search.' : 'No movies match these filters.'}
          emptyMessage={activeQuery ? 'Try another title or clear the filters.' : 'Try clearing or changing the filters.'}
        />
      )}
      {isLoading && page > 1 && (
        <Box role="status" aria-label="Loading more movies" sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={28} />
        </Box>
      )}
      <Box ref={sentinelRef} aria-hidden="true" sx={{ height: 1, overflow: 'hidden', width: '100%' }} />
      {canLoadMore && (
        <Button
          variant="outlined"
          onClick={loadMore}
          disabled={isLoading}
          sx={{ alignSelf: 'center' }}
        >
          {isLoading ? 'Loading...' : 'Load more'}
        </Button>
      )}
    </Stack>
  );
}
