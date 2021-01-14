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
} from '../../../deps.ts';
import {
  codenameRegex,
  emailRegex,
  passwordRegex,
} from '../../config/dataConstraints.ts';
import validateBody from '../middlewares/validateBody.ts';
import AuthService from '../../services/auth.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use('/auth', route);

  route.post(
    '/register',
    validateBody(
      object({
        codename: string().min(1).max(20).match(codenameRegex),
        email: string().match(emailRegex),
        parentEmail: string().match(emailRegex),
        password: string().match(passwordRegex),
        age: number(),
      })
    ),
    async (req: Request, res: Response) => {
      const authServiceInstance = serviceCollection.get(AuthService);
      const { user, token } = await authServiceInstance.SignUp(req.body, {
        roleId: 1,
      });
      logger.debug(`User (ID: ${user.id}) successfully registered`);
      res.setStatus(201).json({ user, token });
    }
  );

  route.post(
    '/login',
    validateBody(
      object({
        email: string().match(emailRegex),
        password: string(),
      })
    ),
    async (req: Request, res: Response) => {
      const authServiceInstance = serviceCollection.get(AuthService);
      const { user, token } = await authServiceInstance.SignIn(
        req.body.email,
        req.body.password
      );
      logger.debug(`User (ID: ${user.id}) successfully signed in`);
      res.setStatus(200).json({ user, token });
    }
  );

  console.log('Auth router loaded.');
};
