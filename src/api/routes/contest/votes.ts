import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  log,
  serviceCollection,
  validateArray,
  minNumber,
} from '../../../../deps.ts';
import ContestService from '../../../services/contest.ts';
import authHandler from '../../middlewares/authHandler.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const contestInstance = serviceCollection.get(ContestService);
  app.use('/votes', route);

  // POST /
  route.post(
    '/',
    // Auth not required, but userID is being pulled to track voting
    authHandler({ authRequired: false }),
    validate({
      votes: validateArray(true, [minNumber(1)], {
        minLength: 3,
        maxLength: 3,
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await contestInstance.submitVote(
          req.body.votes,
          parseInt(req.body.userInfo.id, 10) || undefined
        );
        res.setStatus(201).json({ ERR: 'ERR' });
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  console.log('Votes router loaded.');
};
