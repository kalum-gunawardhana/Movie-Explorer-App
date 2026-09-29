import { useCallback, useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    setStoredValue((current) => {
      const nextValue = value instanceof Function ? value(current) : value;
      window.localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
