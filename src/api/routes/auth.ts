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

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use('/auth', route);

  route.post(
    '/register',
    validate({
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
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = serviceCollection.get(AuthService);
        await authServiceInstance.SignUp(req.body, {
          roleId: 1,
        });

        res.setStatus(201).json({ message: 'User creation successful.' });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  route.post(
    '/login',
    validate({
      email: [required, isEmail],
      password: [required, isString],
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = serviceCollection.get(AuthService);
        const { user, token } = await authServiceInstance.SignIn(
          req.body.email,
          req.body.password
        );
        logger.debug(`User (ID: ${user.id}) successfully signed in`);
        res.setStatus(200).json({ user, token });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

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
        const authServiceInstance = serviceCollection.get(AuthService);
        const { user, token } = await authServiceInstance.Validate(
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

  route.get(
    '/reset',
    validate(
      {
        email: [required, isEmail, match(emailRegex)],
      },
      'query'
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = serviceCollection.get(AuthService);
        await authServiceInstance.GetResetEmail(req.query.email);

        res.setStatus(200).json({ message: 'Password reset email sent!' });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  route.post(
    '/reset',
    validate({
      email: [required, isEmail, match(emailRegex)],
      password: [required, isString, match(passwordRegex)],
      code: [required, isString, match(uuidV5Regex)],
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = serviceCollection.get(AuthService);
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
