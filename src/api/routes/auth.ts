import {
  Router,
  Request,
  Response,
  isString,
  isNumber,
  isEmail,
  minLength,
  maxLength,
  required,
  match,
  IRouter,
  serviceCollection,
  log,
  NextFunction,
  createError,
} from '../../../deps.ts';
import {
  codenameRegex,
  emailRegex,
  passwordRegex,
  uuidV5Regex,
} from '../../config/dataConstraints.ts';
import validate from '../middlewares/validate.ts';
import AuthService from '../../services/auth.ts';
import env from '../../config/env.ts';
import { INewUser } from '../../interfaces/users.ts';
import { Roles } from '../../interfaces/roles.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const authServiceInstance = serviceCollection.get(AuthService);
  app.use('/auth', route);

  // POST /register
  route.post(
    '/register',
    validate<INewUser>({
      codename: [
        required,
        isString,
        minLength(1),
        maxLength(20),
        match(codenameRegex),
      ],
      email: [required, isEmail, match(emailRegex)],
      parentEmail: [required, isEmail, match(emailRegex)],
      password: [required, isString, match(passwordRegex)],
      age: [required, isNumber],
      firstname: [required, isString],
      lastname: [required, isString],
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await authServiceInstance.SignUp(req.body);

        res.setStatus(201).json({ message: 'User creation successful.' });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  // POST /login
  route.post(
    '/login',
    validate({
      email: [required, isEmail],
      password: [required, isString],
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await authServiceInstance.SignIn(
          req.body.email,
          req.body.password
        );

        if (req.query.admin && response.user.roleId !== Roles.admin) {
          throw createError(401, `Must be admin to login`);
        }

        logger.debug(`User (ID: ${response.user.id}) successfully signed in`);
        res.setStatus(201).json(response);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  // GET /activation
  route.get(
    '/activation',
    validate(
      {
        token: [required, isString],
        email: [required, isEmail, match(emailRegex)],
      },
      'query'
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token, user } = await authServiceInstance.Validate(
          req.query.email,
          req.query.token
        );
        logger.debug(
          `User (ID: ${user.id}) successfully validated and authenticated`
        );

        const redirectURL = env.REACT_APP_URL + '/activate?authToken=' + token;
        res.redirect(302, redirectURL);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  // GET /reset
  route.get(
    '/reset',
    validate({ email: [required, isEmail, match(emailRegex)] }, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await authServiceInstance.GetResetEmail(req.query.email);

        res.setStatus(200).json({ message: 'Password reset email sent!' });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  // POST /reset
  route.post(
    '/reset',
    validate({
      email: [required, isEmail, match(emailRegex)],
      password: [required, isString, match(passwordRegex)],
      code: [required, isString, match(uuidV5Regex)],
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await authServiceInstance.ResetPasswordWithCode(
          req.body.email,
          req.body.password,
          req.body.code
        );

        res.setStatus(204).end();
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  console.log('Auth router loaded.');
};
