import {
  Service,
  Inject,
  Client,
  log,
  serviceCollection,
  Query,
  Where,
  Join,
} from '../../deps.ts';
import { INewSubmission, ISubmission } from '../interfaces/submissions.ts';
import PGModel from './pgModel.ts';

@Service()
export default class SubmissionModel extends PGModel {
  constructor(
    @Inject('pg') protected dbConnect: Client,
    @Inject('logger') protected logger: log.Logger
  ) {
    super();
  }

  public async add(body: INewSubmission) {
    try {
      this.logger.debug(
        `Attempting to add submission to database for user \
        (ID: ${body.userId}), prompt (ID: ${body.promptId})`
      );

      const builder = new Query();
      const sql = builder.table('submissions').insert(body).build();

      // Parse and run query
      const sqlWithReturn = sql + ' RETURNING *';
      const result = await this.dbConnect.query(this.parseSql(sqlWithReturn));

      // Parse Data
      const sub = (this.parseResponse(result, {
        first: true,
      }) as unknown) as ISubmission;

      return sub;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(SubmissionModel);
