import {
  Join,
  Where,
  Service,
  serviceCollection,
  Query,
  Client,
  log,
  Inject,
  v5,
  createError,
} from '../../deps.ts';
import env from '../config/env.ts';
import PGModel from './pgModel.ts';
import { IValidation } from '../interfaces/validation.ts';
import UserModel from './user.ts';

@Service()
export default class ValidationModel extends PGModel {
  constructor(
    @Inject('pg') protected dbConnect: Client,
    @Inject(UserModel) protected userModel: UserModel,
    @Inject('logger') protected logger: log.Logger
  ) {
    super();
  }

  public async generateCode(id: number, codename: string) {
    try {
      this.logger.debug(
        `Generating email activation token for user (ID: ${id})`
      );
      const validationToken = v5.generate({
        namespace: env.UUID_NAMESPACE,
        value: codename,
      }) as string; // Cast as string since we're not passing buffer

      this.logger.debug(
        `Adding validation code to database for user (ID: ${id})`
      );
      const builder = new Query();
      const sql = builder
        .table('validation')
        .insert({ code: validationToken, userId: id })
        .build();

      // Parse into valid PG syntax and run query
      const sqlWithReturn = sql + 'RETURNING *';
      const result = await this.dbConnect.query(this.parseSql(sqlWithReturn));
      this.logger.debug(`Validation code added for user (ID: ${id})`);

      // User parser member to generate proper data
      const validationItem = (this.parseResponse(result, {
        first: true,
      }) as unknown) as IValidation;

      return validationItem;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async validateWithCode(email: string, token: string) {
    try {
      this.logger.debug(`Attempting to validate user (EMAIL: ${email})`);

      const builder = new Query();
      const sql = builder
        .table('users')
        .join(Join.inner('validation').on('users.id', 'validation.userId'))
        .where(Where.field('users.email').eq(email))
        .where(Where.field('validation.code').eq(token))
        .select('users.isValidated', 'users.id')
        .build();
      this.logger.warning(sql);

      // Check if we return any rows, throw error if we don't
      this.logger.debug(`Checking validation code for user (EMAIL: ${email})`);
      const result = await this.dbConnect.query(this.parseSql(sql));
      if (result.rowCount === 0) {
        throw createError(401, 'Invalid authorization code');
      }

      // Parse out isValidated field from user table, return false if user is already validated
      const { isValidated, id } = (this.parseResponse(result, {
        first: true,
      }) as unknown) as { isValidated: boolean; id: number };
      if (isValidated) {
        // Don't allow them to sign in or re-validate
        throw createError(
          409,
          `User (EMAIL: ${email}) has already been validated`
        );
      }

      // Mark user's profile as validated and return the user
      const user = await this.userModel.setUserHasBeenValidated(id);

      return user;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(ValidationModel);
