import { opine } from '../deps.ts';
import loaders from './loaders/index.ts';

export default async (loggerName?: string) => {
  const app = opine();

  await loaders({ opineApp: app, loggerName });
  console.log('Loaders complete.');

  return app;
};
