import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { movieSessions, bookings } from '../data/index.js';
import { authenticateToken } from '../auth.js';

const router = Router();

/**
 * @openapi
 * /movieSessions/{movieSessionId}:
 *   get:
 *     summary: Получить детали сеанса
 *     description: Возвращает детальную информацию о сеансе, включая забронированные места.
 *     tags:
 *       - Movie Sessions
 *     parameters:
 *       - in: path
 *         name: movieSessionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Детали киносеанса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieSessionDetails'
 *       404:
 *         description: Сеанс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/movieSessions/:movieSessionId', (req, res) => {
  const movieSessionId = Number.parseInt(req.params.movieSessionId);
  const movieSession = movieSessions.find((s) => s.id === movieSessionId);

  if (!movieSession) {
    return res.status(404).json({ message: 'Сеанс не найден' });
  }

  const sessionBookedSeats = bookings
    .filter((s) => s.movieSessionId === movieSessionId)
    .flatMap((s) => s.seats);

  res.json({ ...movieSession, bookedSeats: sessionBookedSeats });
});

/**
 * @openapi
 * /movieSessions/{movieSessionId}/bookings:
 *   post:
 *     summary: Забронировать места на киносеанс
 *     description: Бронирует указанные места на киносеанс для аутентифицированного пользователя.
 *     tags:
 *       - Movie Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieSessionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seats:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Seat'
 *     responses:
 *       200:
 *         description: Бронирование успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingId:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: Неверное тело запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Неавторизованный доступ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Доступ запрещен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Киносеанс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Места уже забронированы
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/movieSessions/:movieSessionId/bookings', authenticateToken, (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }

  const movieSessionId = Number.parseInt(req.params.movieSessionId);
  const movieSession = movieSessions.find((s) => s.id === movieSessionId);

  if (!movieSession) {
    return res.status(404).json({ message: 'Сеанс не найден' });
  }

  const { seats } = req.body;

  if (!isValidSeats(seats, movieSession.seats.rows, movieSession.seats.seatsPerRow)) {
    return res.status(400).json({ message: 'Неверное тело запроса' });
  }

  const hasConflictedBooking = bookings.find(
    (booking) =>
      booking.movieSessionId === movieSessionId &&
      booking.seats.some((bookedSeat) =>
        seats.find(
          ({ rowNumber, seatNumber }) =>
            bookedSeat.rowNumber === rowNumber && bookedSeat.seatNumber === seatNumber
        )
      )
  );

  if (hasConflictedBooking) {
    return res.status(409).json({ message: 'Места уже забронированы' });
  }

  const newBooking = {
    id: uuidv4(),
    movieSessionId,
    userId: user.id,
    isPaid: false,
    seats,
    bookedAt: new Date(),
  };

  bookings.push(newBooking);

  res.status(200).json({ bookingId: newBooking.id });
});

function isValidSeats(seats, rowsNumber, seatsPerRow) {
  if (!Array.isArray(seats)) {
    return false;
  }

  if (!seats.length) {
    return false;
  }

  return seats.every(
    (seat) => isValidSeat(seat) && seat.rowNumber <= rowsNumber && seat.seatNumber <= seatsPerRow
  );
}

function isValidSeat(seat) {
  if (typeof seat !== 'object' || seat === null) {
    return false;
  }

  if (!seat.hasOwnProperty('rowNumber') || !seat.hasOwnProperty('seatNumber')) {
    return false;
  }

  const { rowNumber, seatNumber } = seat;

  if (
    typeof rowNumber !== 'number' ||
    typeof seatNumber !== 'number' ||
    !Number.isFinite(rowNumber) ||
    !Number.isFinite(seatNumber)
  ) {
    return false;
  }

  return rowNumber > 0 && seatNumber > 0;
}

export default router;
