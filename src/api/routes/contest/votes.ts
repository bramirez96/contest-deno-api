import {
  Router,
  IRouter,
  Request,
  Response,
  NextFunction,
  log,
  serviceCollection,
  validateArray,
  validateObject,
  isString,
  required,
  isNumber,
  minNumber,
  isArray,
} from '../../../../deps.ts';
import { INewSubmission } from '../../../interfaces/submissions.ts';
import { INewVote } from '../../../interfaces/votes.ts';
import SubmissionModel from '../../../models/submissions.ts';
import AdminService from '../../../services/admin.ts';
import ContestService from '../../../services/contest.ts';
import SubmissionService from '../../../services/submission.ts';
import authHandler from '../../middlewares/authHandler.ts';
import upload from '../../middlewares/upload.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const contestInstance = serviceCollection.get(ContestService);
  app.use('/votes', route);

  // POST /
  route.post(
    '/',
    authHandler({ authRequired: false }),
    validate({
      votes: validateArray(true, [minNumber(1)], {
        minLength: 3,
        maxLength: 3,
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      await contestInstance.submitVote(
        req.body.votes,
        parseInt(req.body.userInfo.id, 10) || undefined
      );
      res.setStatus(201).json({ ERR: 'ERR' });
    }
  );

  console.log('Votes router loaded.');
};
