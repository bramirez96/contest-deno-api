import {
  Inject,
  log,
  PostgresAdapter,
  QueryValues,
  Service,
  serviceCollection,
} from '../../deps.ts';
import { ISubItem, ISubmission } from '../interfaces/submissions.ts';
import { INewTop3, ITop3 } from '../interfaces/top3.ts';
import SubmissionService from '../services/submission.ts';
import UserModel from './users.ts';

@Service()
export default class Top3Model {
  constructor(
    @Inject(SubmissionService) private subService: SubmissionService,
    @Inject(UserModel) private userModel: UserModel
  ) {
    this.db = serviceCollection.get('pg');
  }
  private db: PostgresAdapter;

  public async get() {
    const top3 = ((await this.db
      .table('top3')
      .innerJoin('submissions', 'submissions.id', 'top3.submissionId')
      .order('top3.created_at', 'DESC')
      .select('submissions.*')
      .execute()) as unknown) as ISubmission[];

    const subs = (await Promise.all(
      top3.map((t) => this.subService.retrieveSubItem(t))
    )) as ISubItem[];

    return subs;
  }

  public async add(subIds: INewTop3[]) {
    const top3 = ((await this.db
      .table('top3')
      .insert((subIds as unknown) as QueryValues[])
      .returning('*')
      .execute()) as unknown) as ITop3;

    return top3;
  }
}

serviceCollection.addTransient(Top3Model);
