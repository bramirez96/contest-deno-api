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
import { IUser, INewUser, UserRoles } from '../interfaces/users.ts';
import ResetModel from '../models/resets.ts';
import UserModel from '../models/users.ts';
import ValidationModel from '../models/validations.ts';
import BaseService from './baseService.ts';
import MailService from './mailer.ts';

@Service()
export default class AuthService extends BaseService {
  constructor(
    @Inject(UserModel) private userModel: UserModel,
    @Inject(ResetModel) private resetModel: ResetModel,
    @Inject(ValidationModel) private validationModel: ValidationModel,
    @Inject(MailService) private mailer: MailService,
    @Inject('logger') private logger: log.Logger
  ) {
    super();
  }

  public async SignUp(body: INewUser) {
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

      // Start a transaction for data integrity
      await this.db.transaction(async () => {
        // Create a new user object
        const hashedPassword = await this.hashPassword(body.password);
        const [{ id }] = await this.userModel.add({
          ...body,
          password: hashedPassword,
          roleId: UserRoles['user'],
        });

        // Generate Validation for user
        const code = this.generateValidationCode(id, body.codename);
        await this.validationModel.add({ code, userId: id });
        await this.mailer.sendValidationEmail(
          body.parentEmail || body.email,
          code
        );
        this.logger.debug(`User (ID: ${id}) successfully registered`);
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async SignIn(email: string, password: string): Promise<IAuthResponse> {
    try {
      const user = await this.userModel.get({ email }, { first: true });
      if (!user) throw createError(404, 'User not found');
      if (!user.isValidated)
        throw createError(403, 'Account must be validated');

      this.logger.debug(`Verifying password for user (EMAIL: ${email})`);
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw createError(401, 'Invalid password');
      this.logger.debug(`Password verified`);

      // Remove password hash from response body
      Reflect.deleteProperty(user, 'password');
      const token = await this.generateToken(user);
      return { user, token };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async Validate(email: string, token: string): Promise<IAuthResponse> {
    try {
      // Attempt to validate the user
      const user = await this.userModel.get({ email }, { first: true });
      if (!user) throw createError(404, 'User not found');
      if (user.isValidated) {
        throw createError(409, 'User has already been validated');
      }

      const updatedUser = await this.userModel.update(user.id, {
        isValidated: true,
        updatedAt: new Date().toUTCString(),
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
      const user = await this.userModel.get({ email }, { first: true });
      if (!user) throw createError(404, 'Email not found');

      const resetItem = await this.resetModel.get(
        { userId: user.id },
        { first: true }
      );

      await this.db.transaction(async () => {
        if (resetItem) {
          const timeSinceLastRequest =
            Date.now() - resetItem.createdAt.getTime();
          if (timeSinceLastRequest < 600000) {
            throw createError(429, 'Cannot get another code so soon');
          } else {
            // Able to generate another code, so delete the old one
            await this.resetModel.update(resetItem.id, { completed: true });
          }
        }

        const code = this.generateResetCode(user);
        await this.db.transaction(async () => {
          await this.resetModel.add({ code, userId: user.id });
          await this.mailer.sendPasswordResetEmail(user, code);
        });
      });
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
      const user = await this.userModel.get({ email }, { first: true });
      if (!user) throw createError(404, 'Email not found');

      const resetItem = await this.resetModel.get(
        { userId: user.id },
        { first: true }
      );
      if (!resetItem) throw createError(409, 'No password resets are active');
      if (resetItem.code !== token)
        throw createError(400, 'Invalid password reset code');
      this.logger.debug(
        `Password reset code verified for user (ID: ${user.id})`
      );

      const hashedPassword = await this.hashPassword(password);

      await this.db.transaction(async () => {
        await this.userModel.update(user.id, {
          password: hashedPassword,
          updatedAt: new Date().toUTCString(),
        });
        await this.resetModel.update(resetItem.id, { completed: true });
      });
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

  private generateValidationCode(id: number, codename: string) {
    try {
      this.logger.debug(
        `Generating email validation token for user (ID: ${id})`
      );
      const validationToken = v5.generate({
        namespace: env.UUID_NAMESPACE,
        value: codename,
      }) as string; // Cast as string since we're not passing buffer

      return validationToken;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private generateResetCode(user: IUser) {
    try {
      this.logger.debug(
        `Generating a new password reset code for user (ID: ${user.id})`
      );
      const resetToken = v5.generate({
        namespace: env.UUID_NAMESPACE,
        value: user.codename,
      }) as string; // Cast as string since we're not passing buffer
      this.logger.debug(`Reset code generated for user (ID: ${user.id})`);

      return resetToken;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async hashPassword(password: string) {
    this.logger.debug('Hashing password');
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    this.logger.debug('Password hashed');
    return hashedPassword;
  }
}

interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

serviceCollection.addTransient(AuthService);
