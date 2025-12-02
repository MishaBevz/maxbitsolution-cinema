import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import FilmsPage from '../FilmsPage';

vi.mock('@/api/endpoints', () => ({
  getMovies: vi.fn(),
}));

const { getMovies } = await import('@/api/endpoints');

describe('FilmsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('отображает список фильмов из API', async () => {
    (getMovies as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      {
        id: 1,
        title: 'Тестовый фильм',
        description: '',
        year: 2020,
        lengthMinutes: 120,
        posterImage: '/poster.jpg',
        rating: 4.5,
      },
    ]);

    render(
      <MemoryRouter>
        <FilmsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Тестовый фильм')).toBeInTheDocument();
    expect(screen.getByText('Фильмы / Главная')).toBeInTheDocument();
  });
});


