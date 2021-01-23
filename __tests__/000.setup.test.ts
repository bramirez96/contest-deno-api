import {
  superdeno,
  assertEquals,
  TestSuite,
  test,
  isFreePort,
  SuperDeno,
} from '../testDeps.ts';
import serverInit from '../src/app.ts';
import env from '../src/config/env.ts';

let app: SuperDeno;

try {
  console.log('INitializing server for Deno test suite.');
  if (!(await isFreePort(env.PORT))) throw new Error();

  const server = await serverInit('testing');

  console.log('Initialized server instance.');
  app = superdeno(server);
} catch (err) {
  console.log('Server already running! Using existing.');
  app = superdeno(env.SERVER_URL);
}

export const MainSuite = new TestSuite({
  name: 'main ->',
  context: { app },
});

test(MainSuite, 'test suite initialized', () => {
  assertEquals(true, true);
});
