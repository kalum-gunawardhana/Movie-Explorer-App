import axios from 'axios';

const baseURL = process.env.REACT_APP_TMDB_BASE_URL?.trim();
const token = process.env.REACT_APP_TMDB_TOKEN
  ?.trim()
  .replace(/^Bearer\s+/i, '')
  .replace(/^['"]|['"]$/g, '');

export const isTmdbConfigured = Boolean(
  baseURL
  && token
  && token.startsWith('eyJ')
  && token.length > 50,
);

const axiosClient = axios.create({
  baseURL,
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  if (!isTmdbConfigured) {
    const configurationError = new Error('TMDb API configuration is missing or invalid.');
    configurationError.code = 'TMDB_CONFIGURATION_ERROR';
    return Promise.reject(configurationError);
  }

  return config;
});

export default axiosClient;
