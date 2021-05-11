import { Router } from '../../deps.ts';
import auth from './routes/auth.ts';
import contestRoutes from './routes/contest/index.ts';
import prompts from './routes/prompts.ts';
import rumbleRoutes from './routes/rumble/index.ts';
import submissions from './routes/submissions.ts';
import users from './routes/users.ts';

export default () => {
  console.log('Loading routers...');
  const app = Router();

  auth(app);
  users(app);
  contestRoutes(app);
  rumbleRoutes(app);
  submissions(app);
  prompts(app);

  console.log('Routers loaded.');
  return app;
};
