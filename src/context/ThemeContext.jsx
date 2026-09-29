import { createContext, useContext, useMemo } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

const palettes = {
  light: {
    mode: 'light',
    primary: { main: '#5b3cc4' },
    background: { default: '#f6f6fb', paper: '#ffffff' },
  },
  dark: {
    mode: 'dark',
    primary: { main: '#a891ff' },
    background: { default: '#101014', paper: '#1b1b22' },
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorage('movie-explorer-theme', 'dark');
  const theme = useMemo(() => createTheme({ palette: palettes[mode] || palettes.dark }), [mode]);
  const value = useMemo(() => ({ mode, toggleTheme: () => setMode((current) => current === 'dark' ? 'light' : 'dark') }), [mode, setMode]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used inside ThemeProvider.');
  return context;
}
