import { IRouter, log, Router, serviceCollection } from '../../../../deps.ts';
import { Roles } from '../../../interfaces/roles.ts';
import RumbleService from '../../../services/rumble.ts';
import authHandler from '../../middlewares/authHandler.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const rumbleServiceInstance = serviceCollection.get(RumbleService);
  app.use('/rumbles', route);

  // GET /rumbles/:rumbleId/students - returns a list of students with subs
  route.get(
    '/:rumbleId/students',
    authHandler({ roles: [Roles.admin, Roles.teacher] }),
    async (req, res) => {
      try {
        const students = await rumbleServiceInstance.getStudentsWithSubForRumble(
          parseInt(req.params.rumbleId, 10)
        );
        console.log(
          'students',
          students.map((s) => s.submissions)
        );
        res.setStatus(200).json(students);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );
};
