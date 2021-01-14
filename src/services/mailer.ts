import {
  Service,
  Inject,
  serviceCollection,
  SES,
  SendEmailCommand,
  log,
} from '../../deps.ts';

@Service()
export default class MailService {
  constructor(
    @Inject('mail') private mailer: SES,
    @Inject('logger') private logger: log.Logger
  ) {}

  public async sendValidationEmail(email: string, token: string) {}

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
