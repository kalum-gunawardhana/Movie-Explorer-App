import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = process.env.REACT_APP_TMDB_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.status_message ||
      error.message ||
      'Something went wrong while contacting the movie service.';

    return Promise.reject(new Error(message));
  },
);

export default axiosClient;
