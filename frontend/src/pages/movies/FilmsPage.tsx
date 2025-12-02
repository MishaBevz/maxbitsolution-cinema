import React, { useEffect, useState } from 'react';
import { getMovies } from '@/api/endpoints';
import type { Movie } from '@/types';
import { Link } from 'react-router-dom';
import { API_URL } from '@/api/client';
import styles from './FilmsPage.module.scss';

const FilmsPage = () => {
  const [films, setFilms] = useState<Movie[]>([]);

  useEffect(() => {
    getMovies().then(setFilms);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageTitleRow}>
        <h1 className={styles.pageTitle}>Фильмы / Главная</h1>
      </div>
      <div className={styles.header}>
        <span className={styles.headerCell}>Название</span>
        <span className={styles.headerCell}>Продолжительность</span>
        <span className={styles.headerCell}>Рейтинг</span>
        <span />
      </div>
      <div className={styles.list}>
        {films.map(film => (
          <div key={film.id} className={styles.row}>
            <div className={styles.info}>
              <img
                src={`${API_URL}${film.posterImage}`}
                alt={film.title}
                className={styles.poster}
              />
              <span className={styles.title}>{film.title}</span>
            </div>
            <span>{Math.floor(film.lengthMinutes / 60)}:{String(film.lengthMinutes % 60).padStart(2, '0')}</span>
            <span>{film.rating}</span>
            <Link to={`/film/${film.id}`} className={styles.button}>Посмотреть сеансы</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilmsPage;

