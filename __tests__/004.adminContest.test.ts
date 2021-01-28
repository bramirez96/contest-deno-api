import {
  test,
  TestSuite,
  assertEquals,
  assertStringIncludes,
  DatabaseResult,
} from '../testDeps.ts';
import { IMainSuiteContext, MainSuite } from './000.setup.test.ts';
import enumItems from './testData/enum.ts';

const AdminContest = new TestSuite({
  name: '/contest/admin',
  suite: MainSuite,
});

const AdminContestGetSubs = new TestSuite({
  name: '/top -> GET',
  suite: AdminContest,
});

test(AdminContestGetSubs, 'returns a list of submissions', async (context) => {
  const res = await context.app.get('/contest/admin/top');

  assertEquals(res.status, 200);
  assertEquals(res.body.length, 3);
});

const AdminPostTop3 = new TestSuite<
  IMainSuiteContext & { top10: DatabaseResult[] }
>({
  name: '/top -> POST',
  suite: AdminContest,
  beforeAll: async (context) => {
    const res = await context.app.get('/contest/admin/top');
    context.top10 = res.body;
  },
});

test(AdminPostTop3, 'returns a 400 on empty body', async (context) => {
  const res = await context.app.post('/contest/admin/top');

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(AdminPostTop3, 'returns a 400 with less than 3 subs', async (context) => {
  const res = await context.app
    .post('/contest/admin/top')
    .send({ ids: [2, 3] });

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(AdminPostTop3, 'returns a 400 with more than 3 subs', async (context) => {
  const res = await context.app
    .post('/contest/admin/top')
    .send({ ids: [2, 3, 4, 5] });

  assertEquals(res.status, 400);
  assertStringIncludes(res.body.message, 'ids');
});

test(AdminPostTop3, 'throw a 409 on invalid subIds', async (context) => {
  const res = await context.app
    .post('/contest/admin/top')
    .send({ ids: [2, 8, 10] });

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Invalid foreign key');
});

test(AdminPostTop3, 'returns a 201 on success', async (context) => {
  const res = await context.app
    .post('/contest/admin/top')
    .send({ ids: context.top10.map((x) => x.id).slice(0, 3) });

  assertEquals(res.status, 201);
  assertEquals(res.body.message, 'Top 3 successfully set!');
  assertEquals(res.body.top3.length, 3);
});

const AdminPostFlags = new TestSuite({
  name: '/flags -> POST',
  suite: AdminContest,
  beforeAll: async (context) => {
    await context.db.table('enum_flags').insert(enumItems.flags).execute();
  },
});

test(
  AdminPostFlags,
  'returns a 409 on invalid submissionId',
  async (context) => {
    const res = await context.app
      .post('/contest/admin/flags?submissionId=20')
      .send({ flags: [1] });

    assertEquals(res.status, 409);
    assertEquals(res.body.message, 'Invalid foreign key');
  }
);

test(AdminPostFlags, 'returns a 404 on invalid flagId', async (context) => {
  const res = await context.app
    .post('/contest/admin/flags?submissionId=2')
    .send({ flags: [20] });

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Invalid foreign key');
});

test(AdminPostFlags, 'adds a flag to subId 2', async (context) => {
  const res = await context.app
    .post('/contest/admin/flags?submissionId=2')
    .send({ flags: [1] });

  assertEquals(res.status, 201);
  assertEquals(res.body.message, 'Successfully flagged submission');
});

test(AdminPostFlags, 'returns a 409 on duplicate flag', async (context) => {
  const res = await context.app
    .post('/contest/admin/flags?submissionId=2')
    .send({ flags: [1] });

  assertEquals(res.status, 409);
  assertEquals(res.body.message, 'Could not create duplicate');
});

const AdminGetFlags = new TestSuite({
  name: '/flags -> GET',
  suite: AdminContest,
});

test(AdminGetFlags, 'returns a 201 with a list of flags', async (context) => {
  const res = await context.app.get('/contest/admin/flags?submissionId=2');

  assertEquals(res.status, 200);
  assertEquals(res.body.message, 'Received flags');
  assertEquals(res.body.flags.length, 1);
});
