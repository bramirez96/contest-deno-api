import { opine } from '../deps.ts';
import loaders from './loaders/index.ts';

export default async () => {
  const app = opine();

  await loaders({ opineApp: app });
  console.log('Loaders complete.');

  return app;
};
