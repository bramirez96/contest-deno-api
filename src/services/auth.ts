import {
  Service,
  Inject,
  serviceCollection,
  jwt,
  log,
  bcrypt,
  createError,
  v5,
} from '../../deps.ts';
import env from '../config/env.ts';
import { IUser, IUserSignup } from '../interfaces/user.ts';
import UserModel from '../models/user.ts';
import ValidationModel from '../models/validation.ts';
import ResetModel from '../models/reset.ts';
import MailService from './mailer.ts';

@Service()
export default class AuthService {
  constructor(
    @Inject(UserModel) private userModel: UserModel,
    @Inject(ValidationModel) private validationModel: ValidationModel,
    @Inject(ResetModel) private resetModel: ResetModel,
    @Inject('logger') private logger: log.Logger,
    @Inject(MailService) private mailer: MailService
  ) {}

  public async SignUp(body: IUserSignup, config?: { roleId: number }) {
    try {
      // Maybe store salt in ENV or something?
      this.logger.debug('Hashing password');
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      const { id } = await this.userModel.add({
        ...body,
        password: hashedPassword,
        roleId: config?.roleId || 1,
      });

      const { code } = await this.validationModel.generateCode(
        id,
        body.codename
      );

      await this.mailer.sendValidationEmail(
        body.parentEmail || body.email,
        code
      );

      this.logger.debug(`User (ID: ${id}) successfully registered`);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async SignIn(email: string, password: string): Promise<IAuthResponse> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) throw createError(404, 'User not registered');
    if (!userRecord.isValidated)
      throw createError(403, 'Account must be validated');

    this.logger.debug(`Verifying password for user (EMAIL: ${email})`);
    const validPassword = await bcrypt.compare(password, userRecord.password);
    if (!validPassword) throw createError(401, 'Invalid password');
    this.logger.debug(`Password verified`);

    // Remove password hash from response body
    Reflect.deleteProperty(userRecord, 'password');

    const token = await this.generateToken(userRecord);
    return {
      user: userRecord,
      token,
    };
  }

  public async Validate(email: string, token: string): Promise<IAuthResponse> {
    try {
      // Attempt to validate the user
      const user = await this.validationModel.validateWithCode(email, token);

      // Remove password hash from response body
      Reflect.deleteProperty(user, 'password');

      // Generate a JWT for the user to login
      const jwt = await this.generateToken(user);

      return {
        user,
        token: jwt,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private generateToken(user: Omit<IUser, 'password'>) {
    this.logger.debug(`Generating JWT for user (ID: ${user.id})`);
    const daysUntilExpiry = 2;
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + daysUntilExpiry);

    this.logger.debug(`Signing JWT for user (ID: ${user.id})`);
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
