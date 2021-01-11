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
    console.log(sql);
    const parsedSql1 = sql.replaceAll('"', "'");
    const parsedSql2 = parsedSql1.replaceAll('`', '"');
    console.log(parsedSql2);
    const result = await this.dbConnect.query(parsedSql2);
    console.log(result.rows);
  }
}

serviceCollection.addTransient(UserModel);
