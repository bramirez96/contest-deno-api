import {
  IRouter,
  isString,
  log,
  match,
  Request,
  required,
  Response,
  Router,
  serviceCollection,
} from '../../../deps.ts';
import {
  codenameRegex,
  emailRegex,
  passwordRegex,
} from '../../config/dataConstraints.ts';
import { IOAuthUser } from '../../interfaces/users.ts';
import CleverService from '../../services/cleverService.ts';
import validate from '../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const cleverInstance = serviceCollection.get(CleverService);
  app.use('/o', route);

  route.get(
    '/clever',
    validate({ code: [required, isString] }, 'query'),
    async (req: Request, res: Response) => {
      try {
        const cleverResponse = await cleverInstance.authorizeUser(
          req.query.code
        );
        res.setStatus(200).json(cleverResponse);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  route.get('/clever/button', (req, res) => {
    try {
      const loginButtonURI = cleverInstance.getLoginButtonURI();
      res.setStatus(200).json({ url: loginButtonURI });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  });

  // POST /api/auth/o/clever/signup?userType=student&cleverId=someID
  route.post(
    '/clever/signup',
    validate<IOAuthUser>({
      codename: [required, isString, match(codenameRegex)],
      email: [isString, match(emailRegex)],
      firstname: [required, isString],
      lastname: [required, isString],
      password: [required, isString, match(passwordRegex)],
    }),
    validate(
      {
        userType: [required, isString],
        cleverId: [required, isString],
      },
      'query'
    ),
    async (req: Request, res: Response) => {
      try {
        const cleverResponse = await cleverInstance.registerCleverUser(
          req.body,
          req.query.userType,
          req.query.cleverId
        );
        res.setStatus(201).json(cleverResponse);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  // POST /api/auth/o/clever/merge?cleverId=someid
  route.post(
    '/clever/merge',
    validate({
      codename: [required, isString],
      password: [required, isString],
    }),
    validate({ cleverId: [required, isString] }, 'query'),
    async (req: Request, res: Response) => {
      try {
        const authResponse = await cleverInstance.loginAndMerge(
          req.body.codename,
          req.body.password,
          req.query.cleverId
        );
        res.setStatus(201).json(authResponse);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  console.log('OAuth router loaded.');
};
