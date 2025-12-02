import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, payBooking, getMovies, getCinemas, getSettings, getMovieSessionDetails } from '@/api/endpoints';
import type { Booking, Movie, Cinema, MovieSessionDetails } from '@/types';
import { formatDate, formatTime } from '@/utils/date';
import styles from './TicketsPage.module.scss';

const Countdown = ({ targetDate, onExpire }: { targetDate: number, onExpire: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, targetDate - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, targetDate - Date.now());
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return <span>Осталось {minutes}:{String(seconds).padStart(2, '0')}</span>;
};

interface ExtendedBooking extends Booking {
  movie?: Movie;
  cinema?: Cinema;
  session?: MovieSessionDetails;
}

const TicketsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
  const [paymentTime, setPaymentTime] = useState(900);

  const fetchData = async () => {
    try {
      const [bookingsData, moviesData, cinemasData, settingsData] = await Promise.all([
        getMyBookings(),
        getMovies(),
        getCinemas(),
        getSettings().catch(() => ({ bookingPaymentTimeSeconds: 900 }))
      ]);

      setPaymentTime(settingsData.bookingPaymentTimeSeconds);

      const enhanced = await Promise.all(bookingsData.map(async (b) => {
        let session = undefined;
        try {
           session = await getMovieSessionDetails(b.movieSessionId);
        } catch (e) {
           console.error('Failed to load session for booking', b.id);
        }
        
        return {
          ...b,
          session,
          movie: moviesData.find(m => m.id === session?.movieId),
          cinema: cinemasData.find(c => c.id === session?.cinemaId),
        };
      }));

      setBookings(enhanced);
    } catch (e: any) {
      if (e.response?.status === 401) {
        navigate('/login');
      } else {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const handlePay = async (id: string) => {
    try {
      await payBooking(id);
      fetchData();
    } catch (e) {
      alert('Ошибка оплаты');
    }
  };

  const unpaid = bookings.filter(b => !b.isPaid && b.session && (new Date(b.bookedAt).getTime() + paymentTime * 1000 > Date.now()));
  const future = bookings.filter(b => b.isPaid && b.session && new Date(b.session.startTime) > new Date());
  const past = bookings.filter(b => b.session && new Date(b.session.startTime) <= new Date());

  const renderTicket = (booking: ExtendedBooking, showPay: boolean) => (
    <div key={booking.id} className={styles.ticket}>
      <div className={styles.info}>
        <h3 className={styles.movieTitle}>{booking.movie?.title}</h3>
        <p className={styles.cinemaName}>{booking.cinema?.name}</p>
        <p className={styles.date}>
          {booking.session && formatDate(booking.session.startTime)} {booking.session && formatTime(booking.session.startTime)}
        </p>
        <div className={styles.seats}>
          {booking.seats.map((s, i) => (
            <span key={i}>Ряд {s.rowNumber}, место {s.seatNumber}</span>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        {showPay && (
          <>
            <Countdown 
              targetDate={new Date(booking.bookedAt).getTime() + paymentTime * 1000} 
              onExpire={() => fetchData()} 
            />
            <button onClick={() => handlePay(booking.id)} className={styles.payButton}>Оплатить</button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1>Мои билеты</h1>
      
      {unpaid.length > 0 && (
        <div className={styles.section}>
          <h2>Не оплаченные</h2>
          {unpaid.map(b => renderTicket(b, true))}
        </div>
      )}

      {future.length > 0 && (
        <div className={styles.section}>
          <h2>Будущие</h2>
          {future.map(b => renderTicket(b, false))}
        </div>
      )}

      {past.length > 0 && (
        <div className={styles.section}>
          <h2>Прошедшие</h2>
          {past.map(b => renderTicket(b, false))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
