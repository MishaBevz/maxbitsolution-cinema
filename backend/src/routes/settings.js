import { Router } from 'express';
import { settings } from'../data/index.js';

const router = Router();

/**
 * @openapi
 * /settings:
 *   get:
 *     summary: Получить настройки приложения
 *     description: Возвращает текущие настройки приложения, включая время, в течение которого бронирование должно быть оплачено.
 *     tags:
 *       - Settings
 *     responses:
 *       200:
 *         description: Настройки приложения
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 */
router.get('/settings', async (req, res) => {
  res.json(settings);
});

export default router;