import { DatabaseResult, Service, serviceCollection } from '../../deps.ts';
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

  public async getTodaysTop10() {
    const sql = this.db
      .table('submissions')
      .innerJoin('prompts', 'prompts.id', 'submissions.promptId')
      .leftJoin(
        'submission_flags',
        'submission_flags.submissionId',
        'submissions.id'
      )
      .leftJoin('enum_flags', 'enum_flags.id', 'submission_flags.flagId')
      .where('prompts.active', true)
      .order('submissions."score"', 'DESC')
      .groupBy('submissions.id', 'prompts.prompt')
      .count('submission_flags.id', 'numFlags')
      .select('submissions.*', 'prompts.prompt', 'enum_flags.flag')
      .limit(10)
      .toSQL()
      .text.split(' FROM ')
      .join(', "submissions".*, "prompts"."prompt" FROM ');
    const top10 = (await this.db.query(sql)) as (ISubmission &
      DatabaseResult & {
        prompt: string;
        numFlags: number;
      })[];

    return top10;
  }
}

serviceCollection.addTransient(SubmissionModel);
