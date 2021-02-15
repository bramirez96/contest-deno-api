import { bcrypt } from '../deps.ts';
import { Flags } from '../src/interfaces/enumFlags.ts';
import {
  test,
  TestSuite,
  assertEquals,
  assertNotEquals,
  assertStringIncludes,
  assertExists,
} from '../testDeps.ts';
import { MainSuite } from './000.setup.test.ts';
import _enum from './testData/enum.ts';
import submissions from './testData/submissions.ts';
import users from './testData/users.ts';

const S = new TestSuite({
  name: '/api',
  suite: MainSuite,
  beforeAll: async (context) => {
    if (!context.token) {
      const hash = await bcrypt.hash(users.admin.password);

      await context.db
        .table('users')
        .insert({ ...users.admin, password: hash })
        .execute();
      console.log('Admin user added to table...');

      const res = await context.app.post('/api/auth/login').send({
        email: users.admin.email,
        password: users.admin.password,
      });
      context.token = res.body.token;
      console.log('Auth token for admin users stored in context...');

      await context.db.table('enum_flags').insert(_enum.flags).execute();
      await context.db.table('prompts').insert(_enum.prompts).execute();
      console.log('Test data added for prompts and flags...');
    }
  },
});

const SubSuite = new TestSuite({
  name: '/contest/submit',
  suite: S,
});

const UploadSubSuite = new TestSuite({
  name: '-> POST',
  suite: SubSuite,
});

test(UploadSubSuite, 'returns a 401 on missing token', async (context) => {
  const res = await context.app.post('/api/contest/submit');
  assertEquals(res.status, 401);
  assertEquals(res.body.message, 'You must be logged in');
});

test(UploadSubSuite, 'returns a 400 on empty body', async (context) => {
  const res = await context.app
    .post('/api/contest/submit')
    .set('Authorization', context.token);

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'story, promptId');
});

test(UploadSubSuite, 'return 400 on invalid field name', async (context) => {
  const res = await context.app
    .post('/api/contest/submit')
    .set('Authorization', context.token)
    .send(submissions.invalidField);

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, ': story');
});

test(UploadSubSuite, 'returns 422 on invalid file type', async (context) => {
  const res = await context.app
    .post('/api/contest/submit')
    .set('Authorization', context.token)
    .send(submissions.invalidFile);

  assertEquals(res.status, 422);
  assertEquals(res.body.message, 'Unsupported file type');
});

test(UploadSubSuite, 'returns 409 on invalid prompt id', async (context) => {
  const res = await context.app
    .post('/api/contest/submit')
    .set('Authorization', context.token)
    .send(submissions.invalidPrompt);

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Invalid foreign key');
});

test(UploadSubSuite, 'returns a 201 on jpeg upload', async (context) => {
  const res = await context.app
    .post('/api/contest/submit')
    .set('Authorization', context.token)
    .send(submissions.validFile[0]);

  assertEquals(res.status, 201);
  assertStringIncludes(res.body.message, 'Upload successful!');
});

test(UploadSubSuite, 'successfully uploads sub for user 2', async (context) => {
  const { status, body } = await context.app.post('/api/auth/login').send({
    email: users.valid[1].email,
    password: users.valid[1].password,
  });
  assertEquals(status, 201);
  assertExists(body.token);
  assertExists(body.user);

  const res = await context.app
    .post('/api/contest/submit')
    .set('Authorization', body.token)
    .send(submissions.validFile[1]);
  assertEquals(res.status, 201);
  assertStringIncludes(res.body.message, 'Upload successful!');
});

test(UploadSubSuite, 'successfully uploads sub for user 3', async (context) => {
  const { status, body } = await context.app.post('/api/auth/login').send({
    email: users.valid[2].email,
    password: users.valid[2].password,
  });
  assertEquals(status, 201);
  assertExists(body.token);
  assertExists(body.user);

  const res = await context.app
    .post('/api/contest/submit')
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
  const res = await context.app
    .get('/api/contest/submissions')
    .set('Authorization', context.token);

  assertEquals(res.status, 200);
  assertEquals(res.body.length, 3);
});

test(GetSubsSuite, 'correctly limits responses', async (context) => {
  const res = await context.app
    .get('/api/contest/submissions?limit=1')
    .set('Authorization', context.token);

  assertEquals(res.status, 200);
  assertEquals(res.body.length, 1);
});

test(GetSubsSuite, 'correctly orders submissions', async (context) => {
  const res = await context.app
    .get('/api/contest/submissions?orderBy=score&order=DESC&limit=10')
    .set('Authorization', context.token);

  const isSortedByScore = (arr: { score: number }[]) => {
    let isSorted = true;
    arr.slice(1).forEach((i, ind) => {
      if (arr[ind].score < i.score) isSorted = false;
    });
    return isSorted;
  };
  assertEquals(isSortedByScore(res.body), true);
});

