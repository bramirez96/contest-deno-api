import {
  jwt,
  Request,
  Response,
  NextFunction,
  createError,
  serviceCollection,
} from '../../../deps.ts';
import env from '../../config/env.ts';
import UserModel from '../../models/user.ts';

export default ({
  authRequired = true,
  adminOnly = false,
}: IRestrictedConfig) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get('Authorization');
  // const daysUntilExpiry = 2;
  // const today = new Date();
  // const exp = new Date(today);
  // exp.setDate(today.getDate() + daysUntilExpiry);
  // const token = await jwt.create(
  //   { alg: env.JWT.ALGO },
  //   { iss: 'anemawwww@email.com', sub: '2', exp: exp.getTime() },
  //   env.JWT.SECRET
  // );

  if (!token) {
    // If no token, check if auth is even required...
    if (authRequired) next(createError(401, 'You must be logged in'));
    // If it's not required, this is like the voting route, where
    // the token is optional and you can continue without it
    else next();
  } else {
    // If it's there, we'll try to
    try {
      const { iss, sub, exp } = await jwt.verify(
        token,
        env.JWT.SECRET,
        env.JWT.ALGO
      );

      const id = parseInt(sub || `${sub}`);
      const email = iss;

      if (!exp || exp < Date.now()) {
        // If token is expired, let them know
        return next(createError(401, 'Token is expired'));
        // If token is formatted incorrectly
      } else if (!id || !email) {
        return next(createError(401, 'Invalid token body'));
      } else {
        if (adminOnly) {
          // Get an instance of the UserModel if we need to admin check
          const userModelInstance = serviceCollection.get(UserModel);
          // If user is not an admin
          if (!(await userModelInstance.isAdmin(id))) {
            return next(createError(401, 'Must be admin'));
          }
        }
        // Pull the relevant snippets and continue
        req.body.email = email;
        req.body.id = id;
        next();
      }
    } catch (err) {
      next(createError(401, 'Could not authenticate'));
    }
  }
};

interface IRestrictedConfig {
  authRequired?: boolean;
  adminOnly?: boolean;
}
