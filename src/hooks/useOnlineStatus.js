import { useEffect, useState } from 'react';

const getOnlineStatus = () => typeof navigator === 'undefined' || navigator.onLine;

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(getOnlineStatus);

  useEffect(() => {
    const updateStatus = () => setIsOnline(getOnlineStatus());
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return isOnline;
}
