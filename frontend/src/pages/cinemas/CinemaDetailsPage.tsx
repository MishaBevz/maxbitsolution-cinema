import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCinemaSessions, getCinemas, getMovies } from '@/api/endpoints';
import type { Movie, MovieSession, Cinema } from '@/types';
import { formatDate, formatTime } from '@/utils/date';
import styles from '../movies/FilmDetailsPage.module.scss';

const CinemaDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [sessions, setSessions] = useState<MovieSession[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (id) {
      const cinemaId = parseInt(id);
      getCinemas().then(cinemas => {
        const c = cinemas.find(c => c.id === cinemaId);
        if (c) setCinema(c);
      });
      getCinemaSessions(cinemaId).then(setSessions);
      getMovies().then(setMovies);
    }
  }, [id]);

  if (!cinema) return <div>Loading...</div>;

  const groupedSessions = sessions.reduce((acc, session) => {
    const date = formatDate(session.startTime);
    if (!acc[date]) acc[date] = {};
    if (!acc[date][session.movieId]) acc[date][session.movieId] = [];
    acc[date][session.movieId].push(session);
    return acc;
  }, {} as Record<string, Record<number, MovieSession[]>>);

  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
      const [d1, m1] = a.split('.').map(Number);
      const [d2, m2] = b.split('.').map(Number);
      return m1 - m2 || d1 - d2;
  });

  const getMovieTitle = (id: number) => movies.find(m => m.id === id)?.title || 'Unknown Movie';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{cinema.name}</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.details}>
           <p className={styles.description}>{cinema.address}</p>
        </div>
      </div>
      
      <div className={styles.schedule}>
        {sortedDates.map(date => (
          <div key={date} className={styles.dateGroup}>
            <h3 className={styles.dateTitle}>{date}</h3>
            <div className={styles.cinemasList}>
              {Object.keys(groupedSessions[date]).map(movieIdStr => {
                const movieId = parseInt(movieIdStr);
                const movieSessions = groupedSessions[date][movieId].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                return (
                  <div key={movieId} className={styles.cinemaRow}>
                    <span className={styles.cinemaName}>{getMovieTitle(movieId)}</span>
                    <div className={styles.times}>
                      {movieSessions.map(session => (
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

export default CinemaDetailsPage;

