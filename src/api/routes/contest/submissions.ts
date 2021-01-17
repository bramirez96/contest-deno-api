import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  log,
  serviceCollection,
  multiParser,
  createError,
} from '../../../../deps.ts';
import authHandler from '../../middlewares/authHandler.ts';
import upload from '../../middlewares/upload.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use(['/submit', '/submission', '/submissions'], route);

  route.post(
    '/',
    upload('story'),
    authHandler({ authRequired: true }),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        res.setStatus(201).json({ message: 'Upload successful!' });
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  route.get(
    '/',
    authHandler({ authRequired: false }),
    (req: Request, res: Response) => {
      // I don't know what this one does yet??
      res.setStatus(200).json({ hit: req.path });
    }
  );

  route.get(
    '/:submissionId',
    authHandler({ authRequired: false }),
    (req: Request, res: Response, next: NextFunction) => {
      // Here is where you get submission data from s3
      res.setStatus(200).json({ hit: req.path });
    }
  );

  route.post(
    '/test',
    authHandler({ adminOnly: true, authRequired: true }),
    (req: Request, res: Response, next: NextFunction) => {
      res.setStatus(200).json({ hit: 'it' });
    }
  );

  console.log('Submission router loaded.');
};
