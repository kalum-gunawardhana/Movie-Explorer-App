import { useState } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username.trim()) {
      setError('Enter your name to continue.');
      return;
    }
    login(username.trim());
    navigate(location.state?.from?.pathname || '/', { replace: true });
  };

  return (
    <Box sx={{ display: 'grid', minHeight: '100vh', p: 2, placeItems: 'center' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420, p: 4, width: '100%' }}>
        <Typography variant="h4" gutterBottom>Movie Explorer</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Sign in to discover and save movies.</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField autoFocus fullWidth label="Name" value={username} onChange={(event) => setUsername(event.target.value)} />
        <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2 }}>Continue</Button>
      </Paper>
    </Box>
  );
}
