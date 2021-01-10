import {
  Router,
  Request,
  Response,
  object,
  string,
  IRouter,
} from '../../../deps.ts';
import { emailRegex, passwordRegex } from '../../config/dataConstraints.ts';
import validateBody from '../middlewares/validateBody.ts';

const route = Router();

export default (app: IRouter) => {
  app.use('/auth', route);

  route.post(
    '/register',
    validateBody(
      object({
        email: string().match(emailRegex),
        password: string().match(passwordRegex),
      })
    ),
    (req: Request, res: Response) => {
      res.setStatus(201).json({ message: 'HIT' });
    }
  );

  console.log('Auth router loaded.');
};
