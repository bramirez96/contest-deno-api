import { IRouter, Router } from '../../../../deps.ts';
import adminContest from './adminContest.ts';
import prompts from './prompts.ts';
import submissions from './submissions.ts';

export default (app: IRouter) => {
  console.log('Loading contest routers...');
  const contestRouter = Router();
  app.use('/contest', contestRouter);

  submissions(contestRouter);
  prompts(contestRouter);
  adminContest(contestRouter);

  console.log('Contest routers loaded.');
};
