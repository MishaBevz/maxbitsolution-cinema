import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('валидация RegisterPage', () => {
  it('показывает ошибки для короткого логина и слабого пароля', async () => {
    renderWithRouter(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText('Введите логин');
    const passwordInput = screen.getByPlaceholderText('Введите пароль');
    const confirmInput = screen.getByPlaceholderText('Повторите пароль');
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });

    fireEvent.change(usernameInput, { target: { value: 'short' } });
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.change(confirmInput, { target: { value: 'weak' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/логин должен содержать минимум 8 символов/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/пароль должен быть не короче 8 символов и содержать минимум 1 заглавную букву и 1 цифру/i)
    ).toBeInTheDocument();
  });

  it('показывает ошибку, если пароли не совпадают', async () => {
    renderWithRouter(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText('Введите логин');
    const passwordInput = screen.getByPlaceholderText('Введите пароль');
    const confirmInput = screen.getByPlaceholderText('Повторите пароль');
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });

    fireEvent.change(usernameInput, { target: { value: 'valid_user' } });
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });
    fireEvent.change(confirmInput, { target: { value: 'Password2' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/пароль не совпадает/i)).toBeInTheDocument();
  });
});


