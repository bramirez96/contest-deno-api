import { serviceCollection, Service } from '../deps.ts';
import { IUser } from '../src/interfaces/users.ts';
import { assertEquals, TestSuite, test } from '../testDeps.ts';
import { MainSuite } from './000.setup.test.ts';
import { newUsers } from './testData/users.ts';

const AuthSuite = new TestSuite({
  name: '/auth',
  suite: MainSuite,
});

@Service()
class MailService {
  public async sendValidationEmail(email: string, url: string) {
    const res = await Promise.resolve({ email, url });
    return res;
  }
  public async sendPasswordResetEmail(user: IUser, token: string) {
    const res = await Promise.resolve({ user, token });
    return res;
  }
}

serviceCollection.addTransient(MailService);

test(
  AuthSuite,
  '/register -> POST returns 400 on invalid data',
  async (context) => {
    const res = await context.app.post('/auth/register').send({});

    assertEquals(res.status, 400);
  }
);

test(AuthSuite, '/register -> POST returns 201 on success', async (context) => {
  const res = await context.app.post('/auth/register').send(newUsers[0]);

  assertEquals(res.status, 400);
});
