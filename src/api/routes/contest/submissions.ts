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
} from '../../../../deps.ts';
import { INewSubmission } from '../../../interfaces/submissions.ts';
import SubmissionService from '../../../services/submission.ts';
import authHandler from '../../middlewares/authHandler.ts';
import upload from '../../middlewares/upload.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use(['/submit', '/submission', '/submissions'], route);

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
        const submissionModelInstance = serviceCollection.get(
          SubmissionService
        );
        await submissionModelInstance.processSubmission(
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

  console.log('Submission router loaded.');
};
