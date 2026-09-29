import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function Header() {
  const { logout } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{ alignItems: 'center', color: 'inherit', display: 'flex', flexGrow: 1, gap: 1, textDecoration: 'none' }}
        >
          <LocalMoviesIcon aria-hidden="true" />
          <Typography variant="h6">Movie Explorer</Typography>
        </Box>
        <Box component="nav" sx={{ display: 'flex', order: { xs: 3, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/favorites">Favorites</Button>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', order: { xs: 2, sm: 3 } }}>
          <IconButton color="inherit" aria-label={`Use ${mode === 'dark' ? 'light' : 'dark'} theme`} onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Button color="inherit" onClick={handleLogout}>Log out</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
