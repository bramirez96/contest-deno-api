import { Router, IRouter, Request, Response } from '../../../../deps.ts';
import restricted from '../../middlewares/restricted.ts';
import upload from '../../middlewares/upload.ts';

const route = Router();

export default (app: IRouter) => {
  app.use('/submit', route);

  route.post(
    '/',
    restricted({ authRequired: true }),
    upload,
    (req: Request, res: Response) => {
      res.setStatus(200).end();
    }
  );

  route.get(
    '/',
    restricted({ authRequired: false }),
    (req: Request, res: Response) => {
      res.setStatus(200).end();
    }
  );

  route.post(
    '/test',
    restricted({ adminOnly: true, authRequired: true }),
    (req: Request, res: Response) => {
      res.setStatus(200).json({ hit: 'it' });
    }
  );
};
