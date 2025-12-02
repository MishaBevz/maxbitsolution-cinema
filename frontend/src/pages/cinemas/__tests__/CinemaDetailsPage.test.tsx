import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import CinemaDetailsPage from '../CinemaDetailsPage';

vi.mock('@/api/endpoints', () => ({
  getCinemaSessions: vi.fn(),
  getCinemas: vi.fn(),
  getMovies: vi.fn(),
}));

const { getCinemaSessions, getCinemas, getMovies } = await import('@/api/endpoints');

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/cinema/1']}>
      <Routes>
        <Route path="/cinema/:id" element={<CinemaDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CinemaDetailsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('отображает название кинотеатра и даты сеансов', async () => {
    (getCinemas as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { id: 1, name: 'Skyline Cinema', address: 'Адрес' },
    ]);

    (getMovies as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { id: 10, title: 'Тестовый фильм', description: '', year: 2020, lengthMinutes: 120, posterImage: '', rating: 4.5 },
    ]);

    (getCinemaSessions as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { id: 100, movieId: 10, cinemaId: 1, startTime: new Date().toISOString() },
    ]);

    renderWithRouter();

    expect(await screen.findByText('Skyline Cinema')).toBeInTheDocument();
    expect(screen.getByText('Тестовый фильм')).toBeInTheDocument();
  });
});


