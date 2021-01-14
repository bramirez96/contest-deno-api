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

@Service()
export default class MailService {
  constructor(
    @Inject('mail') private mailer: SES,
    @Inject('logger') private logger: log.Logger
  ) {}

  public async sendValidationEmail(email: string, token: string) {
    const handle = new Handlebars(hbsConfig());
    // const result = await handle.renderView('activation.hbs', {
    //   url: token,
    // });
    const result = await handle.renderView('activation', {
      url: token,
    });
    console.log(result);
  }

  public async sendEmail() {
    this.logger.debug('Generating email');
    const thestuff = new SendEmailCommand({
      Destination: {
        ToAddresses: ['bran.ramirez.don@gmail.com'],
      },
      FromEmailAddress: 'bran.ramirez.don@gmail.com',
      Content: {
        Simple: {
          Body: {
            Text: {
              Data: 'FINALLY MY EMAIL BODY',
            },
          },
          Subject: {
            Data: 'THE SUBJECT',
          },
        },
      },
    });
    this.logger.debug('Sending email');
    const res = await this.mailer.send(thestuff);
    return res;
  }
}

serviceCollection.addTransient(MailService);
