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
  isIn,
  isArray,
} from '../../../../deps.ts';
import SubmissionModel from '../../../models/submissions.ts';
import AdminService from '../../../services/admin.ts';
import authHandler from '../../middlewares/authHandler.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const adminServiceInstance = serviceCollection.get(AdminService);

  app.use('/admin', route);

  route.get(
    '/top',
    authHandler({ adminOnly: false, authRequired: false }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const submissionModelInstance = serviceCollection.get(SubmissionModel);
        const top10 = await submissionModelInstance.getTodaysTop10();

        res.setStatus(200).json(top10);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  route.post(
    '/top',
    validate({
      ids: validateArray(true, [minNumber(1)], {
        minLength: 3,
        maxLength: 3,
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const top3 = await adminServiceInstance.setTop3(req.body.ids);

      res.setStatus(201).json({ top3, message: 'Top 3 successfully set!' });
    }
  );

  route.get(
    '/flags',
    validate({ submissionId: [required] }, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
      const flags = await adminServiceInstance.getFlagsBySubId(
        parseInt(req.query.submissionId)
      );
      res.setStatus(200).json({ flags, message: 'Received flags' });
    }
  );

  route.post(
    '/flags',
    validate({ submissionId: [required] }, 'query'),
    validate({ flags: [isArray] }, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      const flags = await adminServiceInstance.flagSubmission(
        req.query.submissionId,
        req.body.flags
      );

      res
        .setStatus(201)
        .json({ flags, message: 'Successfully flagged submission' });
    }
  );

  console.log('Contest Admin router loaded.');
};
