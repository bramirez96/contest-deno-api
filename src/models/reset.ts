import {
  Where,
  Service,
  serviceCollection,
  Query,
  Client,
  log,
  Inject,
  v5,
  Order,
} from '../../deps.ts';
import env from '../config/env.ts';
import PGModel from './pgModel.ts';
import UserModel from './user.ts';
import { IUser } from '../interfaces/user.ts';
import { IReset } from '../interfaces/reset.ts';

@Service()
export default class ResetModel extends PGModel {
  constructor(
    @Inject('pg') protected dbConnect: Client,
    @Inject(UserModel) protected userModel: UserModel,
    @Inject('logger') protected logger: log.Logger
  ) {
    super();
  }

  public async generateCode(user: IUser) {
    try {
      this.logger.debug(
        `Generating a new password reset code for user (ID: ${user.id})`
      );
      const resetToken = v5.generate({
        namespace: env.UUID_NAMESPACE,
        value: user.codename,
      }) as string; // Cast as string since we're not passing buffer

      this.logger.debug(
        `Adding reset code to database for user (ID: ${user.id})`
      );
      const builder = new Query();
      const sql = builder
        .table('reset')
        .insert({ code: resetToken, userId: user.id })
        .build();

      // Parse into valid PG syntax and run query
      const sqlWithReturn = sql + 'RETURNING *';
      const result = await this.dbConnect.query(this.parseSql(sqlWithReturn));
      this.logger.debug(`Reset code added for user (ID: ${user.id})`);

      // User parser member to generate proper data
      const newResetItem = (this.parseResponse(result, {
        first: true,
      }) as unknown) as IReset;

      return newResetItem;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getResetItem(user: IUser) {
    try {
      this.logger.debug(`Searching for reset code for user (ID: ${user.id})`);
      const builder = new Query();
      const sql = builder
        .table('reset')
        .where(Where.field('userId').eq(user.id))
        .select('*')
        .order(Order.by('id').desc)
        .build();

      const result = await this.dbConnect.query(this.parseSql(sql));
      const resetItem = (this.parseResponse(result, {
        first: true,
      }) as unknown) as IReset | undefined;

      this.logger.debug(
        `${resetItem ? 'R' : 'No r'}eset field found for user (ID: ${user.id})`
      );
      return resetItem;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async deleteUserResets(user: IUser) {
    try {
      this.logger.debug(
        `Attempting to delete reset codes for user (ID: ${user.id})`
      );
      const builder = new Query();
      const sql = builder
        .table('reset')
        .where(Where.field('userId').eq(user.id))
        .delete()
        .build();

      const result = await this.dbConnect.query(this.parseSql(sql));
      this.logger.debug(
        `Password reset codes deleted for user (ID: ${user.id})`
      );
      return result.rowCount;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(ResetModel);
