import axiosClient from './axiosClient';

export const getPopularMovies = async (page = 1) => {
  const { data } = await axiosClient.get('/movie/popular', { params: { page } });
  return data;
};

export const searchMovies = async (query, page = 1) => {
  const { data } = await axiosClient.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
};

export const getMovieDetails = async (movieId) => {
  const { data } = await axiosClient.get(`/movie/${movieId}`, {
    params: { append_to_response: 'videos' },
  });
  return data;
};
