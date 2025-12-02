import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import FilmDetailsPage from '../FilmDetailsPage';

vi.mock('@/api/endpoints', () => ({
  getMovieSessions: vi.fn(),
  getMovies: vi.fn(),
  getCinemas: vi.fn(),
}));

const { getMovieSessions, getMovies, getCinemas } = await import('@/api/endpoints');

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/film/1']}>
      <Routes>
        <Route path="/film/:id" element={<FilmDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('FilmDetailsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('отображает информацию о фильме и список сеансов', async () => {
    (getMovies as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      {
        id: 1,
        title: 'Тестовый фильм',
        description: 'Описание',
        year: 2020,
        lengthMinutes: 120,
        posterImage: '/poster.jpg',
        rating: 4.5,
      },
    ]);

    (getCinemas as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { id: 1, name: 'Skyline Cinema', address: 'Адрес' },
    ]);

    (getMovieSessions as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { id: 100, movieId: 1, cinemaId: 1, startTime: new Date().toISOString() },
    ]);

    renderWithRouter();

    expect(await screen.findByText('Тестовый фильм')).toBeInTheDocument();
    expect(screen.getByText('Skyline Cinema')).toBeInTheDocument();
  });
});


