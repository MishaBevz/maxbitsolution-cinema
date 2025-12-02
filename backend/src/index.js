import './loadEnv.js';
import url from 'url';
import express from 'express';
import cors from 'cors'
import passport from 'passport';
import authRouter from './routes/auth.js';
import moviesRouter from './routes/movies.js';
import cinemasRouter from './routes/cinemas.js';
import movieSessionsRouter from './routes/movieSessions.js';
import usersRouter from './routes/users.js';
import settingsRouter from './routes/settings.js';
import bookingsRouter from './routes/bookings.js';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { swaggerSpec } from './swagger.js';
import { startBookingCleanupJob } from './cleanupBookings.js';


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3022;

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(authRouter);
app.use(moviesRouter);
app.use(cinemasRouter);
app.use(movieSessionsRouter);
app.use(usersRouter);
app.use(settingsRouter);
app.use(bookingsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/static', express.static(path.join(__dirname, '../static')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  startBookingCleanupJob();
});
