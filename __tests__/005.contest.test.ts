import {
  test,
  TestSuite,
  assertEquals,
  assertStringIncludes,
  DatabaseResult,
} from '../testDeps.ts';
import { IMainSuiteContext, MainSuite } from './000.setup.test.ts';
import enumItems from './testData/enum.ts';

const ContestSuite = new TestSuite({
  name: '/contest',
  suite: MainSuite,
});
