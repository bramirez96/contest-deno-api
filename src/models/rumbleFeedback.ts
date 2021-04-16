import { Service, serviceCollection } from '../../deps.ts';
import {
  INewRumbleFeedback,
  IRumbleFeedback,
} from '../interfaces/rumbleFeedback.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class RumbleFeedbackModel extends BaseModel<
  INewRumbleFeedback,
  IRumbleFeedback
> {
  constructor() {
    super('rumble_feedback');
  }

  public async getFeedbackByRumbleAndVoterIds({
    rumbleId,
    voterId,
  }: {
    rumbleId: number;
    voterId: number;
  }): Promise<IRumbleFeedback[]> {
    const feedback = ((await this.db
      .table('rumble_feedback')
      .innerJoin(
        'submissions',
        'submissions.id',
        'rumble_feedback.submissionId'
      )
      .innerJoin('prompts', 'prompts.id', 'submissions.promptId')
      .innerJoin('rumbles', 'rumbles.promptId', 'prompts.id')
      .where('rumble_feedback.voterId', voterId)
      .where('rumbles.id', rumbleId)
      .execute()) as unknown) as IRumbleFeedback[];

    return feedback;
  }
}

serviceCollection.addTransient(RumbleFeedbackModel);
