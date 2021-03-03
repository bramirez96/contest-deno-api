import { Router, IRouter, log, serviceCollection } from '../../../../deps.ts';
import CleverService from '../../../services/cleverService.ts';
import authHandler from '../../middlewares/authHandler.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const cleverServiceInstance = serviceCollection.get(CleverService);
  app.use(route);

  route.get('/', authHandler(), async (req, res) => {
    try {
      const data = await cleverServiceInstance.getUserInfo(req.body.user);
      res.setStatus(200).json(data);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  });

  console.log('Rumble data route loaded.');
};
