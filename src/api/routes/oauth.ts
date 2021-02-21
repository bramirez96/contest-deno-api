import {
  IRouter,
  log,
  serviceCollection,
  Router,
  required,
  isString,
  Request,
  Response,
  match,
  createError,
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
      }
    }
  );

  route.post(
    '/clever/:userType',
    validate<IOAuthUser>({
      codename: [required, isString, match(codenameRegex)],
      email: [isString, match(emailRegex)],
      firstname: [required, isString],
      lastname: [required, isString],
      password: [required, isString, match(passwordRegex)],
    }),
    async (req: Request, res: Response) => {
      try {
        const cleverResponse = await cleverInstance.registerCleverUser(
          req.body,
          req.params.userType
        );
        res.setStatus(201).json(cleverResponse);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  console.log('OAuth router loaded.');
};
