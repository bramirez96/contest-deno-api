import { Router, IRouter, log, serviceCollection } from '../../../../deps.ts';
import CleverService from '../../../services/cleverService.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const cleverServiceInstance = serviceCollection.get(CleverService);
  app.use('/data', route);

  route.get('/', async (req, res) => {
    try {
      const data = await cleverServiceInstance.getEnumData();
      res.setStatus(200).json(data);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  });

  console.log('Rumble data route loaded.');
};
