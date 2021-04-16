import {
  IRouter,
  log,
  required,
  Router,
  serviceCollection,
} from '../../../../deps.ts';
import FeedbackService from '../../../services/feedback.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const feedbackServiceInstance = serviceCollection.get(FeedbackService);
  app.use('/feedback', route);

  // /feedback/complete?studentId=:studentId&rumbleId=:rumbleId
  route.get(
    '/complete',
    validate(
      {
        studentId: [required],
        rumbleId: [required],
      },
      'query'
    ),
    async (req, res) => {
      try {
        const hasVoted = await feedbackServiceInstance.checkIfFeedbackWasSubmitted(
          {
            rumbleId: parseInt(req.query.rumbleId, 10),
            studentId: parseInt(req.query.studentId, 10),
          }
        );

        res.setStatus(200).json(hasVoted);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  console.log('Feedback router loaded.');
};
