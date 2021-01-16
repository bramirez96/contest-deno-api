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
import { IUser, IUserSignup, UserRoles } from '../interfaces/user.ts';
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
    @Inject(MailService) private mailer: MailService,
    @Inject('logger') private logger: log.Logger
  ) {}

  public async SignUp(body: IUserSignup, config?: { roleId: number }) {
    try {
      // Underage users must have a parent email on file for validation
      if (
        body.age < 13 &&
        (!body.parentEmail || body.email === body.parentEmail)
      ) {
        throw createError(
          400,
          'Underage users must have a parent email on file'
        );
      }

      const hashedPassword = await this.userModel.hashPassword(body.password);

      const { id } = await this.userModel.add({
        ...body,
        password: hashedPassword,
        roleId: config?.roleId || UserRoles['user'],
      });

      const code = this.validationModel.generateCode(id, body.codename);

      await this.validationModel.add({ code, userId: id });

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
      const { id, isValidated } = await this.userModel.checkIsValidated(
        email,
        token
      );
      if (isValidated) {
        // Don't allow them to sign in or re-validate
        throw createError(
          409,
          `User (EMAIL: ${email}) has already been validated`
        );
      }
      const updatedUser = await this.userModel.update(id, {
        isValidated: true,
      });

      // Remove password hash from response body
      Reflect.deleteProperty(updatedUser, 'password');

      // Generate a JWT for the user to login
      const jwt = await this.generateToken(updatedUser);

      return {
        user: updatedUser,
        token: jwt,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async GetResetEmail(email: string) {
    try {
      this.logger.debug(`Looking up record for user (EMAIL: ${email})`);
      const user = await this.userModel.findOne({ email });

      if (!user) throw createError(404, 'Email not found');

      const resetItem = await this.resetModel.getResetItem(user);
      if (resetItem) {
        const timeSinceLastRequest = Date.now() - resetItem.createdAt.getTime();
        if (timeSinceLastRequest < 600000) {
          throw createError(429, 'Cannot get another code so soon');
        } else {
          // Able to generate another code, so delete the old one
          await this.resetModel.completeUserResets(user);
        }
      }

      const { code } = await this.resetModel.generateCode(user);

      await this.mailer.sendPasswordResetEmail(user, code);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async ResetPasswordWithCode(
    email: string,
    password: string,
    token: string
  ) {
    try {
      this.logger.debug(`Looking up record for user (EMAIL: ${email})`);
      const user = await this.userModel.findOne({ email });
      if (!user) throw createError(404, 'Email not found');

      const resetItem = await this.resetModel.getResetItem(user);
      if (!resetItem) throw createError(409, 'No password resets are active');
      if (resetItem.code !== token)
        throw createError(400, 'Invalid password reset code');
      this.logger.debug(
        `Password reset code verified for user (ID: ${user.id})`
      );

      const hashedPassword = await this.userModel.hashPassword(password);
      await this.userModel.update(user.id, { password: hashedPassword });

      await this.resetModel.completeUserResets(user);

      return user;
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
