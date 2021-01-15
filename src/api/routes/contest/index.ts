import { IRouter, Router } from '../../../../deps.ts';
import submissions from './submissions.ts';

export default (app: IRouter) => {
  console.log('Loading contest routers...');
  const contestRouter = Router();
  app.use('/contest', contestRouter);

  submissions(contestRouter);

  console.log('Contest routers loaded.');
};
