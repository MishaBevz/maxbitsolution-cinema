export interface User {
  id: number;
  name: string;
  password_hash: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  year: number;
  lengthMinutes: number;
  posterImage: string;
  rating: number;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
}

export interface MovieSession {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
}

export interface Seat {
  rowNumber: number;
  seatNumber: number;
}

export interface MovieSessionWithSeats extends MovieSession {
  seats: {
    rows: number;
    seatsPerRow: number;
  };
}

export interface MovieSessionDetails extends MovieSessionWithSeats {
  bookedSeats: Seat[];
}

export interface Booking {
  id: string;
  userId: number;
  movieSessionId: number;
  sessionId?: number;
  bookedAt: string;
  seats: Seat[];
  isPaid: boolean;
}

export interface Settings {
  bookingPaymentTimeSeconds: number;
}

export interface LoginResponse {
  token: string;
}

