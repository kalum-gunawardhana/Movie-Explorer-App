import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function MovieFilters({ sortBy, onSortChange }) {
  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="movie-sort-label">Sort by</InputLabel>
      <Select labelId="movie-sort-label" label="Sort by" value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
        <MenuItem value="popularity">Popularity</MenuItem>
        <MenuItem value="rating">Rating</MenuItem>
        <MenuItem value="newest">Newest</MenuItem>
      </Select>
    </FormControl>
  );
}
