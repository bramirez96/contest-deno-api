import { Router } from '../../deps.ts';
import auth from './routes/auth.ts';

export default () => {
  console.log('Loading routers...');
  const app = Router();

  auth(app);

  console.log('Routers loaded.');
  return app;
};
