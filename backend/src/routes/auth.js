import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../auth.js';
import { users } from '../data/index.js';

const router = Router();

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Вход пользователя
 *     description: Аутентификация пользователя и получение JWT токена.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Требуется имя пользователя и пароль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Неверное имя пользователя или пароль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Требуется имя пользователя и пароль' });
  }
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
  }
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
  }
  const token = signToken(user);
  res.json({ token });
});

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Регистрация нового пользователя в системе.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Требуется имя пользователя и пароль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Имя пользователя уже существует
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Ошибка регистрации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Требуется имя пользователя и пароль' });
  }
  try {
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: 'Имя пользователя уже существует' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, username, password_hash: passwordHash };
    users.push(user);
    const token = signToken(user);
    res.json({ token });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    res.status(500).json({ message: 'Ошибка регистрации', error: error.message });
  }
});

function signToken(user) {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });
}

export default router;
