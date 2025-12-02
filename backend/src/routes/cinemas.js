import { Router } from 'express';
import { cinemas, movieSessions } from'../data/index.js';

const router = Router();

/**
 * @openapi
 * /cinemas:
 *   get:
 *     summary: Получить список кинотеатров
 *     description: Возвращает список всех доступных кинотеатров.
 *     tags:
 *       - Cinemas
 *     responses:
 *       200:
 *         description: Список кинотеатров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cinema'
 */
router.get('/cinemas', async (req, res) => {
  res.json(cinemas);
});

/**
 * @openapi
 * /cinemas/{cinemaId}/sessions:
 *   get:
 *     summary: Получить сеансы для кинотеатра
 *     description: Возвращает список всех доступных сеансов для указанного кинотеатра.
 *     tags:
 *       - Cinemas
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список киносеансов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovieSession'
 *       404:
 *         description: Кинотеатр не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/cinemas/:cinemaId/sessions', (req, res) => {
  const cinemaId = Number.parseInt(req.params.cinemaId);
  const cinema = cinemas.find((c) => c.id === cinemaId);
  if (!cinema) {
    return res.status(404).json({ message: 'Cinema not found' });
  }

  const sessions = movieSessions
    .filter((s) => s.cinemaId === cinemaId)
    .map(({ seats, ...session }) => session);
  res.json(sessions);
});

export default router;
