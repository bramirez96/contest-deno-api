import { Service, Inject, Client, serviceCollection } from '../../deps.ts';
import { IUserSignup } from '../interfaces/user.ts';

@Service()
export default class AuthService {
  constructor(@Inject('pg') private dbConnect: Client) {}

  public async SignUp() {
    try {
      const data = await this.dbConnect.query('SELECT * FROM public."users"');
      console.log({ data: data.rows });
    } catch (err) {
      console.log({ err });
    }
  }
}

serviceCollection.addTransient(AuthService);
