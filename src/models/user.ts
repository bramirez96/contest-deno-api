import {
  Query,
  Service,
  Inject,
  Client,
  serviceCollection,
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
}

serviceCollection.addTransient(UserModel);
