import {
  jwt,
  Request,
  Response,
  NextFunction,
  createError,
} from '../../../deps.ts';
import env from '../../config/env.ts';

export default (authRequired = true) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get('Authorization');

  if (!token) {
    // If no token, check if auth is even required...
    if (authRequired) next(createError(401, 'You must be logged in.'));
    else next();
  } else {
    try {
      const { iss, sub, exp } = await jwt.verify(
        token,
        env.JWT.SECRET,
        env.JWT.ALGO
      );

      // If token is expired, let them know
      if (!exp || exp < Date.now()) next(createError(401, 'Token is expired'));
      // If token is formatted incorrectly
      else if (!iss || !sub) next(createError(401, 'Invalid token'));
      else {
        // Pull the relevant snippets and continue
        req.body.email = iss;
        req.body.codename = sub;
        next();
      }
    } catch (err) {
      next(createError(401, err.message));
    }
  }
};
