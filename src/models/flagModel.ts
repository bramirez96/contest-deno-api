import {
  Service,
  serviceCollection,
  PostgresAdapter,
  log,
} from '../../deps.ts';

@Service()
export default class FlagModel {
  constructor() {
    this.db = serviceCollection.get('pg');
    this.logger = serviceCollection.get('logger');
  }
  protected db: PostgresAdapter;
  protected logger: log.Logger;

  public async getBySubmissionId(id: number) {
    const flags = ((await this.db
      .table('submission_flags')
      .innerJoin('enum_flags', 'enum_flags.id', 'submission_flags.flagId')
      .select('enum_flags.flag')
      .where('submission_flags.submissionId', id)
      .execute()) as unknown) as { flag: string }[];

    return flags;
  }

  public async addFlagsToSub(
    flagItems: {
      submissionId: number;
      flagId: number;
    }[]
  ) {
    const res = await this.db
      .table('submission_flags')
      .insert(flagItems)
      .returning('*')
      .execute();
    return res;
  }
}

serviceCollection.addTransient(FlagModel);
