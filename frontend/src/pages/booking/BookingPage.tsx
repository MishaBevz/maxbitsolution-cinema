import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieSessionDetails, bookSeats } from '@/api/endpoints';
import type { MovieSessionDetails, Seat } from '@/types';
import styles from './BookingPage.module.scss';
import classNames from 'classnames';

const BookingPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<MovieSessionDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (sessionId) {
      getMovieSessionDetails(parseInt(sessionId)).then(setSession);
    }
  }, [sessionId]);

  if (!session) return <div>Loading...</div>;

  const isBooked = (row: number, seat: number) => {
    return session.bookedSeats.some(s => s.rowNumber === row && s.seatNumber === seat);
  };

  const isSelected = (row: number, seat: number) => {
    return selectedSeats.some(s => s.rowNumber === row && s.seatNumber === seat);
  };

  const toggleSeat = (row: number, seat: number) => {
    if (!isAuthenticated) return;
    if (isBooked(row, seat)) return;
    
    if (isSelected(row, seat)) {
      setSelectedSeats(selectedSeats.filter(s => !(s.rowNumber === row && s.seatNumber === seat)));
    } else {
      setSelectedSeats([...selectedSeats, { rowNumber: row, seatNumber: seat }]);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) return;
    setLoading(true);
    try {
      await bookSeats(session.id, selectedSeats);
      navigate('/tickets');
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Пожалуйста, войдите в систему');
        navigate('/login');
      } else {
        alert('Ошибка бронирования');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSeats = () => {
    const rows = [];
    for (let r = 1; r <= session.seats.rows; r++) {
      const rowSeats = [];
      for (let s = 1; s <= session.seats.seatsPerRow; s++) {
        const booked = isBooked(r, s);
        const selected = isSelected(r, s);
        rowSeats.push(
          <div
            key={`${r}-${s}`}
            className={classNames(styles.seat, {
              [styles.booked]: booked,
              [styles.selected]: selected,
            })}
            onClick={() => toggleSeat(r, s)}
          >
            {s}
          </div>
        );
      }
      rows.push(
        <div key={r} className={styles.row}>
          <span className={styles.rowLabel}>Ряд {r}</span>
          <div className={styles.seatsContainer}>{rowSeats}</div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className={styles.container}>
      <h1>Бронирование мест</h1>
      <div className={styles.screen}>ЭКРАН</div>
      <div className={styles.hall}>
        {renderSeats()}
      </div>
      <div className={styles.footer}>
        <p>Выбрано мест: {selectedSeats.length}</p>
        <button 
          onClick={handleBooking} 
          disabled={(selectedSeats.length === 0 && isAuthenticated) || loading}
          className={styles.bookButton}
        >
          {loading ? 'Бронирование...' : isAuthenticated ? 'Купить билеты' : 'Войти, чтобы забронировать'}
        </button>
      </div>
    </div>
  );
};

export default BookingPage;

