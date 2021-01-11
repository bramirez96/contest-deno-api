import {
  Router,
  Request,
  Response,
  object,
  string,
  IRouter,
  serviceCollection,
} from '../../../deps.ts';
import { emailRegex, passwordRegex } from '../../config/dataConstraints.ts';
import validateBody from '../middlewares/validateBody.ts';
import AuthService from '../../services/auth.ts';
import UserModel from '../../models/user.ts';

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
    async (req: Request, res: Response) => {
      const authServiceInstance = serviceCollection.get(AuthService);
      const userModelInstance = serviceCollection.get(UserModel);

      // await authServiceInstance.SignUp();
      await userModelInstance.add({
        age: 12,
        codename: 'SomeCodename',
        email: 'someemail@email.com',
        parentEmail: 'someemail@email.com',
        password: 'aComplexPasswordString',
      });
      res.setStatus(201).json({ message: 'HIT' });
    }
  );

  console.log('Auth router loaded.');
};
