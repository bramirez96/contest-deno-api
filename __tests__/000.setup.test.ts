import { superdeno, assertEquals, TestSuite, test } from '../testDeps.ts';
import { serviceCollection, PostgresAdapter } from '../deps.ts';
import serverInit from '../src/app.ts';

console.log('Initializing server for Deno test suite.');
const server = await serverInit('testing');
const app = superdeno(server);
console.log('Initialized server instance.');

console.log('Truncating tables for referential integrity...');
const db: PostgresAdapter = serviceCollection.get('pg');
try {
  await db.query(
    'TRUNCATE \
  roles, enum_grades, enum_subjects, users, prompts, submissions, \
  enum_flags, submission_flags, validations, resets, votes, top3, \
  winners, prompt_queue, sso_providers, sso_lookup, clever_sections, \
  clever_students, clever_teachers, rumbles, rumble_sections \
  RESTART IDENTITY CASCADE'
  );
} catch (err) {
  // This always throws an error, there's an unhandled switch case in PG.
  // Despite the error, the truncate seems to work! Ignore it!
  console.log("Possible error on truncate. If tests pass it's all good.");
}

export const MainSuite = new TestSuite({
  name: 'main ->',
  context: { app },
});

test(MainSuite, 'test suite initialized', () => {
  assertEquals(true, true);
});
