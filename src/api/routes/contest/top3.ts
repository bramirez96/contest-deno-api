import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  log,
  serviceCollection,
} from '../../../../deps.ts';
import Top3Model from '../../../models/top3.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const top3ModelInstance = serviceCollection.get(Top3Model);

  app.use('/top', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subs = await top3ModelInstance.get();

      res.setStatus(200).json(subs);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  });
};
