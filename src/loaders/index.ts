import { Opine } from '../../deps.ts';

import opineLoader from './opine.ts';
import dependencyInjector from './dependencyInjector.ts';
import errorHandlers from './errorHandlers.ts';

export default async ({ opineApp }: { opineApp: Opine }) => {
  console.log('Running loaders...');
  await dependencyInjector();
  opineLoader(opineApp);
  errorHandlers(opineApp);
};
