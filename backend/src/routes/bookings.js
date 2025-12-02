import { Router } from 'express';
import { bookings } from'../data/index.js';
import { authenticateToken } from '../auth.js';

const router = Router();

/**
 * @openapi
 * /bookings/{bookingId}/payments:
 *   post:
 *     summary: Оплатить бронирование
 *     description: Отмечает бронирование как оплаченное.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: Идентификатор бронирования
 *     responses:
 *       200:
 *         description: Бронирование успешно оплачено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Бронирование успешно оплачено
 *       404:
 *         description: Бронирование не найдено.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Бронирование не найдено
 *       409:
 *         description: Бронирование уже оплачено.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Бронирование уже оплачено
 *       500:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ошибка при оплате бронирования
 */
router.post('/bookings/:bookingId/payments', authenticateToken, (req, res) => {
  try {
    const bookingToPay = bookings.find(({ id }) => id === req.params.bookingId);

    if (!bookingToPay) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    if (bookingToPay.isPaid) {
      return res.status(409).json({ message: 'Бронирование уже оплачено' });
    }

    bookingToPay.isPaid = true;
    res.json({ message: 'Бронирование успешно оплачено' });
  } catch (error) {
    console.error('Ошибка при оплате бронирования:', error);
    res.status(500).json({ message: 'Ошибка при оплате бронирования' });
  }
});

export default router;
