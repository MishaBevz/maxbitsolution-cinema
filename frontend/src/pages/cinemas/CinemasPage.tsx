import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCinemas } from '@/api/endpoints';
import type { Cinema } from '@/types';
import styles from './CinemasPage.module.scss';

const CinemasPage = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    getCinemas().then(setCinemas);
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <span>Кинотеатр</span>
        <span>Адрес</span>
      </div>
      <div className={styles.list}>
        {cinemas.map(cinema => (
          <div key={cinema.id} className={styles.row}>
            <span>{cinema.name}</span>
            <span>{cinema.address}</span>
            <Link to={`/cinema/${cinema.id}`}><button>Посмотреть сеансы</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CinemasPage;

