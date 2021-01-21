import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  serviceCollection,
  log,
  isNumber,
  required,
  isString,
  isBool,
  createError,
} from '../../../../deps.ts';
import { INewPrompt, IPrompt } from '../../../interfaces/prompts.ts';
import PromptModel from '../../../models/prompts.ts';
import authHandler from '../../middlewares/authHandler.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const promptModelInstance = serviceCollection.get(PromptModel);

  app.use(['/prompt', '/prompts'], route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const prompts = await promptModelInstance.get();

      res.setStatus(200).json(prompts);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  });

  route.get(
    '/active',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const currentPrompt = await promptModelInstance.get(
          { active: true },
          { first: true }
        );
        if (!currentPrompt) throw createError(404, 'No prompt currently set!');

        res.setStatus(200).json(currentPrompt);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  route.get(
    '/:id',
    validate({ id: [required, isNumber] }, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const prompt = await promptModelInstance.get(
          { id: parseInt(req.params.id) },
          { first: true }
        );
        if (!prompt) throw createError(404, 'Prompt not found!');

        res.setStatus(200).json(prompt);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  route.post(
    '/',
    validate<INewPrompt>({ prompt: [required, isString] }, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const newPrompt = await promptModelInstance.add(req.body, true);

        res.setStatus(200).json(newPrompt);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  route.put(
    '/:id',
    validate({ id: [required, isNumber] }, 'params'),
    validate<IPrompt>({ active: [isBool], prompt: [isString] }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await promptModelInstance.update(parseInt(req.params.id), req.body);

        res.setStatus(204).end();
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  route.delete(
    '/:id',
    validate({ id: [required, isNumber] }, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await promptModelInstance.delete(parseInt(req.params.id));

        res.setStatus(204).end();
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  console.log('Prompt router loaded.');
};
