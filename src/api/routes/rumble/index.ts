import { IRouter, Router } from '../../../../deps.ts';
import data from './data.ts';
import students from './students.ts';
import teachers from './teachers.ts';
import sections from './sections.ts';

export default (app: IRouter) => {
  console.log('Loading rumble routers...');
  const rumbleRouter = Router();
  app.use('/rumble', rumbleRouter);

  teachers(rumbleRouter);
  students(rumbleRouter);
  sections(rumbleRouter);
  data(rumbleRouter);

  console.log('Rumble routers loaded.');
};
