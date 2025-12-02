import client from './client';
import type { 
  Movie, 
  MovieSession, 
  Cinema, 
  MovieSessionDetails, 
  Booking, 
  LoginResponse, 
  Seat,
  Settings
} from '../types';

// Обертки над HTTP-запросами: один файл — одна «витрина» всех эндпоинтов
export const getMovies = async () => {
  const response = await client.get<Movie[]>('/movies');
  return response.data;
};

export const getMovieSessions = async (movieId: number) => {
  const response = await client.get<MovieSession[]>(`/movies/${movieId}/sessions`);
  return response.data;
};

export const getCinemas = async () => {
  const response = await client.get<Cinema[]>('/cinemas');
  return response.data;
};

export const getCinemaSessions = async (cinemaId: number) => {
  const response = await client.get<MovieSession[]>(`/cinemas/${cinemaId}/sessions`);
  return response.data;
};

export const getMovieSessionDetails = async (movieSessionId: number) => {
  const response = await client.get<MovieSessionDetails>(`/movieSessions/${movieSessionId}`);
  return response.data;
};

export const bookSeats = async (movieSessionId: number, seats: Seat[]) => {
  const response = await client.post<{ bookingId: string }>(`/movieSessions/${movieSessionId}/bookings`, { seats });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await client.post<LoginResponse>('/login', { username, password });
  return response.data;
};

export const register = async (username: string, password: string) => {
  const response = await client.post<LoginResponse>('/register', { username, password });
  return response.data;
};

export const getMyBookings = async () => {
  const response = await client.get<Booking[]>('/me/bookings');
  return response.data;
};

export const payBooking = async (bookingId: string) => {
  const response = await client.post<{ message: string }>(`/bookings/${bookingId}/payments`);
  return response.data;
};

export const getSettings = async () => {
  const response = await client.get<Settings>('/settings');
  return response.data;
};
