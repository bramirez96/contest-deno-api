import {
  Service,
  serviceCollection,
  Query,
  Client,
  log,
  Inject,
  v5,
} from '../../deps.ts';
import env from '../config/env.ts';
import PGModel from './pgModel.ts';
import { INewValidationEntry, IValidation } from '../interfaces/validation.ts';

@Service()
export default class ValidationModel extends PGModel {
  constructor(
    @Inject('pg') protected dbConnect: Client,
    @Inject('logger') protected logger: log.Logger
  ) {
    super();
  }

  public async add(item: INewValidationEntry) {
    this.logger.debug(
      `Adding validation code to database for user (ID: ${item.userId})`
    );
    const builder = new Query();
    const sql = builder.table('validation').insert(item).build();

    // Parse into valid PG syntax and run query
    const sqlWithReturn = sql + 'RETURNING *';
    const result = await this.dbConnect.query(this.parseSql(sqlWithReturn));
    this.logger.debug(`Validation code added for user (ID: ${item.userId})`);

    // User parser member to generate proper data
    const validationItem = (this.parseResponse(result, {
      first: true,
    }) as unknown) as IValidation;

    return validationItem;
  }

  public generateCode(id: number, codename: string) {
    try {
      this.logger.debug(
        `Generating email validation token for user (ID: ${id})`
      );
      const validationToken = v5.generate({
        namespace: env.UUID_NAMESPACE,
        value: codename,
      }) as string; // Cast as string since we're not passing buffer

      return validationToken;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(ValidationModel);
