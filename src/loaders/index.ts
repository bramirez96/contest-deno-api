import { Opine } from '../../deps.ts';

import opineLoader from './opine.ts';
import dependencyInjector from './dependencyInjector.ts';

export default async ({
  opineApp,
  loggerName,
}: {
  opineApp: Opine;
  loggerName?: string;
}) => {
  console.log('Running loaders...');
  await dependencyInjector(loggerName);
  opineLoader(opineApp);
};
