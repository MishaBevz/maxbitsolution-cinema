import { addDays, setHours, setMinutes, startOfToday } from 'date-fns';
import { cinemaSchedule } from './cinemaSchedule.js';

export const users = [];

export const movies = [
  {
    id: 1,
    title: 'Побег из Шоушенка',
    year: 1994,
    rating: 9.3,
    posterImage: '/static/images/posters/shawshank.jpg',
    lengthMinutes: 142,
    description:
      'Два заключённых сближаются за годы совместного заключения, находя утешение и, в конечном итоге, искупление через проявления человеческой доброты.',
  },
  {
    id: 2,
    title: 'Крёстный отец',
    year: 1972,
    rating: 9.2,
    posterImage: '/static/images/posters/godfather.jpg',
    lengthMinutes: 175,
    description:
      'Стареющий глава мафиозной династии передаёт контроль над своей тайной империей неохотному сыну.',
  },
  {
    id: 3,
    title: 'Тёмный рыцарь',
    year: 2008,
    rating: 9.0,
    posterImage: '/static/images/posters/dark_knight.jpg',
    lengthMinutes: 152,
    description:
      'Когда Джокер сеет хаос и разрушение в Готэме, Бэтмен сталкивается с величайшими испытаниями своих способностей и морали.',
  },
  {
    id: 4,
    title: 'Крёстный отец 2',
    year: 1974,
    rating: 9.0,
    posterImage: '/static/images/posters/godfather2.jpg',
    lengthMinutes: 202,
    description:
      'Показана ранняя жизнь и карьера Вито Корлеоне в Нью-Йорке 1920-х годов, а его сын Майкл расширяет и укрепляет власть семьи.',
  },
  {
    id: 5,
    title: '12 разгневанных мужчин',
    year: 1957,
    rating: 9.0,
    posterImage: '/static/images/posters/12_angry_men.jpg',
    lengthMinutes: 96,
    description:
      'Один из присяжных пытается предотвратить судебную ошибку, убеждая коллег пересмотреть доказательства.',
  },
  {
    id: 6,
    title: 'Властелин колец: Возвращение короля',
    year: 2003,
    rating: 9.0,
    posterImage: '/static/images/posters/lotr_return_king.jpg',
    lengthMinutes: 201,
    description:
      'Гэндальф и Арагорн ведут людей против армии Саурона, чтобы отвлечь его внимание от Фродо и Сэма, приближающихся к Роковой горе с Кольцом Всевластья.',
  },
  {
    id: 7,
    title: 'Список Шиндлера',
    year: 1993,
    rating: 9.0,
    posterImage: '/static/images/posters/schindlers_list.jpg',
    lengthMinutes: 195,
    description:
      'В оккупированной Польше во время Второй мировой войны Оскар Шиндлер начинает заботиться о своих еврейских рабочих, увидев их преследования нацистами.',
  },
  {
    id: 8,
    title: 'Криминальное чтиво',
    year: 1994,
    rating: 8.8,
    posterImage: '/static/images/posters/pulp_fiction.jpg',
    lengthMinutes: 154,
    description:
      'Жизни двух наёмных убийц, боксёра, гангстера и его жены, а также пары грабителей переплетаются в четырёх историях о насилии и искуплении.',
  },
  {
    id: 9,
    title: 'Властелин колец: Братство Кольца',
    year: 2001,
    rating: 8.9,
    posterImage: '/static/images/posters/lotr_fellowship.jpg',
    lengthMinutes: 178,
    description:
      'Скромный хоббит и восемь спутников отправляются уничтожить Кольцо Всевластья и спасти Средиземье от Тёмного Властелина Саурона.',
  },
  {
    id: 10,
    title: 'Хороший, плохой, злой',
    year: 1966,
    rating: 8.8,
    posterImage: '/static/images/posters/good_bad_ugly.jpg',
    lengthMinutes: 178,
    description:
      'Охотник за головами и два его соперника вступают в непростое союзничество в гонке за сокровищем, зарытым на кладбище.',
  },
];

export const cinemas = [
  { id: 1, name: 'Skyline Cinema', address: 'ТРЦ Galileo, ул. Бобруйская, 6' },
  {
    id: 2,
    name: 'mooon в ТРЦ Dana Mall',
    address: 'ТРЦ Dana Mall, ул. Петра Мстиславца, 11, эт. 3',
  },
  { id: 3, name: 'mooon в ТРЦ Palazzo', address: 'ТРЦ Palazzo, ул. Тимирязева, 74а, эт. 3' },
  { id: 4, name: 'Берестье', address: 'пр-т Газеты Правда, 25' },
  { id: 5, name: 'Салют', address: 'пр-т Рокоссовского, 150а' },
];

// генерация расписания показов на 7 дней начиная с сегодняшнего.
// расписание статичное, при перезапусках могут отличаться только даты
export const movieSessions = cinemaSchedule.flatMap((daySchedule, dayIndex) =>
  Object.entries(daySchedule).flatMap(([key, sessions]) => {
    const day = addDays(startOfToday(), dayIndex);

    return sessions.map(({ id, movieId, startTime }) => {
      const [hours, minutes] = startTime.split(':').map((number) => Number.parseInt(number));
      const startTimeDate = setMinutes(setHours(day, hours), minutes);
      const cinemaId = Number.parseInt(key);

      return {
        id,
        movieId,
        cinemaId,
        startTime: startTimeDate,

        // для простоты считаем, что в зале во всех рядах одинаковое количество мест
        seats: {
          rows: 3 + 5 * cinemaId,
          seatsPerRow: 10 + 5 * (cinemaId - 1),
        },
      };
    });
  })
);

export const bookings = [];

export const settings = {
  bookingPaymentTimeSeconds: 180,
};