test(GetSubsSuite, 'correctly offsets responses', async (context) => {
  const res1 = await context.app
    .get('/api/contest/submissions?limit=1')
    .set('Authorization', context.token);
  assertEquals(res1.status, 200);
  assertEquals(res1.body.length, 1);

  const res2 = await context.app
    .get('/api/contest/submissions?limit=1&offset=1')
    .set('Authorization', context.token);
  assertEquals(res2.status, 200);
  assertEquals(res2.body.length, 1);

  assertNotEquals(res1.body[0].id, res2.body[0].id);
});

const GetSubById = new TestSuite({
  name: '/:id -> GET',
  suite: SubSuite,
});

test(GetSubById, 'returns the correct sub', async (context) => {
  const res = await context.app.get('/api/contest/submissions/2');

  assertEquals(res.status, 200);
  assertEquals(res.body.id, 2);
});

test(GetSubById, 'throws error on bad id', async (context) => {
  const res = await context.app.get('/api/contest/submissions/20');

  assertEquals(res.status, 404);
  assertEquals(res.body.message, 'Submission not found');
});

const PostTop3Suite = new TestSuite({
  name: '/top -> POST',
  suite: SubSuite,
});

test(PostTop3Suite, 'returns a 400 on empty body', async (context) => {
  const res = await context.app
    .post('/api/contest/submissions/top')
    .set('Authorization', context.token);

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(PostTop3Suite, 'returns a 400 with less than 3 subs', async (context) => {
  const res = await context.app
    .post('/api/contest/submissions/top')
    .send({ ids: [2, 3] })
    .set('Authorization', context.token);

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(PostTop3Suite, 'returns a 400 with more than 3 subs', async (context) => {
  const res = await context.app
    .post('/api/contest/submissions/top')
    .send({ ids: [2, 3, 4, 5] })
    .set('Authorization', context.token);

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(PostTop3Suite, 'throw a 409 on invalid subIds', async (context) => {
  const res = await context.app
    .post('/api/contest/submissions/top')
    .send({ ids: [2, 8, 10] })
    .set('Authorization', context.token);

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Invalid foreign key');
});

test(PostTop3Suite, 'returns a 201 on success', async (context) => {
  const { body } = await context.app
    .get('/api/contest/submissions?orderBy=score&order=DESC&limit=10')
    .set('Authorization', context.token);
  const ids = (body as { id: number }[]).map((x) => x.id).slice(0, 3);
  const res = await context.app
    .post('/api/contest/submissions/top')
    .send({ ids })
    .set('Authorization', context.token);

  assertEquals(res.status, 201);
  assertEquals(res.body.message, 'Top 3 successfully set!');
  assertEquals(res.body.top3.length, 3);
});

const PostFlagsSuite = new TestSuite({
  name: '/:id/flags -> POST',
  suite: SubSuite,
});

test(PostFlagsSuite, 'returns 409 on invalid submissionId', async (context) => {
  const res = await context.app
    .post('/api/contest/submissions/0/flags')
    .send({ flags: [1] })
    .set('Authorization', context.token);

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Invalid foreign key');
});

test(PostFlagsSuite, 'returns a 404 on invalid flagId', async (context) => {
  const res = await context.app
    .post('/api/contest/submissions/2/flags')
    .send({ flags: [20] })
    .set('Authorization', context.token);

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Invalid foreign key');
});

test(PostFlagsSuite, 'adds a flag to subId 2', async (context) => {
  const res = await context.app
    .post('/api/contest/submissions/2/flags')
    .send({ flags: [1] })
    .set('Authorization', context.token);

  assertEquals(res.status, 201);
  assertEquals(res.body.message, 'Successfully flagged submission');
});

test(PostFlagsSuite, 'returns a 409 on duplicate flag', async (context) => {
  const res = await context.app
    .post('/api/contest/submissions/2/flags')
    .send({ flags: [1] })
    .set('Authorization', context.token);

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Could not create duplicate');
});

const GetFlagsSuite = new TestSuite({
  name: '/:id/flags -> GET',
  suite: SubSuite,
});

test(GetFlagsSuite, 'returns a 201 with a list of flags', async (context) => {
  const res = await context.app
    .get('/api/contest/submissions/2/flags')
    .set('Authorization', context.token);

  assertEquals(res.status, 200);
  assertEquals(res.body.length, 1);
  assertEquals(res.body[0], Flags[1]);
});

test(GetFlagsSuite, 'returns empty 200 on invalid subId', async (context) => {
  const res = await context.app
    .get('/api/contest/submissions/20/flags')
    .set('Authorization', context.token);

  assertEquals(res.status, 200);
  assertEquals(res.body.length, 0);
});

const RemoveFlagSuite = new TestSuite({
  name: '/:id/flags/:flagId -> DELETE',
  suite: SubSuite,
});

test(RemoveFlagSuite, 'returns 204 on success', async (context) => {
  const res = await context.app
    .delete('/api/contest/submissions/20/flags/1')
    .set('Authorization', context.token);
  assertEquals(res.status, 204);
});

test(RemoveFlagSuite, 'throws error on NaN params', async (context) => {
  const res = await context.app
    .delete('/api/contest/submissions/whoa/flags/there')
    .set('Authorization', context.token);
  assertEquals(res.status, 400);
  assertEquals(res.body.message, 'Invalid data provided');
});
