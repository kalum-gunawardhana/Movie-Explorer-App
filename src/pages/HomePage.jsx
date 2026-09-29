import { useCallback, useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { getTrendingMovies, searchMovies } from '../api/movieApi';
import AppLoader from '../components/common/AppLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import MovieGrid from '../components/movie/MovieGrid';
import SearchBar from '../components/search/SearchBar';
import useDebounce from '../hooks/useDebounce';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedQuery]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const request = debouncedQuery.trim()
      ? searchMovies(debouncedQuery.trim(), page)
      : getTrendingMovies(page);

    request
      .then(({ data }) => {
        if (!active) return;
        setMovies((current) => page === 1 ? data.results : [...current, ...data.results]);
        setHasMore(page < data.total_pages);
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [debouncedQuery, page]);

  const loadMore = useCallback(() => setPage((current) => current + 1), []);
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading && !error);
  const sectionTitle = debouncedQuery.trim()
    ? `Search results for “${debouncedQuery.trim()}”`
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
