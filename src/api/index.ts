import { Router } from '../../deps.ts';
import auth from './routes/auth.ts';
import contestRoutes from './routes/contest/index.ts';

export default () => {
  console.log('Loading routers...');
  const app = Router();

  auth(app);
  contestRoutes(app);

  console.log('Routers loaded.');
  return app;
};
