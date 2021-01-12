import { Router, IRouter, Request, Response } from '../../../deps.ts';
import restricted from '../middlewares/restricted.ts';
import upload from '../middlewares/upload.ts';

const route = Router();

export default (app: IRouter) => {
  app.use('/submit', route);

  route.post(
    '/story',
    restricted({ authRequired: false }),
    (req: Request, res: Response) => {
      console.log({ body: req.body });
      res.setStatus(200).end();
    }
  );
};
