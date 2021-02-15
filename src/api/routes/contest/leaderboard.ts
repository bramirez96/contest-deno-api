import {
  Router,
  IRouter,
  Request,
  Response,
  log,
  serviceCollection,
} from '../../../../deps.ts';
import ContestService from '../../../services/contest.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const contestServiceInstance = serviceCollection.get(ContestService);
  app.use(['/scoreboard', '/leaderboard'], route);

  // GET /
  route.get('/', async (req: Request, res: Response) => {
    try {
      const leaderboard = await contestServiceInstance.getLeaderboard();
      res.setStatus(200).json(leaderboard);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  });

  console.log('Leaderboard router loaded.');
};
