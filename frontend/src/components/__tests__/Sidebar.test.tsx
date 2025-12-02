import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('показывает ссылку Вход, когда пользователь не авторизован', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Фильмы')).toBeInTheDocument();
    expect(screen.getByText('Кинотеатры')).toBeInTheDocument();
    expect(screen.getByText('Мои билеты')).toBeInTheDocument();
    expect(screen.getByText('Вход')).toBeInTheDocument();
  });

  it('показывает Выход, когда токен есть в localStorage', () => {
    localStorage.setItem('token', 'test-token');

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Выход')).toBeInTheDocument();
  });
});


