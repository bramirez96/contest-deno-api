import {
  test,
  TestSuite,
  assertEquals,
  assertStringIncludes,
  assertExists,
} from '../testDeps.ts';
import { MainSuite } from './000.setup.test.ts';
import _enum from './testData/enum.ts';
import submissions from './testData/submissions.ts';
import users from './testData/users.ts';

const SubSuite = new TestSuite({
  name: '/contest/submit',
  suite: MainSuite,
});

const UploadSubSuite = new TestSuite({
  name: '-> POST',
  suite: SubSuite,
  beforeAll: async (context) => {
    const res = await context.app.post('/auth/login').send({
      email: users.valid[0].email,
      password: users.newPass,
    });
    context.token = res.body.token;

    await context.db.table('prompts').insert(_enum.prompts).execute();
  },
});

test(UploadSubSuite, 'returns a 401 on missing token', async (context) => {
  const res = await context.app.post('/contest/submit');
  assertEquals(res.status, 401);
  assertEquals(res.body.message, 'You must be logged in');
});

test(UploadSubSuite, 'returns a 400 on empty body', async (context) => {
  const res = await context.app
    .post('/contest/submit')
    .set('Authorization', context.token);

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'story, promptId');
});

test(
  UploadSubSuite,
  'should return 400 on invalid file field name',
  async (context) => {
    const res = await context.app
      .post('/contest/submit')
      .set('Authorization', context.token)
      .send(submissions.invalidField);

    assertEquals(res.status, 400);
    assertStringIncludes(res.body.message, ': story');
  }
);

test(
  UploadSubSuite,
  'should return 422 on invalid file type',
  async (context) => {
    const res = await context.app
      .post('/contest/submit')
      .set('Authorization', context.token)
      .send(submissions.invalidFile);

    assertEquals(res.status, 422);
    assertEquals(res.body.message, 'Unsupported file type');
  }
);

test(
  UploadSubSuite,
  'should return 409 on invalid prompt id',
  async (context) => {
    const res = await context.app
      .post('/contest/submit')
      .set('Authorization', context.token)
      .send(submissions.invalidPrompt);

    assertEquals(res.status, 409);
    assertEquals(res.body.message, 'Invalid foreign key');
  }
);

test(
  UploadSubSuite,
  'returns a 201 on successful jpeg upload',
  async (context) => {
    const res = await context.app
      .post('/contest/submit')
      .set('Authorization', context.token)
      .send(submissions.validFile[0]);

    assertEquals(res.status, 201);
    assertStringIncludes(res.body.message, 'Upload successful!');
  }
);

test(UploadSubSuite, 'successfully uploads sub for user 2', async (context) => {
  const { status, body } = await context.app.post('/auth/login').send({
    email: users.valid[1].email,
    password: users.valid[1].password,
  });
  assertEquals(status, 201);
  assertExists(body.token);
  assertExists(body.user);

  const res = await context.app
    .post('/contest/submit')
    .set('Authorization', body.token)
    .send(submissions.validFile[1]);
  assertEquals(res.status, 201);
  assertStringIncludes(res.body.message, 'Upload successful!');
});

test(UploadSubSuite, 'successfully uploads sub for user 3', async (context) => {
  const { status, body } = await context.app.post('/auth/login').send({
    email: users.valid[2].email,
    password: users.valid[2].password,
  });
  assertEquals(status, 201);
  assertExists(body.token);
  assertExists(body.user);

  const res = await context.app
    .post('/contest/submit')
    .set('Authorization', body.token)
    .send(submissions.validFile[2]);
  assertEquals(res.status, 201);
  assertStringIncludes(res.body.message, 'Upload successful!');
});

const UploadSubSuiteCheck = new TestSuite({
  name: 'check ->',
  suite: SubSuite,
});

test(
  UploadSubSuiteCheck,
  'there should be 3 submissions in the database',
  async (context) => {
    const subs = await context.db.table('submissions').select('*').execute();
    assertEquals(subs.length, 3);
  }
);
