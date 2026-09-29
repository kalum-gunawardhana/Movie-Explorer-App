import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

const currentYear = new Date().getFullYear();
const releaseYears = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);

export default function MovieFilters({ filters, genres, onChange, onClear, isTextSearch }) {
  const hasFilters = Boolean(filters.genre || filters.year || filters.minimumRating);

  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="genre-filter-label">Genre</InputLabel>
          <Select
            labelId="genre-filter-label"
            label="Genre"
            value={filters.genre}
            onChange={(event) => onChange('genre', event.target.value)}
          >
            <MenuItem value="">All genres</MenuItem>
            {genres.map((genre) => <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="year-filter-label">Release year</InputLabel>
          <Select
            labelId="year-filter-label"
            label="Release year"
            value={filters.year}
            onChange={(event) => onChange('year', event.target.value)}
          >
            <MenuItem value="">Any year</MenuItem>
            {releaseYears.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel id="rating-filter-label">Minimum rating</InputLabel>
          <Select
            labelId="rating-filter-label"
            label="Minimum rating"
            value={filters.minimumRating}
            onChange={(event) => onChange('minimumRating', event.target.value)}
          >
            <MenuItem value="">Any rating</MenuItem>
            {[5, 6, 7, 8, 9].map((rating) => <MenuItem key={rating} value={rating}>{rating}+ / 10</MenuItem>)}
          </Select>
        </FormControl>

        {hasFilters && <Button onClick={onClear}>Clear filters</Button>}
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {isTextSearch
          ? 'Filters apply locally to the current text-search results.'
          : 'Filters search all discoverable movies using the TMDb Discover catalog.'}
      </Typography>
    </Stack>
  );
}
