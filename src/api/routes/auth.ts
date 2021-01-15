import {
  Router,
  Request,
  Response,
  object,
  string,
  IRouter,
  serviceCollection,
  number,
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

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use('/auth', route);

  route.post(
    '/register',
    validate(
      object({
        codename: string().min(1).max(20).match(codenameRegex),
        email: string().match(emailRegex),
        parentEmail: string().match(emailRegex),
        password: string().match(passwordRegex),
        age: number(),
      })
    ),
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
    validate(
      object({
        email: string().match(emailRegex),
        password: string(),
      })
    ),
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
    '/activate',
    validate(
      object({
        token: string(),
        email: string(),
      }),
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
          `User (ID: ${user.id}) successfully validated and signed in`
        );
        res.setStatus(200).json({ user, token });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  route.get(
    '/reset',
    validate(object({ email: string() }), 'query'),
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
    validate(
      object({
        email: string(),
        password: string().match(passwordRegex),
        code: string().match(uuidV5Regex),
      })
    ),
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
