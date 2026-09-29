import { Alert, Button } from '@mui/material';

export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <Alert
      severity="error"
      action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Retry</Button> : undefined}
    >
      {message}
    </Alert>
  );
}
