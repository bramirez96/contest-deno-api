import { SES } from '../../deps.ts';
import env from '../config/env.ts';

export default () => {
  console.log('Loading mailer...');
  const ses = new SES(env.SES_CONFIG);
  console.log('Mailer loaded!');
  return ses;
};
