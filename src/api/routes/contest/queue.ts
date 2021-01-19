import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  serviceCollection,
  log,
} from '../../../../deps.ts';
import PromptQueueModel from '../../../models/promptQueue.ts';
import AdminService from '../../../services/admin.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use(['/queue'], route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queueModelInstance = serviceCollection.get(PromptQueueModel);
      const promptQueue = await queueModelInstance.get(undefined, {
        orderBy: 'startDate',
        order: 'ASC',
      });
      res.setStatus(200).json(promptQueue);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  });

  route.get(
    '/test',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const adminServiceInstance = serviceCollection.get(AdminService);
        const newId = await adminServiceInstance.updateActivePrompt();

        res
          .setStatus(200)
          .json({ message: `Successfully marked prompt ${newId} as active` });
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  console.log('Prompt router loaded.');
};
