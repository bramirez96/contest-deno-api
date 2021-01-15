import {
  Join,
  Where,
  Service,
  serviceCollection,
  Query,
  log,
  Inject,
  v5,
  createError,
  Order,
} from '../../deps.ts';
import env from '../config/env.ts';
import UserModel from '../models/user.ts';
import { IUser } from '../interfaces/user.ts';
import { IReset } from '../interfaces/reset.ts';
import MailService from '../services/mailer.ts';
import ResetModel from '../models/reset.ts';

@Service()
export default class ResetService {
  constructor(
    @Inject(UserModel) protected userModel: UserModel,
    @Inject('logger') protected logger: log.Logger,
    @Inject(MailService) protected mailer: MailService,
    @Inject(ResetModel) protected resetModel: ResetModel
  ) {}

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
          await this.resetModel.deleteUserResets(user);
        }
      }

      const { code } = await this.resetModel.generateCode(user);

      await this.mailer.sendPasswordResetEmail(user, code);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async ResetPassword(email: string, password: string, token: string) {
    try {
      this.logger.debug(`Looking up record for user (EMAIL: ${email})`);
      const user = await this.userModel.findOne({ email });
      if (!user) throw createError(404, 'Email not found');

      const resetItem = await this.resetModel.getResetItem(user);
      if (!resetItem)
        throw createError(409, 'Password reset code has not been created');
      if (resetItem.code !== token)
        throw createError(400, 'Invalid password reset code');

      this.logger.debug(
        `Password reset code verified for user (ID: ${user.id})`
      );
      await this.resetModel.deleteUserResets(user);

      return user;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(ResetService);
