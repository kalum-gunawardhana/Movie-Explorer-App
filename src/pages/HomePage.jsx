import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { getPopularMovies, searchMovies } from '../api/movieApi';
import AppLoader from '../components/common/AppLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import MovieFilters from '../components/movie/MovieFilters';
import MovieGrid from '../components/movie/MovieGrid';
import SearchBar from '../components/search/SearchBar';
import useDebounce from '../hooks/useDebounce';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
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
      : getPopularMovies(page);

    request
      .then((data) => {
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
  const sortedMovies = useMemo(() => [...movies].sort((a, b) => {
    if (sortBy === 'rating') return b.vote_average - a.vote_average;
    if (sortBy === 'newest') return (b.release_date || '').localeCompare(a.release_date || '');
    return b.popularity - a.popularity;
  }), [movies, sortBy]);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">Discover movies</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <SearchBar value={query} onChange={setQuery} />
        <MovieFilters sortBy={sortBy} onSortChange={setSortBy} />
      </Stack>
      {error && <ErrorMessage message={error} />}
      {loading && page === 1 ? <AppLoader /> : <MovieGrid movies={sortedMovies} />}
      {loading && page > 1 && <AppLoader />}
      <Box ref={sentinelRef} aria-hidden="true" sx={{ height: 1 }} />
    </Stack>
  );
}
