import { Router } from '../../deps.ts';
import auth from './routes/auth.ts';
import submissions from './routes/submissions.ts';

export default () => {
  console.log('Loading routers...');
  const app = Router();

  auth(app);
  submissions(app);

  console.log('Routers loaded.');
  return app;
};
