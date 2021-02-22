import { IRouter, Router } from '../../../../deps.ts';
import students from './students.ts';
import teachers from './teachers.ts';

export default (app: IRouter) => {
  console.log('Loading rumble routers...');
  const rumbleRouter = Router();
  app.use('/rumble', rumbleRouter);

  teachers(rumbleRouter);
  students(rumbleRouter);

  console.log('Rumble routers loaded.');
};
