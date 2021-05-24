import { Service, serviceCollection } from '../../deps.ts';
import { Sources } from '../interfaces/enumSources.ts';
import { INewSubmission, ISubmission } from '../interfaces/submissions.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class SubmissionModel extends BaseModel<
  INewSubmission,
  ISubmission
> {
  constructor() {
    super('submissions');
  }

  public async getSubsForStudentInSection(
    studentId: number,
    sectionId: number
  ) {
    try {
      this.logger.debug(
        `Getting subs for user ${studentId} in section ${sectionId}`
      );

      const subs = ((await this.db
        .table('submissions')
        .innerJoin('prompts', 'prompts.id', 'submissions.promptId')
        .innerJoin('rumbles', 'rumbles.promptId', 'prompts.id')
        .innerJoin('rumble_sections', 'rumble_sections.rumbleId', 'rumbles.id')
        .innerJoin(
          'clever_sections',
          'clever_sections.id',
          'rumble_sections.sectionId'
        )
        .where('submissions.userId', studentId)
        .where('clever_sections.id', sectionId)
        .where('submissions.sourceId', Sources.Rumble)
        .select('submissions.*')
        .execute()) as unknown[]) as ISubmission[];

      return subs;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getSubByStudentAndRumbleId(
    studentId: number,
    rumbleId: number
  ): Promise<ISubmission | undefined> {
    try {
      const subs = ((await this.db
        .table('submissions')
        .innerJoin('prompts', 'prompts.id', 'submissions.promptId')
        .innerJoin('rumbles', 'rumbles.promptId', 'prompts.id')
        .where('rumbles.id', rumbleId)
        .where('submissions.userId', studentId)
        .select('submissions.*')
        .execute()) as unknown[]) as ISubmission[];
      return subs[0];
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getSubsForFeedback(
    studentId: number,
    rumbleId: number
  ): Promise<ISubmission[]> {
    try {
      const subs = ((await this.db
        .table('rumble_feedback')
        .innerJoin(
          'submissions',
          'submissions.id',
          'rumble_feedback.submissionId'
        )
        .innerJoin('prompts', 'prompts.id', 'submissions.promptId')
        .innerJoin('rumbles', 'rumbles.promptId', 'prompts.id')
        .where('rumble_feedback.voterId', studentId)
        .where('rumbles.id', rumbleId)
        .select('submissions.*')
        .execute()) as unknown) as ISubmission[];
      return subs;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getFeedbackIDsByRumbleID(
    rumbleId: number
  ): Promise<{ submissionId: number; userId: number }[]> {
    try {
      const TEST_SECTION_ID = 1; // TODO remove this and add section ID?
      const subs = ((await this.db
        .table('rumble_sections')
        .innerJoin('rumbles', 'rumbles.id', 'rumble_sections.rumbleId')
        .innerJoin('prompts', 'prompts.id', 'rumbles.promptId')
        .innerJoin('submissions', 'submissions.promptId', 'prompts.id')
        .where('rumbles.id', rumbleId)
        .where('rumble_sections.sectionId', TEST_SECTION_ID)
        .select('submissions.id', 'submissions.userId')
        .execute()) as unknown) as ISubmission[];
      return subs.map(({ userId, id }) => ({ userId, submissionId: id }));
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(SubmissionModel);
