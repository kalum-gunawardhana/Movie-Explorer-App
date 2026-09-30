import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import MovieCard from './components/movie/MovieCard';
import { MovieProvider } from './context/MovieContext';
import FavoritesPage from './pages/FavoritesPage';
import {
  discoverMovies,
  getGenres,
  getMovieDetails,
  getTrendingMovies,
  searchMovies,
} from './api/movieApi';

jest.mock('./api/movieApi', () => ({
  discoverMovies: jest.fn(),
  getGenres: jest.fn(),
  getMovieDetails: jest.fn(),
  getTrendingMovies: jest.fn(),
  searchMovies: jest.fn(),
}));

class IntersectionObserverMock {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

const movie = (id, title, overrides = {}) => ({
  id,
  title,
  poster_path: null,
  release_date: '2024-01-01',
  vote_average: 8,
  genre_ids: [28],
  ...overrides,
});

const renderApp = (path = '/') => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

beforeAll(() => {
  global.IntersectionObserver = IntersectionObserverMock;
});

beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, '', '/');
  jest.clearAllMocks();
  getGenres.mockResolvedValue({ data: { genres: [{ id: 28, name: 'Action' }] } });
  getTrendingMovies.mockResolvedValue({ data: { results: [movie(1, 'Trending Movie')], total_pages: 1 } });
  discoverMovies.mockResolvedValue({ data: { results: [], total_pages: 1 } });
  searchMovies.mockResolvedValue({ data: { results: [], total_pages: 1 } });
});

describe('authentication', () => {
  test('validates empty and incorrect credentials', async () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByText('Enter both your username and password.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'credentials' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByText('The username or password is incorrect.')).toBeInTheDocument();
    expect(window.localStorage.getItem('movieExplorerAuth')).toBeNull();
  });

  test('accepts credentials configured through environment variables', async () => {
    renderApp();

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: process.env.REACT_APP_LOGIN_USERNAME },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: process.env.REACT_APP_LOGIN_PASSWORD },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Trending Movie')).toBeInTheDocument();
    expect(window.localStorage.getItem('movieExplorerAuth')).toBe('true');
  });

  test('restores a session and logout clears it', async () => {
    window.localStorage.setItem('movieExplorerAuth', 'true');
    const firstRender = renderApp();

    expect(await screen.findByText('Trending Movie')).toBeInTheDocument();
    firstRender.unmount();

    renderApp();
    expect(await screen.findByText('Trending Movie')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    expect(window.localStorage.getItem('movieExplorerAuth')).toBeNull();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
});

describe('movie functionality', () => {
  beforeEach(() => window.localStorage.setItem('movieExplorerAuth', 'true'));

  test('loads trending movies', async () => {
    renderApp();
    expect(await screen.findByText('Trending Movie')).toBeInTheDocument();
    expect(getTrendingMovies).toHaveBeenCalledWith(1);
  });

  test('searches after a debounce, persists the query, and clears previous results', async () => {
    searchMovies.mockImplementation((query) => Promise.resolve({
      data: {
        results: query === 'Matrix' ? [movie(2, 'The Matrix')] : [movie(3, 'Alien')],
        total_pages: 1,
      },
    }));
    const firstRender = renderApp();
    const input = screen.getByLabelText('Search movies');

    fireEvent.change(input, { target: { value: 'Matrix' } });
    expect(await screen.findByText('The Matrix', {}, { timeout: 1500 })).toBeInTheDocument();
    expect(window.localStorage.getItem('movieExplorerLastSearch')).toBe('Matrix');

    fireEvent.change(input, { target: { value: 'Alien' } });
    expect(await screen.findByText('Alien', {}, { timeout: 1500 })).toBeInTheDocument();
    expect(screen.queryByText('The Matrix')).not.toBeInTheDocument();

    firstRender.unmount();
    renderApp();
    expect(screen.getByLabelText('Search movies')).toHaveValue('Alien');
    expect(await screen.findByText('Alien', {}, { timeout: 1500 })).toBeInTheDocument();
  });

  test('appends another page without duplicating movies', async () => {
    getTrendingMovies
      .mockResolvedValueOnce({ data: { results: [movie(10, 'First')], total_pages: 2 } })
      .mockResolvedValueOnce({ data: { results: [movie(10, 'First'), movie(11, 'Second')], total_pages: 2 } });

    renderApp();
    expect(await screen.findByText('First')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    expect(await screen.findByText('Second')).toBeInTheDocument();
    expect(screen.getAllByText('First')).toHaveLength(1);
    expect(getTrendingMovies).toHaveBeenLastCalledWith(2);
  });

  test('opens details using the route ID and falls back to an unofficial YouTube trailer', async () => {
    getMovieDetails.mockResolvedValue({
      data: {
        ...movie(42, 'Detail Movie'),
        backdrop_path: null,
        runtime: 120,
        overview: 'Movie overview',
        genres: [{ id: 28, name: 'Action' }],
        credits: { cast: [] },
        videos: { results: [{ key: 'fallback-key', site: 'YouTube', type: 'Trailer', official: false }] },
      },
    });

    renderApp('/movie/42');
    const trailer = await screen.findByTitle('Detail Movie trailer');

    expect(getMovieDetails).toHaveBeenCalledWith('42');
    expect(trailer).toHaveAttribute('src', 'https://www.youtube.com/embed/fallback-key');
  });
});

describe('persistence', () => {
  test('favorites store only card data and survive a provider remount', async () => {
    const favorite = movie(7, 'Saved Movie', { overview: 'Must not be stored', popularity: 900 });
    const firstRender = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MovieProvider><MovieCard movie={favorite} /></MovieProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add to favorites' }));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem('movieExplorerFavorites'))).toEqual([{
      id: 7,
      title: 'Saved Movie',
      poster_path: null,
      release_date: '2024-01-01',
      vote_average: 8,
    }]));
    firstRender.unmount();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MovieProvider><FavoritesPage /></MovieProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Saved Movie')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(await screen.findByText('No favorites yet')).toBeInTheDocument();
  });

  test('restores and persists the selected theme', async () => {
    window.localStorage.setItem('movieExplorerAuth', 'true');
    window.localStorage.setItem('movieExplorerTheme', JSON.stringify('light'));
    const firstRender = renderApp();

    const toggle = await screen.findByRole('button', { name: 'Use dark theme' });
    fireEvent.click(toggle);
    expect(window.localStorage.getItem('movieExplorerTheme')).toBe(JSON.stringify('dark'));
    firstRender.unmount();

    renderApp();
    expect(await screen.findByRole('button', { name: 'Use light theme' })).toBeInTheDocument();
  });
});

describe.each([320, 768, 1024, 1440])('responsive render at %i px', (width) => {
  test('renders the header, controls, and movie grid without errors', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
    window.dispatchEvent(new Event('resize'));
    window.localStorage.setItem('movieExplorerAuth', 'true');

    renderApp();

    expect(screen.getByRole('link', { name: /movie explorer/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Search movies')).toBeInTheDocument();
    expect(await screen.findByText('Trending Movie')).toBeInTheDocument();
  });
});
