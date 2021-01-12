import {
  Router,
  Request,
  Response,
  object,
  string,
  IRouter,
  serviceCollection,
  number,
} from '../../../deps.ts';
import {
  codenameRegex,
  emailRegex,
  passwordRegex,
} from '../../config/dataConstraints.ts';
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
        codename: string().min(1).max(20).match(codenameRegex),
        email: string().match(emailRegex),
        parentEmail: string().match(emailRegex),
        password: string().match(passwordRegex),
        age: number(),
        roleId: number(),
      })
    ),
    async (req: Request, res: Response) => {
      const authServiceInstance = serviceCollection.get(AuthService);
      const userModelInstance = serviceCollection.get(UserModel);

      const { user, token } = await authServiceInstance.SignUp(req.body);

      res.setStatus(201).json({ user, token });
    }
  );

  console.log('Auth router loaded.');
};
