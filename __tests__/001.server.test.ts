import {
  assertEquals,
  assertObjectMatch,
  test,
  TestSuite,
} from '../testDeps.ts';
import { MainSuite } from './000.setup.test.ts';

const ServerSuite = new TestSuite({
  name: 'server ->',
  suite: MainSuite,
});

test(ServerSuite, 'GET /status returns a 200', async (context) => {
  const res = await context.app.get('/status');
  assertEquals(res.status, 200);
  assertObjectMatch(res.body, { message: 'API up!' });
});
