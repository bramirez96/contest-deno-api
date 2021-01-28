import { IRouter, Router } from '../../../../deps.ts';
import adminContest from './adminContest.ts';
import prompts from './prompts.ts';
import queue from './queue.ts';
import submissions from './submissions.ts';
import top3 from './top3.ts';
import winners from './winners.ts';

export default (app: IRouter) => {
  console.log('Loading contest routers...');
  const contestRouter = Router();
  app.use('/contest', contestRouter);

  submissions(contestRouter);
  prompts(contestRouter);
  adminContest(contestRouter);
  queue(contestRouter);
  winners(contestRouter);
  top3(contestRouter);

  console.log('Contest routers loaded.');
};
