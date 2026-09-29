import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      label="Search movies"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
    />
  );
}
