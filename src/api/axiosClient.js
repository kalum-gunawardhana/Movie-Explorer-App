import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
    Accept: 'application/json',
  },
});

export default axiosClient;
