export const OFFLINE_MESSAGE = 'You appear to be offline. Check your internet connection and try again.';
export const CONFIGURATION_MESSAGE = 'TMDb could not authorize this request. Check the API URL and access token configuration.';

export const isNotFoundError = (error) => error?.response?.status === 404;

export const getFriendlyRequestError = (error, fallbackMessage) => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return OFFLINE_MESSAGE;
  if (error?.response?.status === 401) return CONFIGURATION_MESSAGE;
  if (!error?.response || error?.code === 'ERR_NETWORK') {
    return 'We could not reach TMDb. Check your connection and try again.';
  }
  return fallbackMessage;
};

export const logRequestError = (context, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Movie Explorer] ${context}`, error);
  }
};
