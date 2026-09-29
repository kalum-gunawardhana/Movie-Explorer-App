import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{ color: 'inherit', flexGrow: 1, textDecoration: 'none' }}
        >
          Movie Explorer
        </Typography>
        <Box component="nav">
          <Button color="inherit" component={RouterLink} to="/">Discover</Button>
          <Button color="inherit" component={RouterLink} to="/favorites">Favorites</Button>
        </Box>
        <IconButton color="inherit" aria-label={`Use ${mode === 'dark' ? 'light' : 'dark'} theme`} onClick={toggleTheme}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button color="inherit" onClick={handleLogout}>Log out</Button>
      </Toolbar>
    </AppBar>
  );
}
