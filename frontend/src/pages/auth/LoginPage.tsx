import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '@/api/endpoints';
import styles from './AuthPage.module.scss';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);

    try {
      const { token } = await login(username, password);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      window.location.href = '/tickets';
    } catch {
      setHasError(true);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Вход</h1>
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
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Пароль</label>
          <div className={hasError ? styles.inputWrapperError : styles.inputWrapper}>
            <input
              className={`${styles.input} ${hasError ? styles.inputError : ''}`}
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {hasError && <span className={styles.errorIcon}>!</span>}
          </div>
          <span className={hasError ? styles.helperTextError : styles.helperText}>
            {hasError
              ? 'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова'
              : 'Введите пароль'}
          </span>
        </div>

        <button type="submit" className={styles.submitButton}>
          Войти
        </button>
      </form>

      <div className={styles.footerText}>
        Если у вас нет аккаунта{' '}
        <Link to="/register" className={styles.underlinedLink}>
          зарегистрируйтесь
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;

