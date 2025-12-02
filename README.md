## Проект кинотеатра (Frontend + Backend)

Тестовое задание MaxbitSolution. В репозитории два приложения:

- `backend/` — Node.js/Express API для кинотеатра.
- `frontend/` — React (Vite + TypeScript) клиент.

### 1. Запуск backend

```bash
cd backend
npm install
npm start
```

API будет доступно по адресу `http://localhost:3022`  
Документация Swagger: `http://localhost:3022/api-docs`

Подробнее — в `backend/README.md`.

### 2. Запуск frontend

```bash
cd frontend
npm install
npm run dev
```

Фронтенд будет доступен по адресу `http://localhost:5173`.  
Убедитесь, что backend запущен на `http://localhost:3022`.

### 3. Тесты фронтенда

```bash
cd frontend
npm test
```

Тесты написаны на Vitest + React Testing Library и лежат рядом с модулями в папках `__tests__`.

### Контакты

Если будут вопросы по заданию, можно написать в Telegram: [@itman001](https://t.me/itman001).

