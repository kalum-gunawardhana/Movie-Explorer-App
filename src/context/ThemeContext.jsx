import { createContext, useContext, useMemo } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorage('movie-explorer-theme', 'dark');
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
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
