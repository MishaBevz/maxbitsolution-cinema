import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '@/api/endpoints';
import styles from './AuthPage.module.scss';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordValidationError, setPasswordValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    setPasswordMismatch(false);
    setPasswordErrorMessage(null);
    setUsernameError(null);
    setPasswordValidationError(null);

    let hasClientError = false;

    if (username.length < 8) {
      setUsernameError('Логин должен содержать минимум 8 символов');
      hasClientError = true;
    }

    // простая проверка: длина + хотя бы одна заглавная и одна цифра
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordValidationError(
        'Пароль должен быть не короче 8 символов и содержать минимум 1 заглавную букву и 1 цифру'
      );
      hasClientError = true;
    }

    if (hasClientError) {
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setPasswordErrorMessage('Пароль не совпадает');
      return;
    }

    try {
      const { token } = await register(username, password);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      window.location.href = '/tickets';
    } catch {
      setHasError(true);
      setPasswordErrorMessage('Ошибка регистрации');
    }
  };

  const showPasswordError = passwordMismatch || hasError;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Регистрация</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Логин</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Введите логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && (
            <span className={styles.helperTextError}>{usernameError}</span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Пароль</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordValidationError && (
            <span className={styles.helperTextError}>{passwordValidationError}</span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Пароль</label>
          <div className={showPasswordError ? styles.inputWrapperError : styles.inputWrapper}>
            <input
              className={`${styles.input} ${showPasswordError ? styles.inputError : ''}`}
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {showPasswordError && <span className={styles.errorIcon}>!</span>}
          </div>
          <span className={showPasswordError ? styles.helperTextError : styles.helperText}>
            {passwordErrorMessage ?? 'Повторите пароль'}
          </span>
        </div>

        <button type="submit" className={styles.submitButton}>
          Зарегистрироваться
        </button>
      </form>

      <div className={styles.footerText}>
        Если вы уже зарегистрированы{' '}
        <Link to="/login" className={styles.underlinedLink}>
          войдите
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;


