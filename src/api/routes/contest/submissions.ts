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
import AdminService from '../../../services/admin.ts';
import SubmissionService from '../../../services/submission.ts';
import authHandler from '../../middlewares/authHandler.ts';
import upload from '../../middlewares/upload.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const subServiceInstance = serviceCollection.get(SubmissionService);
  const adminServiceInstance = serviceCollection.get(AdminService);
  app.use(['/submit', '/submission', '/submissions'], route);

  // POST /
  route.post(
    '/',
    authHandler({ adminOnly: false, authRequired: true }),
    // This will ensure there is only one item in the story field before upload
    validate<INewSubmission>({
      story: validateArray(
        true,
        validateObject(true, {
          name: [required, isString],
          filename: [required, isString],
          size: [required, isNumber],
        }),
        { minLength: 1, maxLength: 1 }
      ),
      promptId: [required, isString],
    }),
    upload('story'),
    // Make sure upload was processed correctly
    validate({
      story: validateArray(
        true,
        validateObject(true, {
          etag: [required, isString],
          s3Label: [required, isString],
        }),
        { minLength: 1, maxLength: 1 }
      ),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await subServiceInstance.processSubmission(
          req.body.story[0],
          parseInt(req.body.promptId, 10),
          req.body.userInfo.id
        );
        res.setStatus(201).json({ message: 'Upload successful!' });
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  // GET /
  route.get(
    '/',
    authHandler({ adminOnly: false, authRequired: false }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // TODO read query params into a generic query!
        const subs = await subServiceInstance.getSubs({
          limit: parseInt(req.query.limit, 10) || 10,
          offset: parseInt(req.query.offset, 10) || 0,
          orderBy: req.query.orderBy || 'id',
          order: req.query.order || 'ASC',
        });

        res.setStatus(200).json(subs);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  // GET /top
  route.get('/top', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subs = await subServiceInstance.getTop3Subs();
      res.setStatus(200).json(subs);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  });

  // POST /top
  route.post(
    '/top',
    validate({
      ids: validateArray(true, [minNumber(1)], {
        minLength: 3,
        maxLength: 3,
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const top3 = await subServiceInstance.setTop3(req.body.ids);
      res.setStatus(201).json({ top3, message: 'Top 3 successfully set!' });
    }
  );

  // GET /winner
  route.get(
    '/winner',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const winner = await subServiceInstance.getRecentWinner();
        res.setStatus(200).json(winner);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  // GET /flags
  route.get(
    '/:id/flags',
    async (req: Request, res: Response, next: NextFunction) => {
      const flags = await subServiceInstance.getFlagsBySubId(
        parseInt(req.params.id, 10)
      );
      res.setStatus(200).json(flags);
    }
  );

  // POST /flags
  route.post(
    '/:id/flags',
    validate({ flags: [isArray] }, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      const flags = await subServiceInstance.flagSubmission(
        parseInt(req.params.id, 10),
        req.body.flags
      );

      res
        .setStatus(201)
        .json({ flags, message: 'Successfully flagged submission' });
    }
  );

  console.log('Submission router loaded.');
};
