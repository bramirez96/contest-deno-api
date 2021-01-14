import {
  Router,
  IRouter,
  Request,
  Response,
  serviceCollection,
} from '../../../deps.ts';
import MailService from '../../services/mailer.ts';
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

  route.post(
    '/test',
    restricted({ adminOnly: true, authRequired: true }),
    (req: Request, res: Response) => {
      res.setStatus(200).json({ hit: 'it' });
    }
  );

  route.get('/test', async (req: Request, res: Response) => {
    const mailServiceInstance = serviceCollection.get(MailService);
    const result = await mailServiceInstance.sendEmail();
    res.setStatus(200).json(result);
  });
};
