import { IRouter, Router } from '../../../../deps.ts';
import data from './data.ts';
import rumbles from './rumbles.ts';
import sections from './sections.ts';
import students from './students.ts';
import teachers from './teachers.ts';

export default (app: IRouter) => {
  console.log('Loading rumble routers...');
  const rumbleRouter = Router();
  app.use('/rumble', rumbleRouter);

  teachers(rumbleRouter);
  students(rumbleRouter);
  sections(rumbleRouter);
  rumbles(rumbleRouter);
  data(rumbleRouter);

  console.log('Rumble routers loaded.');
};
