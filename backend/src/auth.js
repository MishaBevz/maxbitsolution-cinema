import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { users } from './data/index.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      if (jwt_payload.sub) {
        const user = users.find(({ id }) => id === jwt_payload.sub);
        if (user) {
          return done(null, user);
        }
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

export function authenticateToken(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
}

export { passport };
