import {
  test,
  TestSuite,
  assertEquals,
  assertObjectMatch,
  assertArrayIncludes,
  assertStringIncludes,
} from '../testDeps.ts';
import { MainSuite } from './000.setup.test.ts';
import users from './testData/users.ts';

const AuthSuite = new TestSuite({
  name: '/auth',
  suite: MainSuite,
});

const RegistrationSuite = new TestSuite({
  name: '/register',
  suite: AuthSuite,
});

test(
  RegistrationSuite,
  '-> POST returns 400 on empty body',
  async (context) => {
    const res = await context.app.post('/auth/register').send();
    assertEquals(res.status, 400);
    assertStringIncludes(res.body.message, 'Invalid or missing fields');
  }
);

test(
  RegistrationSuite,
  '-> POST returns 400 on incomplete body',
  async (context) => {
    const res = await context.app.post('/auth/register').send(users.incomplete);
    assertEquals(res.status, 400);
    assertStringIncludes(res.body.message, 'Invalid or missing fields');
  }
);

test(
  RegistrationSuite,
  '-> POST returns 400 when child is too young and parentEmail is invalid',
  async (context) => {
    const res = await context.app.post('/auth/register').send(users.tooYoung);
    assertEquals(res.status, 400);
    assertStringIncludes(res.body.message, 'Underage users must have');
  }
);

test(RegistrationSuite, '-> POST returns 201 on success', async (context) => {
  const res = await context.app.post('/auth/register').send(users.valid);
  assertEquals(res.status, 201);
  assertObjectMatch(res.body, { message: 'User creation successful.' });
});

const ActivationSuite = new TestSuite({
  name: '/activation',
  suite: AuthSuite,
});

test(
  ActivationSuite,
  '-> GET returns 400 on missing query params',
  async (context) => {
    const res = await context.app.get(`/auth/activation`);
    assertEquals(res.status, 400);
    assertStringIncludes(res.body.message, 'missing fields: token, email');
  }
);

test(
  ActivationSuite,
  '-> GET returns 400 on one missing query param',
  async (context) => {
    const res = await context.app.get(
      `/auth/activation?email=someemail@email.co`
    );
    assertEquals(res.status, 400);
    assertStringIncludes(res.body.message, 'missing fields: token');
  }
);

test(ActivationSuite, '-> GET returns something hot', async (context) => {
  const [val] = await context.db
    .table('validations')
    .select('*')
    .first()
    .execute();
  assertArrayIncludes(Object.keys(val), ['code', 'email']);
  const { code, email } = val;
  const res = await context.app.get(
    `/auth/activation?token=${code}&email=${email}`
  );
  assertEquals(res.status, 302);
  assertStringIncludes(res.headers.location as string, 'authToken');
});
