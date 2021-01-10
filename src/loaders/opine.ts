import { Opine, Request, Response, json } from '../../deps.ts';
import routes from '../api/index.ts';

export default (app: Opine) => {
  app.get('/status', (req: Request, res: Response) => {
    res.setStatus(200).end();
  });
  app.head('/status', (req: Request, res: Response) => {
    res.setStatus(200).end();
  });

  app.use(json());
  app.use('/api', routes());
};
