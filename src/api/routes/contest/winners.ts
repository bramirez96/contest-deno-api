import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  log,
  serviceCollection,
  validateArray,
  validateObject,
  isString,
  required,
  isNumber,
  minNumber,
  isIn,
  isArray,
} from '../../../../deps.ts';
import authHandler from '../../middlewares/authHandler.ts';
import validate from '../../middlewares/validate.ts';
import WinnerModel from '../../../models/winners.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const winnerModelInstance = serviceCollection.get(WinnerModel);

  app.use(['/winner', '/winners'], route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const winner = await winnerModelInstance.get();

      res.setStatus(200).json(winner);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  });
};
