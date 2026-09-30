import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

const loginUsername = process.env.REACT_APP_LOGIN_USERNAME?.trim();
const loginPassword = process.env.REACT_APP_LOGIN_PASSWORD;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Remove the legacy value, which included a username, from earlier versions.
    window.localStorage.removeItem('movie-explorer-user');
    return window.localStorage.getItem(STORAGE_KEYS.auth) === 'true';
  });

  const login = useCallback((username, password) => {
    const isValid = Boolean(loginUsername && loginPassword)
      && username === loginUsername
      && password === loginPassword;

    if (isValid) {
      // Persist only the authentication flag. Credentials are never stored.
      window.localStorage.setItem(STORAGE_KEYS.auth, 'true');
      setIsAuthenticated(true);
    }

    return isValid;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEYS.auth);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
  }), [isAuthenticated, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
