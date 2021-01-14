import {
  Service,
  Inject,
  serviceCollection,
  jwt,
  log,
  bcrypt,
  createError,
} from '../../deps.ts';
import env from '../config/env.ts';
import { IUser, IUserSignup } from '../interfaces/user.ts';
import UserModel from '../models/user.ts';

@Service()
export default class AuthService {
  constructor(
    @Inject(UserModel) private userModel: UserModel,
    @Inject('logger') private logger: log.Logger
  ) {}

  public async SignUp(
    body: IUserSignup,
    config?: { roleId: number }
  ): Promise<IAuthResponse> {
    try {
      // Maybe store salt in ENV or something?
      this.logger.debug('Hashing password');
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      this.logger.debug('Adding to database');
      const userRecord = await this.userModel.add({
        ...body,
        password: hashedPassword,
        roleId: config?.roleId || 1,
      });

      this.logger.debug(`User (ID: ${userRecord.id}) added`);
      Reflect.deleteProperty(userRecord, 'password');

      const token = await this.generateToken(userRecord);
      return {
        user: userRecord,
        token,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async SignIn(email: string, password: string): Promise<IAuthResponse> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) throw createError(404, 'User not registered');

    this.logger.debug(`Verifying password for user (EMAIL: ${email})`);
    const validPassword = await bcrypt.compare(password, userRecord.password);
    if (!validPassword) throw createError(401, 'Invalid password');

    Reflect.deleteProperty(userRecord, 'password');
    this.logger.debug(`Password verified`);

    const token = await this.generateToken(userRecord);
    return {
      user: userRecord,
      token,
    };
  }

  private generateToken(user: Omit<IUser, 'password'>) {
    this.logger.debug('Generating JWT');
    const daysUntilExpiry = 2;
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + daysUntilExpiry);

    this.logger.debug(`Signing JWT for userId: ${user.id}`);
    return jwt.create(
      { alg: env.JWT.ALGO },
      { exp: exp.getTime(), sub: user.id.toString(), iss: user.email },
      env.JWT.SECRET
    );
  }
}

interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

serviceCollection.addTransient(AuthService);
