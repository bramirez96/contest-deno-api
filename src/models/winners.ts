import {
  Inject,
  log,
  PostgresAdapter,
  Service,
  serviceCollection,
} from '../../deps.ts';
import { ISubmission } from '../interfaces/submissions.ts';
import SubmissionService from '../services/submission.ts';

@Service()
export default class WinnerModel {
  constructor(
    @Inject(SubmissionService) private subService: SubmissionService
  ) {
    this.db = serviceCollection.get('pg');
  }
  private db: PostgresAdapter;

  public async get() {
    const [winner] = ((await this.db
      .table('winners')
      .innerJoin('submissions', 'submissions.id', 'winners.submissionId')
      .order('winners.created_at', 'DESC')
      .select('submissions.*')
      .execute()) as unknown) as ISubmission[];

    const sub = await this.subService.retrieveSubItem(winner);
    return sub;
  }
}

serviceCollection.addTransient(WinnerModel);
