import {
  Join,
  Where,
  Service,
  serviceCollection,
  Query,
  Client,
  log,
  Inject,
} from '../../deps.ts';
import { IUser, IUserSignup } from '../interfaces/user.ts';
import PGModel from './pgModel.ts';

@Service()
export default class UserModel extends PGModel {
  constructor(
    @Inject('pg') protected dbConnect: Client,
    @Inject('logger') protected logger: log.Logger
  ) {
    super();
  }
  public async add(body: IUserSignup): Promise<IUser> {
    try {
      const builder = new Query();
      const sql = builder.table('users').insert(body).build();

      // Our querybuilder needs some parsing to get valid PGSQL
      const sqlWithReturn = sql + 'RETURNING *';
      const result = await this.dbConnect.query(this.parseSql(sqlWithReturn));
      const user = (this.parseResponse(result, {
        first: true,
      }) as unknown) as IUser;

      this.logger.debug(
        `Created new user (ID: ${user.id}, EMAIL: ${user.email})`
      );
      return user;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async findOne(filter: { [key: string]: unknown }): Promise<IUser> {
    try {
      const queryField = Object.keys(filter)[0];

      const builder = new Query();
      const sql = builder
        .table('users')
        .where(Where.field(queryField).eq(filter[queryField]))
        .select('*')
        .build();

      const result = await this.dbConnect.query(this.parseSql(sql));
      const user = (this.parseResponse(result, {
        first: true,
      }) as unknown) as IUser;

      return user;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async isAdmin(id: number) {
    try {
      const builder = new Query();
      const sql = builder
        .table('users')
        .join(Join.inner('roles').on('roles.id', 'users.roleId'))
        .where(Where.field('users.id').eq(id))
        .select('roles.role')
        .build();

      const result = await this.dbConnect.query(this.parseSql(sql));
      if (!result.rowCount || result.rowCount === 0) {
        throw new Error(`User (ID: ${id}) not found!`);
      }
      const res = this.parseResponse(result, { first: true }) as {
        role: string;
      };
      const isAdmin = res.role === 'admin';

      // Will log a warning if someone who is not an admin attempts to access admin resource
      if (isAdmin)
        this.logger.debug(`Admin (ID: ${id}) accessed admin resources`);
      else
        this.logger.warning(
          `User (ID: ${id}) attempted to access admin resources`
        );
      return isAdmin;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(UserModel);
