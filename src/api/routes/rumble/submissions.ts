import {
  IRouter,
  isString,
  log,
  required,
  Router,
  serviceCollection,
  validateArray,
  validateObject,
} from '../../../../deps.ts';
import { Sources } from '../../../interfaces/enumSources.ts';
import SubmissionService from '../../../services/submission.ts';
import authHandler from '../../middlewares/authHandler.ts';
import upload from '../../middlewares/upload.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

// /api/rumble/submissions
export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const subServiceInstance = serviceCollection.get(SubmissionService);
  app.use('/submissions', route);

  route.post(
    '/',
    authHandler(),
    validate({
      story: validateArray(
        true,
        validateObject(true, {
          name: [required, isString],
          filename: [required, isString],
          size: [required, isString],
        }),
        { minLength: 1, maxLength: 1 }
      ),
      promptId: [required, isString],
    }),
    upload('story'),
    async (req, res) => {
      try {
        await subServiceInstance.processSubmission(
          req.body.story[0],
          parseInt(req.body.promptId, 10),
          req.body.userInfo.id,
          Sources.Rumble
        );

        res.setStatus(201).json({ message: 'Upload successful!' });
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  console.log('Rumble submission route loaded.');
};
