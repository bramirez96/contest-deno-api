import { assertEquals, test, TestSuite } from '../testDeps.ts';
import { MainSuite } from './000.setup.test.ts';

test(MainSuite, 'returns a 404 on invalid route', async (context) => {
  const res = await context.app.get('/not/real');
  assertEquals(res.status, 404);
  assertEquals(res.body.message, 'Route not found');
});

const ServerSuite = new TestSuite({
  name: '/status ->',
  suite: MainSuite,
});

test(ServerSuite, 'returns a 200', async (context) => {
  const res = await context.app.get('/status');
  assertEquals(res.status, 200);
  assertEquals(res.body.message, 'API up!');
});
