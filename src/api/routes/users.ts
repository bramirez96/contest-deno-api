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
  createError,
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

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const userList = await userModelInstance.get();

    res.setStatus(200).json(userList);
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await userModelInstance.get(
      { id: parseInt(userId) },
      { first: true }
    );
    if (!user) throw createError(404, 'User not found!');

    res.setStatus(200).json(user);
  });

  route.post(
    '/',
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
      await userModelInstance.update(parseInt(userId), {
        ...req.body,
        updatedAt: new Date().toUTCString(),
      });

      return res.setStatus(204).end();
    }
  );

  route.delete(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      await userModelInstance.delete(parseInt(userId));

      return res.setStatus(204).end();
    }
  );

  console.log('User router loaded.');
};
