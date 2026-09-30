export const OFFLINE_MESSAGE = 'You appear to be offline. Check your internet connection and try again.';
export const CONFIGURATION_MESSAGE = 'TMDb is not configured. Add a valid API Read Access Token to REACT_APP_TMDB_TOKEN in your .env file, then restart the development server.';

export const isNotFoundError = (error) => error?.response?.status === 404;

export const getFriendlyRequestError = (error, fallbackMessage) => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return OFFLINE_MESSAGE;
  if (error?.code === 'TMDB_CONFIGURATION_ERROR' || error?.response?.status === 401) {
    return CONFIGURATION_MESSAGE;
  }
  if (!error?.response || error?.code === 'ERR_NETWORK') {
    return 'We could not reach TMDb. Check your connection and try again.';
  }
  return fallbackMessage;
};

export const logRequestError = (context, error) => {
  if (process.env.NODE_ENV === 'development' && error?.code !== 'TMDB_CONFIGURATION_ERROR') {
    console.error(`[Movie Explorer] ${context}`, error);
  }
};
