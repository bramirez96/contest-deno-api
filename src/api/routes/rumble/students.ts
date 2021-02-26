import { Router, IRouter, log, serviceCollection } from '../../../../deps.ts';
import { Roles } from '../../../interfaces/roles.ts';
import CleverStudentModel from '../../../models/cleverStudents.ts';
import authHandler from '../../middlewares/authHandler.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const studentModelInstance = serviceCollection.get(CleverStudentModel);
  app.use('/students', route);

  // GET /students/:studentId/sections returns ISection[]
  route.get(
    '/:studentId/sections',
    authHandler({ roles: [Roles.admin, Roles.teacher] }),
    async (req, res) => {
      try {
        const sections = await studentModelInstance.getSectionsById(
          parseInt(req.params.studentId, 10)
        );
        res.setStatus(200).json(sections);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  console.log('Rumble students route loaded.');
};
