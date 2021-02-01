import {
  test,
  TestSuite,
  assertEquals,
  assertStringIncludes,
  DatabaseResult,
  assertExists,
} from '../testDeps.ts';
import { IMainSuiteContext, MainSuite } from './000.setup.test.ts';
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

const GetSubsSuite = new TestSuite({
  name: '-> GET',
  suite: SubSuite,
});

test(GetSubsSuite, 'returns a list of submissions', async (context) => {
  const res = await context.app.get('/contest/submissions');

  assertEquals(res.status, 200);
  assertEquals(res.body.length, 3);
});

const PostTop3Suite = new TestSuite<
  IMainSuiteContext & { top10: DatabaseResult[] }
>({
  name: '/top -> POST',
  suite: SubSuite,
  beforeAll: async (context) => {
    const res = await context.app.get('/contest/submissions');
    context.top10 = res.body;
  },
});

test(PostTop3Suite, 'returns a 400 on empty body', async (context) => {
  const res = await context.app.post('/contest/submissions/top');

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(PostTop3Suite, 'returns a 400 with less than 3 subs', async (context) => {
  const res = await context.app
    .post('/contest/submissions/top')
    .send({ ids: [2, 3] });

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(PostTop3Suite, 'returns a 400 with more than 3 subs', async (context) => {
  const res = await context.app
    .post('/contest/submissions/top')
    .send({ ids: [2, 3, 4, 5] });

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(PostTop3Suite, 'throw a 409 on invalid subIds', async (context) => {
  const res = await context.app
    .post('/contest/submissions/top')
    .send({ ids: [2, 8, 10] });

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Invalid foreign key');
});

test(PostTop3Suite, 'returns a 201 on success', async (context) => {
  const ids = context.top10.map((x) => x.id).slice(0, 3);
  const res = await context.app.post('/contest/submissions/top').send({ ids });

  assertEquals(res.status, 201);
  assertEquals(res.body.message, 'Top 3 successfully set!');
  assertEquals(res.body.top3.length, 3);
});

const PostFlagsSuite = new TestSuite({
  name: '/flags -> POST',
  suite: SubSuite,
  beforeAll: async (context) => {
    await context.db.table('enum_flags').insert(_enum.flags).execute();
  },
});

test(
  PostFlagsSuite,
  'returns a 409 on invalid submissionId',
  async (context) => {
    const res = await context.app
      .post('/contest/submissions/flags?submissionId=20')
      .send({ flags: [1] });

    assertEquals(res.status, 409);
    assertEquals(res.body.message, 'Invalid foreign key');
  }
);

test(PostFlagsSuite, 'returns a 404 on invalid flagId', async (context) => {
  const res = await context.app
    .post('/contest/submissions/flags?submissionId=2')
    .send({ flags: [20] });

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Invalid foreign key');
});

test(PostFlagsSuite, 'adds a flag to subId 2', async (context) => {
  const res = await context.app
    .post('/contest/submissions/flags?submissionId=2')
    .send({ flags: [1] });

  assertEquals(res.status, 201);
  assertEquals(res.body.message, 'Successfully flagged submission');
});

test(PostFlagsSuite, 'returns a 409 on duplicate flag', async (context) => {
  const res = await context.app
    .post('/contest/submissions/flags?submissionId=2')
    .send({ flags: [1] });

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Could not create duplicate');
});

const GetFlagsSuite = new TestSuite({
  name: '/flags -> GET',
  suite: SubSuite,
});

test(GetFlagsSuite, 'returns a 201 with a list of flags', async (context) => {
  const res = await context.app.get(
    '/contest/submissions/flags?submissionId=2'
  );

  assertEquals(res.status, 200);
  assertEquals(res.body.message, 'Received flags');
  assertEquals(res.body.flags.length, 1);
});
