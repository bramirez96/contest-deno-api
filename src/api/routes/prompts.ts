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
} from '../../../deps.ts';
import { INewPrompt, IPrompt } from '../../interfaces/prompts.ts';
import { Roles } from '../../interfaces/roles.ts';
import PromptQueueModel from '../../models/promptQueue.ts';
import PromptModel from '../../models/prompts.ts';
import AdminService from '../../services/admin.ts';
import authHandler from '../middlewares/authHandler.ts';
import validate from '../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const promptModelInstance = serviceCollection.get(PromptModel);

  app.use(['/prompt', '/prompts'], route);

  // GET /
  route.get(
    '/',
    authHandler({ roles: [Roles.teacher, Roles.admin] }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const prompts = await promptModelInstance.get(undefined, {
          limit: parseInt(req.query.limit, 10) || 10,
          offset: parseInt(req.query.offset, 10) || 0,
          orderBy: (req.query.orderBy as keyof IPrompt) || 'id',
          order: (req.query.order as 'ASC' | 'DESC') || 'ASC',
          first: req.query.first === 'true',
        });

        res.setStatus(200).json(prompts);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  // GET /active
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

  // PUT /active <- this runs the service that updates current prompt
  route.put(
    '/active',
    authHandler({ roles: [Roles.admin] }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const adminServiceInstance = serviceCollection.get(AdminService);
        await adminServiceInstance.updateActivePrompt();

        res.setStatus(204).json();
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  // GET /:id
  route.get(
    '/:id',
    authHandler({ roles: [Roles.teacher, Roles.admin] }),
    validate({ id: [required, isNumber] }, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const prompt = await promptModelInstance.get(
          { id: parseInt(req.params.id) },
          { first: true }
        );

        res.setStatus(200).json(prompt);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  // POST /
  route.post(
    '/',
    authHandler({ roles: [Roles.admin] }),
    validate<INewPrompt>({ prompt: [required, isString] }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const [newPrompt] = await promptModelInstance.add({
          prompt: req.body.prompt,
          approved: true,
          creatorId: req.body.userInfo.id,
        });
        res.setStatus(201).json(newPrompt);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  // POST /custom
  route.post(
    '/custom',
    authHandler({ roles: [Roles.teacher, Roles.admin] }),
    validate({ prompt: [required, isString] }),
    async (req, res) => {
      try {
        const [newPrompt] = await promptModelInstance.add({
          prompt: req.body.prompt,
          approved: false,
          creatorId: req.body.userInfo.id,
        });
        res.setStatus(201).json(newPrompt);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  // PUT /:id
  route.put(
    '/:id',
    authHandler({ roles: [Roles.admin] }),
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

  // DELETE /:id
  route.delete(
    '/:id',
    authHandler({ roles: [Roles.admin] }),
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

  // GET /queue
  route.get(
    '/queue',
    authHandler({ roles: [Roles.teacher, Roles.admin] }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const queueModelInstance = serviceCollection.get(PromptQueueModel);
        const promptQueue = await queueModelInstance.get(undefined, {
          orderBy: 'starts_at',
          order: 'ASC',
        });
        res.setStatus(200).json(promptQueue);
      } catch (err) {
        logger.error(err);
        next(err);
      }
    }
  );

  console.log('Prompt router loaded.');
};
