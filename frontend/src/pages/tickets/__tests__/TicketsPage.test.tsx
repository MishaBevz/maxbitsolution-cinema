import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import TicketsPage from '../TicketsPage';

vi.mock('@/api/endpoints', () => ({
  getMyBookings: vi.fn(),
  payBooking: vi.fn(),
  getMovies: vi.fn(),
  getCinemas: vi.fn(),
  getSettings: vi.fn().mockResolvedValue({ bookingPaymentTimeSeconds: 900 }),
  getMovieSessionDetails: vi.fn(),
}));

const { getMyBookings } = await import('@/api/endpoints');

describe('TicketsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('отображает заголовок и секции билетов', async () => {
    (getMyBookings as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <TicketsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Мои билеты')).toBeInTheDocument();
  });
});


