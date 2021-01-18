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
import User from '../models/users.ts';
import MailService from './mailer.ts';
import BaseService from './baseService.ts';
import Validation from '../models/validations.ts';

@Service()
export default class AuthService extends BaseService {
  constructor(
    @Inject(MailService) private mailer: MailService,
    @Inject('logger') private logger: log.Logger
  ) {
    super();
  }

  public async SignUp(body: INewUser, config?: { roleId: number }) {
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

      const hashedPassword = await this.hashPassword(body.password);

      // const db = serviceCollection.get('pg') as Adapter;

      const user = new User();
      user.age = body.age;
      user.codename = body.codename;
      user.email = body.email;
      user.parentEmail = body.parentEmail;
      user.password = hashedPassword;
      user.roleId = config?.roleId || UserRoles['user'];

      const { id } = await this.db.getManager().save(user);

      const code = this.generateValidationCode(id, body.codename);

      const validationObject = new Validation();
      validationObject.code = code;
      validationObject.userId = id;

      await this.db.getManager().save(validationObject);

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

  public async SignIn(email: string, password: string) {
    // const userRecord = await this.user.findOne({ email });
    // if (!userRecord) throw createError(404, 'User not registered');
    // if (!userRecord.isValidated)
    //   throw createError(403, 'Account must be validated');
    // this.logger.debug(`Verifying password for user (EMAIL: ${email})`);
    // const validPassword = await bcrypt.compare(password, userRecord.password);
    // if (!validPassword) throw createError(401, 'Invalid password');
    // this.logger.debug(`Password verified`);
    // // Remove password hash from response body
    // Reflect.deleteProperty(userRecord, 'password');
    // const token = await this.generateToken(userRecord);
    // return {
    //   user: userRecord,
    //   token,
    // };

    try {
      const userWithVal = await this.db
        .getManager()
        .query(User)
        .include('role', 'validations')
        .first();
      return userWithVal;
    } catch (err) {
      console.log(err);
    }
  }

  public Validate(email: string, token: string) {
    try {
      // Attempt to validate the user
      // const { id, isValidated } = await this.user.checkIsValidated(
      //   email,
      //   token
      // );
      // if (isValidated) {
      //   // Don't allow them to sign in or re-validate
      //   throw createError(
      //     409,
      //     `User (EMAIL: ${email}) has already been validated`
      //   );
      // }
      // const updatedUser = await this.user.update(id, {
      //   isValidated: true,
      // });
      // // Remove password hash from response body
      // Reflect.deleteProperty(updatedUser, 'password');
      // // Generate a JWT for the user to login
      // const jwt = await this.generateToken(updatedUser);
      // return {
      //   user: updatedUser,
      //   token: jwt,
      // };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public GetResetEmail(email: string) {
    try {
      // this.logger.debug(`Looking up record for user (EMAIL: ${email})`);
      // const user = await this.user.findOne({ email });
      // if (!user) throw createError(404, 'Email not found');
      // const resetItem = await this.resetModel.getResetItem(user);
      // if (resetItem) {
      //   const timeSinceLastRequest = Date.now() - resetItem.createdAt.getTime();
      //   if (timeSinceLastRequest < 600000) {
      //     throw createError(429, 'Cannot get another code so soon');
      //   } else {
      //     // Able to generate another code, so delete the old one
      //     await this.resetModel.completeUserResets(user);
      //   }
      // }
      // const { code } = await this.resetModel.generateValidationCode(user);
      // await this.mailer.sendPasswordResetEmail(user, code);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public ResetPasswordWithCode(email: string, password: string, token: string) {
    try {
      // this.logger.debug(`Looking up record for user (EMAIL: ${email})`);
      // const user = await this.user.findOne({ email });
      // if (!user) throw createError(404, 'Email not found');
      // const resetItem = await this.resetModel.getResetItem(user);
      // if (!resetItem) throw createError(409, 'No password resets are active');
      // if (resetItem.code !== token)
      //   throw createError(400, 'Invalid password reset code');
      // this.logger.debug(
      //   `Password reset code verified for user (ID: ${user.id})`
      // );
      // const hashedPassword = await this.user.hashPassword(password);
      // await this.user.update(user.id, { password: hashedPassword });
      // await this.resetModel.completeUserResets(user);
      // return user;
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
