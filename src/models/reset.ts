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
import UserModel from './user.ts';
import { IUser } from '../interfaces/user.ts';
import { IReset } from '../interfaces/reset.ts';
import MailService from '../services/mailer.ts';

@Service()
export default class ResetModel extends PGModel {
  constructor(
    @Inject('pg') protected dbConnect: Client,
    @Inject(UserModel) protected userModel: UserModel,
    @Inject('logger') protected logger: log.Logger,
    @Inject(MailService) protected mailer: MailService
  ) {
    super();
  }

  public async getResetEmail(email: string) {
    try {
      this.logger.debug(`Looking up record for user (EMAIL: ${email})`);
      const user = await this.userModel.findOne({ email });

      if (!user) throw createError(404, 'Email not found');

      const resetItem = await this.getResetItem(user);
      if (resetItem) {
        const timeSinceLastRequest = Date.now() - resetItem.createdAt.getTime();
        if (timeSinceLastRequest < 600000) {
          throw createError(429, 'Cannot get another code so soon');
        } else {
          // Able to generate another code, so delete the old one
          await this.deleteUserResets(user);
        }
      }

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

      await this.mailer.sendPasswordResetEmail(user, newResetItem.code);
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

  private async getResetItem(user: IUser) {
    try {
      this.logger.debug(
        `Checking table for reset code for user (ID: ${user.id})`
      );
      const builder = new Query();
      const sql = builder
        .table('reset')
        .where(Where.field('userId').eq(user.id))
        .select('*')
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
      return result.rowCount;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(ResetModel);
