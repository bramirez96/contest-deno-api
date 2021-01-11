import { Opine } from '../../deps.ts';

import opineLoader from './opine.ts';
import dependencyInjector from './dependencyInjector.ts';

export default async ({ opineApp }: { opineApp: Opine }) => {
  console.log('Running loaders...');
  opineLoader(opineApp);
  await dependencyInjector();
};
