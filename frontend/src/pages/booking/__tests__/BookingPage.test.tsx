import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import BookingPage from '../BookingPage';

vi.mock('@/api/endpoints', () => ({
  getMovieSessionDetails: vi.fn(),
  bookSeats: vi.fn(),
}));

const { getMovieSessionDetails } = await import('@/api/endpoints');

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/booking/1']}>
      <Routes>
        <Route path="/booking/:sessionId" element={<BookingPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('BookingPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('отображает схему зала и заголовок', async () => {
    (getMovieSessionDetails as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 1,
      movieId: 1,
      cinemaId: 1,
      startTime: new Date().toISOString(),
      seats: { rows: 2, seatsPerRow: 2 },
      bookedSeats: [],
    });

    renderWithRouter();

    expect(await screen.findByText('Бронирование мест')).toBeInTheDocument();
    expect(screen.getByText('ЭКРАН')).toBeInTheDocument();
  });
});


