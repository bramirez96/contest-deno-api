import { Router, IRouter, Request, Response } from '../../../deps.ts';
import upload from '../middlewares/upload.ts';

const route = Router();

export default (app: IRouter) => {
  app.use('/submit', route);

  route.post('/story', upload, (req: Request, res: Response) => {
    res.setStatus(200).end();
  });
};
