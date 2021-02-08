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
 * Defaults to requiring any authenticated user.
 * Adds to body: { userInfo: { id, email, codename } };
 */
export default ({
  roles = [1, 2, 3],
  authRequired = true,
}: IAuthHandlerConfig) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const token = req.get('Authorization');

  // Add this to the body no matter what to prevent errors
  req.body.userInfo = {};

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
      const { id, email, codename, exp } = (await jwt.verify(
        token,
        env.JWT.SECRET,
        env.JWT.ALGO
      )) as jwt.Payload & { email: string; id: string; codename: string };

      logger.debug('Checking token expiration');
      if (!exp || exp < Date.now()) {
        // If token is expired, let them know
        throw createError(401, 'Token is expired');
      } else if (!id || !email || !codename) {
        // If token is formatted incorrectly
        throw createError(401, 'Invalid token body');
      } else {
        if (roles) {
          logger.debug(
            `Successfully authenticated, authorizing for roles: \
            ${roles.join(', ')}`
          );
          // Get an instance of the UserModel if we need to role check
          const userModelInstance = serviceCollection.get(UserModel);
          const role = await userModelInstance.getRole(parseInt(id, 10));
          if (!roles.includes(role.id)) {
            throw createError(401, 'Must be admin');
          }
        }
        // Pull the relevant snippets and continue
        req.body.userInfo.email = email;
        req.body.userInfo.id = id;
        req.body.userInfo.codename = codename;
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
  roles?: number[];
}
