import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  serviceCollection,
  log,
} from '../../../../deps.ts';
import PromptModel from '../../../models/prompts.ts';
import authHandler from '../../middlewares/authHandler.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use(['/prompt', '/prompts'], route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const promptModelInstance = serviceCollection.get(PromptModel);
      const prompt = await promptModelInstance.get(
        { active: true },
        { first: true }
      );
      res.setStatus(200).json(prompt);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  });

  console.log('Prompt router loaded.');
};
