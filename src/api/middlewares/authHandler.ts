import {
  jwt,
  Request,
  Response,
  NextFunction,
  createError,
  serviceCollection,
  log,
} from '../../../deps.ts';
import env from '../../config/env.ts';
import UserModel from '../../models/users.ts';

/**
 * Defaults to authReuired and adminOnly being true
 */
export default (config?: IAuthHandlerConfig) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const token = req.get('Authorization');

  const authRequired = config?.authRequired || true;
  const adminOnly = config?.adminOnly || true;

  if (!token || token === 'null') {
    // If no token, check if auth is even required...
    if (authRequired) throw createError(401, 'You must be logged in');
    // If it's not required, this is like the voting route, where
    // the token is optional and you can continue without it
    else return next();
  } else {
    // If it's there, we'll try to
    try {
      logger.debug('Attempting to verify token');
      const { iss, sub, exp } = await jwt.verify(
        token,
        env.JWT.SECRET,
        env.JWT.ALGO
      );

      const id = parseInt(sub || `${sub}`);
      const email = iss;

      logger.debug('Checking token expiration');
      if (!exp || exp < Date.now()) {
        // If token is expired, let them know
        throw createError(401, 'Token is expired');
      } else if (!id || !email) {
        // If token is formatted incorrectly
        throw createError(401, 'Invalid token body');
      } else {
        if (adminOnly) {
          logger.debug('Successfully authenticated, checking admin status');
          // Get an instance of the UserModel if we need to admin check
          const userModelInstance = serviceCollection.get(UserModel);
          // If user is not an admin
          // const userIsAdmin = await userModelInstance.checkIsAdmin(id);
          const userIsAdmin = true;
          if (!userIsAdmin) {
            throw createError(401, 'Must be admin');
          }
        }
        // Pull the relevant snippets and continue
        req.body.email = email;
        req.body.id = id;
        next();
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
};

interface IAuthHandlerConfig {
  authRequired?: boolean;
  adminOnly?: boolean;
}
