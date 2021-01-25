import { SES } from '../../deps.ts';
import env from '../config/env.ts';

export default () => {
  console.log('Loading mailer...');

  let ses;
  if (env.DENO_ENV === 'testing') {
    ses = new TestSES();
    console.log('Test mailer loaded!');
  } else {
    ses = new SES(env.SES_CONFIG);
    console.log('Mailer loaded!');
  }
  return ses;
};

class TestSES {
  public send(...args: unknown[]) {
    return args;
  }
}
