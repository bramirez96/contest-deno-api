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
  isIn,
  NextFunction,
  isBool,
} from '../../../deps.ts';
import {
  codenameRegex,
  emailRegex,
  passwordRegex,
} from '../../config/dataConstraints.ts';
import UserModel from '../../models/users.ts';
import authHandler from '../middlewares/authHandler.ts';
import validate from '../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const userModelInstance = serviceCollection.get(UserModel);
  app.use('/users', route);

  route.get(
    '/',
    authHandler(),
    async (req: Request, res: Response, next: NextFunction) => {
      const userList = await userModelInstance.getAll();

      res.setStatus(200).json(userList);
    }
  );

  route.get(
    '/:id',
    authHandler({ authRequired: true, adminOnly: true }),
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const user = await userModelInstance.getOne({ id: parseInt(userId) });

      res.setStatus(200).json(user);
    }
  );

  route.post(
    '/',
    authHandler(),
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
      roleId: [required, isNumber, isIn([1, 2])],
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const newUser = await userModelInstance.add(req.body, true);

      return res.setStatus(201).json(newUser);
    }
  );

  route.put(
    '/:id',
    authHandler(),
    validate({
      codename: [isString, minLength(1), maxLength(20), match(codenameRegex)],
      email: [isEmail, match(emailRegex)],
      parentEmail: [isEmail, match(emailRegex)],
      password: [isString, match(passwordRegex)],
      age: [isNumber],
      roleId: [isNumber, isIn([1, 2])],
      isValidated: [isBool],
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      await userModelInstance.update(parseInt(userId), req.body);

      return res.setStatus(204).end();
    }
  );

  route.delete(
    '/:id',
    authHandler(),
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      await userModelInstance.delete(parseInt(userId));

      return res.setStatus(204).end();
    }
  );
};
