import { assertEquals, TestSuite, test } from '../testDeps.ts';
import { MainSuite } from './000.setup.test.ts';

const AuthSuite = new TestSuite({
  name: '/auth',
  suite: MainSuite,
});

test(
  AuthSuite,
  '/register -> POST returns 400 on invalid data',
  async (context) => {
    const res = await context.app.post('/auth/register').send({});

    assertEquals(res.status, 400);
  }
);
