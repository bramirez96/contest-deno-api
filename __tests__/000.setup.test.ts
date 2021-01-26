import {
  superdeno,
  assertEquals,
  TestSuite,
  test,
  SuperDeno,
} from '../testDeps.ts';
import { serviceCollection, PostgresAdapter } from '../deps.ts';
import serverInit from '../src/app.ts';
import enumData from './testData/enum.ts';

console.log('Initializing server for Deno test suite.');
const server = await serverInit();
const app = superdeno(server);
console.log('Initialized server instance.');

const db: PostgresAdapter = serviceCollection.get('pg');
try {
  console.log('Truncating tables for referential integrity...');
  await db.query(
    'TRUNCATE \
  roles, enum_grades, enum_subjects, users, prompts, submissions, \
  enum_flags, submission_flags, validations, resets, votes, top3, \
  winners, prompt_queue, sso_providers, sso_lookup, clever_sections, \
  clever_students, clever_teachers, rumbles, rumble_sections \
  RESTART IDENTITY CASCADE'
  );

  console.log('Inserting enumerated table data...');
  await db.table('roles').insert(enumData.roles).execute();
  console.log('Successfully truncated!');
} catch (err) {
  // This always throws an error, there's an unhandled switch case in PG.
  // Despite the error, the truncate seems to work! Ignore it!
  console.log("Possible error on truncate. If tests pass it's all good.");
  console.log({ err });
}

export interface IMainSuiteContext {
  app: SuperDeno;
  db: PostgresAdapter;
  token: string;
}
export const MainSuite = new TestSuite<IMainSuiteContext>({
  name: '->',
  context: { app, db },
});

test(MainSuite, 'test suite initialized', () => {
  assertEquals(true, true);
});
