import { superdeno, assertEquals, TestSuite, test } from '../testDeps.ts';
import serverInit from '../src/app.ts';

console.log('Initializing server for Deno test suite.');
const server = await serverInit('testing');
const app = superdeno(server);
console.log('Initialized server instance.');

export const MainSuite = new TestSuite({
  name: 'main ->',
  context: { app },
});

test(MainSuite, 'test suite initialized', () => {
  assertEquals(true, true);
});
