import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
} from '../../../../deps.ts';
import authHandler from '../../middlewares/authHandler.ts';
import upload from '../../middlewares/upload.ts';

const route = Router();

export default (app: IRouter) => {
  app.use(['/submit', '/submission', '/submissions'], route);

  route.post(
    '/',
    authHandler({ authRequired: true }),
    upload,
    (req: Request, res: Response) => {
      res.setStatus(200).end();
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
    (req: Request, res: Response) => {
      // Here is where you get submission data from s3
      res.setStatus(200).json({ hit: req.path });
    }
  );

  route.post(
    '/test',
    authHandler({ adminOnly: true, authRequired: true }),
    (req: Request, res: Response) => {
      res.setStatus(200).json({ hit: 'it' });
    }
  );

  console.log('Submission router loaded.');
};
