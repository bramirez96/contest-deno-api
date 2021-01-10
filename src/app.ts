import 'https://cdn.pika.dev/@abraham/reflection@^0.7.0';
import { opine } from '../deps.ts';
import loaders from './loaders/index.ts';

const PORT = 8000;

const startServer = () => {
  const app = opine();

  loaders({ opineApp: app });
  console.log('Loaders complete.');

  app.listen(PORT, () => {
    console.log(`== Server listening on port ${PORT} ==`);
  });
};

startServer();
