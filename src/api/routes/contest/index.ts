import { IRouter, Router } from '../../../../deps.ts';
import prompts from './prompts.ts';
import submissions from './submissions.ts';
import votes from './votes.ts';

export default (app: IRouter) => {
  console.log('Loading contest routers...');
  const contestRouter = Router();
  app.use('/contest', contestRouter);

  submissions(contestRouter);
  prompts(contestRouter);
  votes(contestRouter);

  console.log('Contest routers loaded.');
};
