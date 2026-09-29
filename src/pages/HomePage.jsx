import { useCallback, useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { getTrendingMovies, searchMovies } from '../api/movieApi';
import AppLoader from '../components/common/AppLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import MovieGrid from '../components/movie/MovieGrid';
import SearchBar from '../components/search/SearchBar';
import useDebounce from '../hooks/useDebounce';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { STORAGE_KEYS } from '../utils/constants';

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

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState(readLastSearch);
  const [activeQuery, setActiveQuery] = useState(() => readLastSearch().trim());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debouncedQuery = useDebounce(query, 450);

  useEffect(() => {
    setActiveQuery(debouncedQuery.trim());
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError('');
  }, [debouncedQuery]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const request = activeQuery
      ? searchMovies(activeQuery, page)
      : getTrendingMovies(page);

    request
      .then(({ data }) => {
        if (!active) return;
        const results = Array.isArray(data.results) ? data.results : [];
        setMovies((current) => uniqueMovies(page === 1 ? results : [...current, ...results]));
        setHasMore(page < (Number(data.total_pages) || 1));

        if (activeQuery) saveLastSearch(activeQuery);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message);
        setHasMore(false);
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [activeQuery, page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((current) => current + 1);
  }, [hasMore, loading]);
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading && !error);
  const sectionTitle = activeQuery
    ? `Search results for "${activeQuery}"`
    : 'Trending this week';

  return (
    <Stack spacing={3}>
      <SearchBar value={query} onChange={setQuery} />
      <Typography variant="h4" component="h1">{sectionTitle}</Typography>
      {error && <ErrorMessage message={error} />}
      {loading && page === 1 ? <AppLoader /> : <MovieGrid movies={movies} />}
      {loading && page > 1 && <AppLoader count={5} />}
      <Box ref={sentinelRef} aria-hidden="true" sx={{ height: 1 }} />
    </Stack>
  );
}
