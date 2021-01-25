import {
  test,
  TestSuite,
  assertExists,
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
  const res = await context.app.post('/auth/register').send(users.valid[0]);
  assertEquals(res.status, 201);
  assertObjectMatch(res.body, { message: 'User creation successful.' });
});

test(
  RegistrationSuite,
  '-> POST returns 201 on second user',
  async (context) => {
    const res = await context.app.post('/auth/register').send(users.valid[1]);
    assertEquals(res.status, 201);
    assertObjectMatch(res.body, { message: 'User creation successful.' });
  }
);

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

test(
  ActivationSuite,
  '-> GET returns 404 on invalid email',
  async (context) => {
    const res = await context.app.get(
      `/auth/activation?email=someemail@email.co&token=bananas`
    );
    assertEquals(res.status, 404);
    assertEquals(res.body.message, 'User not found');
  }
);

test(
  ActivationSuite,
  '-> GET returns 409 on invalid token',
  async (context) => {
    const res = await context.app.get(
      `/auth/activation?email=${users.valid[0].parentEmail}&token=bananas`
    );
    assertEquals(res.status, 401);
    assertEquals(res.body.message, 'Invalid activation code');
  }
);

test(
  ActivationSuite,
  '-> GET successfully activates account',
  async (context) => {
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
  }
);

test(
  ActivationSuite,
  '-> GET throws 409 error if already validated',
  async (context) => {
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
    assertEquals(res.status, 409);
    assertObjectMatch(res.body, { message: 'User has already been validated' });
  }
);

const LoginSuite = new TestSuite({
  name: '/login',
  suite: AuthSuite,
});

test(LoginSuite, '-> POST returns a 400 on missing body', async (context) => {
  const res = await context.app.post('/auth/login');

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'email, password');
});

test(LoginSuite, '-> POST returns a 404 on invalid email', async (context) => {
  const res = await context.app
    .post('/auth/login')
    .send({ email: 'nope@email.com', password: 'notEvenAPassword' });

  assertEquals(res.status, 404);
  assertEquals(res.body.message, 'User not found');
});

test(LoginSuite, '-> POST returns 403 if not validated', async (context) => {
  const res = await context.app
    .post('/auth/login')
    .send({ email: users.valid[1].email, password: users.valid[1].password });

  assertEquals(res.status, 403);
  assertEquals(res.body.message, 'Account must be validated');
});

test(LoginSuite, '-> POST returns 401 on invalid password', async (context) => {
  const res = await context.app
    .post('/auth/login')
    .send({ email: users.valid[0].email, password: 'thewrongpassword' });

  assertEquals(res.status, 401);
  assertEquals(res.body.message, 'Invalid password');
});

test(LoginSuite, '-> POST returns 201 and token on login', async (context) => {
  const res = await context.app
    .post('/auth/login')
    .send({ email: users.valid[0].email, password: users.valid[0].password });

  assertEquals(res.status, 201);
  assertExists(res.body.user);
  assertExists(res.body.token);
});
