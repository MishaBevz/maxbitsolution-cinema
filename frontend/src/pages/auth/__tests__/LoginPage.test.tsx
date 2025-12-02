import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../LoginPage';

vi.mock('@/api/endpoints', () => ({
  login: vi.fn(),
}));

const { login } = await import('@/api/endpoints');

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('показывает текст ошибки при неуспешном логине', async () => {
    (login as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('unauthorized'));

    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Введите логин'), {
      target: { value: 'user12345' },
    });
    fireEvent.change(screen.getByPlaceholderText('Введите пароль'), {
      target: { value: 'Password1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    expect(
      await screen.findByText(
        /Неверный логин или пароль. Проверьте введенные данные и попробуйте снова/i
      )
    ).toBeInTheDocument();
  });
});


