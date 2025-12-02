import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieSessions, getMovies, getCinemas } from '@/api/endpoints';
import type { Movie, MovieSession, Cinema } from '@/types';
import { formatDate, formatTime } from '@/utils/date';
import { API_URL } from '@/api/client';
import styles from './FilmDetailsPage.module.scss';

const FilmDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sessions, setSessions] = useState<MovieSession[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    if (id) {
      const movieId = parseInt(id);
      getMovies().then(movies => {
        const m = movies.find(f => f.id === movieId);
        if (m) setMovie(m);
      });
      getMovieSessions(movieId).then(setSessions);
      getCinemas().then(setCinemas);
    }
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  const groupedSessions = sessions.reduce((acc, session) => {
    const date = formatDate(session.startTime);
    if (!acc[date]) acc[date] = {};
    if (!acc[date][session.cinemaId]) acc[date][session.cinemaId] = [];
    acc[date][session.cinemaId].push(session);
    return acc;
  }, {} as Record<string, Record<number, MovieSession[]>>);

  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
    const [d1, m1] = a.split('.').map(Number);
    const [d2, m2] = b.split('.').map(Number);
    return m1 - m2 || d1 - d2;
  });

  const getCinemaName = (id: number) => cinemas.find(c => c.id === id)?.name || 'Unknown Cinema';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{movie.title}</h1>
      </div>
      <div className={styles.content}>
        <img
          src={`${API_URL}${movie.posterImage}`}
          alt={movie.title}
          className={styles.poster}
        />
        <div className={styles.details}>
           <p className={styles.description}>{movie.description}</p>
           <div className={styles.meta}>
             <p>Год: <span>{movie.year}</span></p>
             <p>Продолжительность: <span>{Math.floor(movie.lengthMinutes / 60)}:{String(movie.lengthMinutes % 60).padStart(2, '0')}</span></p>
             <p>Рейтинг: <span>{movie.rating}</span></p>
           </div>
        </div>
      </div>
      
      <div className={styles.schedule}>
        {sortedDates.map(date => (
          <div key={date} className={styles.dateGroup}>
            <h3 className={styles.dateTitle}>{date}</h3>
            <div className={styles.cinemasList}>
              {Object.keys(groupedSessions[date]).map(cinemaIdStr => {
                const cinemaId = parseInt(cinemaIdStr);
                const cinemaSessions = groupedSessions[date][cinemaId].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                return (
                  <div key={cinemaId} className={styles.cinemaRow}>
                    <span className={styles.cinemaName}>{getCinemaName(cinemaId)}</span>
                    <div className={styles.times}>
                      {cinemaSessions.map(session => (
                        <button 
                          key={session.id} 
                          className={styles.timeButton}
                          onClick={() => navigate(`/booking/${session.id}`)}
                        >
                          {formatTime(session.startTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilmDetailsPage;
