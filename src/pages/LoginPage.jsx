import { useState } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DEMO_CREDENTIALS, useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter both your username and password.');
      return;
    }

    if (!login(username.trim(), password)) {
      setError('The username or password is incorrect.');
      return;
    }

    navigate(location.state?.from?.pathname || '/', { replace: true });
  };

  return (
    <Box sx={{ display: 'grid', minHeight: '100vh', p: 2, placeItems: 'center' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420, p: 4, width: '100%' }}>
        <Typography variant="h4" gutterBottom>Movie Explorer</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Sign in to discover and save movies.</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Demo login: <strong>{DEMO_CREDENTIALS.username}</strong> / <strong>{DEMO_CREDENTIALS.password}</strong>
        </Alert>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoComplete="username"
          autoFocus
          fullWidth
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          autoComplete="current-password"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          sx={{ mt: 2 }}
        />
        <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2 }}>Log in</Button>
      </Paper>
    </Box>
  );
}
