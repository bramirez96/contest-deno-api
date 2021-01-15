import {
  Service,
  Inject,
  serviceCollection,
  SES,
  SendEmailCommand,
  log,
  Handlebars,
} from '../../deps.ts';
import hbsConfig from '../../hbsConfig.ts';
import env from '../config/env.ts';

@Service()
export default class MailService {
  constructor(
    @Inject('mail') private mailer: SES,
    @Inject('logger') private logger: log.Logger
  ) {}

  public async sendValidationEmail(email: string, token: string) {
    this.logger.debug(`Sending activation email for user (EMAIL: ${email})`);

    const urlParams = new URLSearchParams({ token, email });
    const url = env.SERVER_URL + '/api/auth/activate?' + urlParams.toString();
    this.logger.debug(
      `Activation link (${url}) generated for user (EMAIL: ${email})`
    );

    try {
      const handle = new Handlebars(hbsConfig());
      const result = await handle.renderView('activation', { url });
      const thestuff = new SendEmailCommand({
        Destination: {
          ToAddresses: [email],
        },
        FromEmailAddress: 'bran.ramirez.don@gmail.com',
        Content: {
          Simple: {
            Body: {
              Html: {
                Data: result,
              },
            },
            Subject: {
              Data: 'Activate your Story Squad Account!',
            },
          },
        },
      });
      await this.mailer.send(thestuff);
      this.logger.debug(
        `Activation email successfully sent to user (EMAIL: ${email})`
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(MailService);
