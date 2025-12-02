import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import FilmsPage from './pages/movies/FilmsPage';
import CinemasPage from './pages/cinemas/CinemasPage';
import TicketsPage from './pages/tickets/TicketsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import FilmDetailsPage from './pages/movies/FilmDetailsPage';
import CinemaDetailsPage from './pages/cinemas/CinemaDetailsPage';
import BookingPage from './pages/booking/BookingPage';
import './styles/main.scss';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<FilmsPage />} />
            <Route path="/film/:id" element={<FilmDetailsPage />} />
            <Route path="/cinema/:id" element={<CinemaDetailsPage />} />
            <Route path="/booking/:sessionId" element={<BookingPage />} />
            <Route path="/cinemas" element={<CinemasPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
