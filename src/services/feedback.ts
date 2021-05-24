import { Inject, Service, serviceCollection } from '../../deps.ts';
import RumbleFeedbackModel from '../models/rumbleFeedback.ts';
import BaseService from './baseService.ts';

@Service()
export default class FeedbackService extends BaseService {
  constructor(
    @Inject(RumbleFeedbackModel) private feedbackModel: RumbleFeedbackModel
  ) {
    super();
  }

  // TODO rename this
  public async checkIfFeedbackWasSubmitted({
    rumbleId,
    studentId,
  }: {
    rumbleId: number;
    studentId: number;
  }): Promise<boolean> {
    try {
      // Get the feedback that the student gave in this rumble
      const feedback = await this.feedbackModel.getFeedbackByRumbleAndVoterIds({
        rumbleId,
        voterId: studentId,
      });

      // Check if they've actually voted
      const hasVoted = feedback.some(
        (fbItem) => !!fbItem.score1 || !!fbItem.score2 || !!fbItem.score3
      );

      return hasVoted;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(FeedbackService);
