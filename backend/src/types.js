/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Пользователь системы
 *       properties:
 *         id:
 *           type: number
 *           description: Идентификатор пользователя
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         password_hash:
 *           type: string
 *           description: Хеш пароля
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       description: Фильм
 *       properties:
 *         id:
 *           type: number
 *           description: Идентификатор фильма
 *         title:
 *           type: string
 *           description: Название фильма
 *         description:
 *           type: string
 *           description: Описание фильма
 *         year:
 *           type: number
 *           description: Год выпуска
 *         lengthMinutes:
 *           type: number
 *           description: Продолжительность в минутах
 *         posterImage:
 *           type: string
 *           description: URL постера
 *         rating:
 *           type: number
 *           description: Рейтинг
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Cinema:
 *       type: object
 *       description: Кинотеатр
 *       properties:
 *         id:
 *           type: number
 *           description: Идентификатор кинотеатра
 *         name:
 *           type: string
 *           description: Название кинотеатра
 *         address:
 *           type: string
 *           description: Адрес кинотеатра
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     MovieSession:
 *       type: object
 *       description: Киносеанс
 *       properties:
 *         id:
 *           type: number
 *           description: Идентификатор сеанса
 *         movieId:
 *           type: number
 *           description: Идентификатор фильма
 *         cinemaId:
 *           type: number
 *           description: Идентификатор кинотеатра
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Время начала сеанса
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     MovieSessionWithSeats:
 *       type: object
 *       description: Киносеанс с информацией о размерах зала
 *       allOf:
 *         - $ref: '#/components/schemas/MovieSession'
 *         - type: object
 *           properties:
 *             seats:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: number
 *                   description: Количество рядов
 *                 seatsPerRow:
 *                   type: number
 *                   description: Количество мест в ряду
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Seat:
 *       type: object
 *       description: Место в кинозале
 *       properties:
 *         rowNumber:
 *           type: number
 *           description: Номер ряда
 *         seatNumber:
 *           type: number
 *           description: Номер места
 */


/**
 * @openapi
 * components:
 *   schemas:
 *     MovieSessionDetails:
 *       type: object
 *       description: Детали сеанса фильма
 *       allOf:
 *         - $ref: '#/components/schemas/MovieSessionWithSeats'
 *         - type: object
 *           properties:
 *             bookedSeats:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seat'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       description: Бронирование пользователя
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Идентификатор бронирования
 *         userId:
 *           type: number
 *           description: Идентификатор пользователя
 *         movieSessionId:
 *           type: number
 *           description: Идентификатор киносеанса
 *         sessionId:
 *           type: number
 *           description: Идентификатор сеанса
 *         bookedAt:
 *           type: string
 *           format: date
 *           description: Дата бронирования
 *         seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Seat'
 *           description: Забронированные места
 *         isPaid:
 *           type: boolean
 *           description: Статус оплаты
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       description: Стандартный ответ об ошибке
 *       properties:
 *         message:
 *           type: string
 *           description: Сообщение об ошибке
 *         error:
 *           type: string
 *           description: Детали ошибки (опционально)
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       description: Настройки приложения
 *       properties:
 *         bookingPaymentTimeSeconds:
 *           type: number
 *           description: Время в секундах, в течение которого бронирование должно быть оплачено
 */
