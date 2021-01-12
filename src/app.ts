import 'https://cdn.pika.dev/@abraham/reflection@^0.7.0';
import { opine } from '../deps.ts';
import env from './config/env.ts';
import loaders from './loaders/index.ts';

const startServer = async () => {
  const app = opine();

  await loaders({ opineApp: app });
  console.log('Loaders complete.');

  app.listen(env.PORT, () => {
    console.log(`== Server listening on port ${env.PORT} ==`);
  });
};

startServer();
