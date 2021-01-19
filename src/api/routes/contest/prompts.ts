import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  serviceCollection,
  log,
} from '../../../../deps.ts';
// import PromptModel from '../../../models/prompts.ts';
import AdminService from '../../../services/admin.ts';
import authHandler from '../../middlewares/authHandler.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use(['/prompt', '/prompts'], route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const promptModelInstance = serviceCollection.get(PromptModel);
      // const prompt = await promptModelInstance.getCurrent();
      await null;
      res.setStatus(200).json({});
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
