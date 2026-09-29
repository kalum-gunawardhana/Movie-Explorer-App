import { Alert } from '@mui/material';

export default function ErrorMessage({ message = 'Something went wrong.' }) {
  return <Alert severity="error">{message}</Alert>;
}
