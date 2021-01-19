import { Router } from '../../deps.ts';
import auth from './routes/auth.ts';
import contestRoutes from './routes/contest/index.ts';
import users from './routes/users.ts';

export default () => {
  console.log('Loading routers...');
  const app = Router();

  auth(app);
  users(app);
  contestRoutes(app);

  console.log('Routers loaded.');
  return app;
};
