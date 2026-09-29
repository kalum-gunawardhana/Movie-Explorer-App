import axiosClient from './axiosClient';

export const getTrendingMovies = (page = 1) =>
  axiosClient.get(`/trending/movie/week?page=${page}`);

export const searchMovies = (query, page = 1) =>
  axiosClient.get('/search/movie', {
    params: { query, page, include_adult: false },
  });

export const getMovieDetails = (movieId) =>
  axiosClient.get(`/movie/${movieId}`, {
    params: { append_to_response: 'credits,videos' },
  });

export const getGenres = () =>
  axiosClient.get('/genre/movie/list');
