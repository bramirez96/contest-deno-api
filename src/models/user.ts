import {
  Query,
  Join,
  Where,
  Service,
  Inject,
  Client,
  serviceCollection,
  createError,
} from '../../deps.ts';
import { IUserSignup } from '../interfaces/user.ts';

@Service()
export default class UserModel {
  constructor(@Inject('pg') private dbConnect: Client) {}

  public async add(user: IUserSignup) {
    const builder = new Query();
    const sql = builder.table('users').insert(user).build();

    // Our querybuilder needs some parsing to get valid PGSQL
    const parsedSql1 = sql.replaceAll('"', "'");
    const parsedSql2 = parsedSql1.replaceAll('`', '"');

    const result = await this.dbConnect.query(parsedSql2);
  }

  public async isAdmin(id: number) {
    const builder = new Query();

    const sql = builder
      .table('users')
      .join(Join.inner('roles').on('roles.id', 'users.roleId'))
      .where(Where.field('users.id').eq(id))
      .select('roles.role')
      .build();

    // Our querybuilder needs some parsing to get valid PGSQL
    const parsedSql1 = sql.replaceAll('"', "'");
    const parsedSql2 = parsedSql1.replaceAll('`', '"');

    console.log(parsedSql2);
    const result = await this.dbConnect.query(parsedSql2);

    try {
      // Destructure the role property from the db response
      const {
        rows: [[role]],
      } = result;
      // Return true if user is an admin
      return role === 'admin';
    } catch (err) {
      throw createError(404, 'User not found');
    }
  }
}

serviceCollection.addTransient(UserModel);
