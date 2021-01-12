import { Service, Inject, serviceCollection, jwt, Logger } from '../../deps.ts';
import env from '../config/env.ts';
import { IUser, IUserSignup } from '../interfaces/user.ts';
import UserModel from '../models/user.ts';

@Service()
export default class AuthService {
  constructor(@Inject(UserModel) private userModel: UserModel) {}

  public async SignUp(body: IUserSignup) {
    const logger: Logger = serviceCollection.get('logger');
    logger.debug('Hashing password');
    logger.debug('Adding to database');
    const userRecord = await this.userModel.add(body);
    logger.warning({ userRecord });
    logger.debug('Generating JWT');
    const token = await this.generateToken(userRecord);
    return {
      token,
      user: userRecord,
    };
  }

  private generateToken(user: { id: number; codename: string; email: string }) {
    const logger: Logger = serviceCollection.get('logger');
    const daysUntilExpiry = 2;
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + daysUntilExpiry);
    logger.debug(`Signing JWT for userId: ${user.id}`);
    return jwt.create(
      { alg: env.JWT.ALGO },
      { exp: exp.getTime(), sub: user.id.toString(), iss: user.email },
      env.JWT.SECRET
    );
  }
}

serviceCollection.addTransient(AuthService);
