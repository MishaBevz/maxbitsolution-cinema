import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import CinemasPage from '../CinemasPage';

vi.mock('@/api/endpoints', () => ({
  getCinemas: vi.fn(),
}));

const { getCinemas } = await import('@/api/endpoints');

describe('CinemasPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('отображает список кинотеатров из API', async () => {
    (getCinemas as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { id: 1, name: 'Skyline Cinema', address: 'Тестовый адрес' },
    ]);

    render(
      <MemoryRouter>
        <CinemasPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Skyline Cinema')).toBeInTheDocument();
    expect(screen.getByText('Кинотеатр')).toBeInTheDocument();
  });
});


